import { describe, expect, it } from "vitest";
import {
  getExercise,
  isExerciseSlug,
  listExercises,
  searchExercises,
  validateLibrary,
  LibraryValidationError,
  type Exercise,
} from "../index";
import { validExercise } from "./fixtures";

describe("the shipped Library", () => {
  it("loads and every Exercise passes the content rules", () => {
    expect(listExercises().length).toBeGreaterThan(0);
    expect(() => validateLibrary(listExercises())).not.toThrow();
  });

  it("finds Exercises by slug", () => {
    const first = listExercises()[0]!;
    expect(getExercise(first.slug)).toEqual(first);
    expect(isExerciseSlug(first.slug)).toBe(true);
    expect(getExercise("does-not-exist")).toBeUndefined();
    expect(isExerciseSlug("does-not-exist")).toBe(false);
  });
});

describe("content rules", () => {
  const rejects = (patch: Record<string, unknown>, message: RegExp) => {
    expect(() => validateLibrary([{ ...validExercise(), ...patch }])).toThrow(message);
  };

  it("accepts a complete Exercise", () => {
    expect(validateLibrary([validExercise()])).toHaveLength(1);
  });

  it("requires at least 3 Cues", () => {
    rejects({ cues: ["Satu cue", "Dua cue"] }, /at least 3 Cues/);
  });

  it("rejects Cues too long to read between sets", () => {
    rejects({ cues: ["a".repeat(91), "Dua cue", "Tiga cue"] }, /under 90 characters/);
  });

  it("requires at least 2 Faults", () => {
    rejects({ faults: [{ description: "Satu", consequence: "Akibat" }] }, /at least 2 Faults/);
  });

  it("requires a primary Target Muscle", () => {
    rejects({ targetMuscles: [{ muscle: "biceps-brachii", role: "secondary" }] }, /primary Target Muscle/);
  });

  it("rejects Muscles outside the taxonomy", () => {
    rejects({ targetMuscles: [{ muscle: "upper-back", role: "primary" }] }, /targetMuscles/);
  });

  it("rejects a Muscle listed twice", () => {
    rejects(
      {
        targetMuscles: [
          { muscle: "biceps-brachii", role: "primary" },
          { muscle: "biceps-brachii", role: "secondary" },
        ],
      },
      /only once/,
    );
  });

  it("requires 2 Sources from different sites", () => {
    const sameSite = [
      { title: "Satu", url: "https://example.com/a", kind: "coach" },
      { title: "Dua", url: "https://example.com/b", kind: "coach" },
    ];
    rejects({ sources: sameSite }, /2 different sites/);
    rejects({ sources: sameSite.slice(0, 1) }, /at least 2 independent Sources/);
  });

  it("rejects a YouTube Reference Video that is not on YouTube", () => {
    rejects({ referenceVideo: { platform: "youtube", url: "https://vimeo.com/1" } }, /not a YouTube url/);
  });

  it("rejects a start time on non-YouTube videos", () => {
    rejects(
      { referenceVideo: { platform: "tiktok", url: "https://www.tiktok.com/@x/video/1", startSeconds: 5 } },
      /only supported for YouTube/,
    );
  });

  it("keeps the Form Animation slot empty in the MVP", () => {
    rejects({ formAnimation: { frames: [] } }, /formAnimation/);
  });

  it("rejects unknown fields so typos never pass silently", () => {
    rejects({ cuess: [] }, /cuess|Unrecognized/);
  });

  it("rejects duplicate slugs across the Library", () => {
    expect(() => validateLibrary([validExercise(), validExercise()])).toThrow(/duplicate slug/);
  });

  it("reports every problem at once", () => {
    try {
      validateLibrary([{ ...validExercise(), cues: [], faults: [] }]);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(LibraryValidationError);
      expect((error as LibraryValidationError).problems.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("searching the Library", () => {
  const curl = validExercise() as Exercise;
  const row = {
    ...curl,
    slug: "test-row",
    name: "Test Row",
    targetMuscles: [
      { muscle: "rhomboids", role: "primary" },
      { muscle: "biceps-brachii", role: "secondary" },
    ],
  } as Exercise;
  const all = [row, curl];

  it("matches names case-insensitively", () => {
    expect(searchExercises(all, { text: "  ROW " }).map((e) => e.slug)).toEqual(["test-row"]);
  });

  it("filters by Target Muscle, primary matches first", () => {
    expect(searchExercises(all, { muscle: "biceps-brachii" }).map((e) => e.slug)).toEqual(["test-curl", "test-row"]);
    expect(searchExercises(all, { muscle: "hamstrings" })).toEqual([]);
  });

  it("returns everything, sorted by name, for an empty query", () => {
    expect(searchExercises(all, {}).map((e) => e.slug)).toEqual(["test-curl", "test-row"]);
  });
});
