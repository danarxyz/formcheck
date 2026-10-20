import { describe, expect, it } from "vitest";
import { MUSCLE_IDS } from "@/packages/library";
import { highlightFor, MUSCLE_REGIONS } from "../index";

describe("body map", () => {
  it("has a region mapping for every Muscle in the taxonomy", () => {
    for (const id of MUSCLE_IDS) expect(MUSCLE_REGIONS[id], id).toBeDefined();
  });

  it("colours primary and secondary regions separately", () => {
    expect(
      highlightFor([
        { muscle: "biceps-brachii", role: "primary" },
        { muscle: "brachioradialis", role: "secondary" },
      ]),
    ).toEqual({ primary: ["biceps"], secondary: ["forearm"] });
  });

  it("shows a region as primary when a primary and a secondary Muscle share it", () => {
    // Lats and rhomboids both draw as "upper-back" — the coarse renderer ADR-0002 accepts.
    expect(
      highlightFor([
        { muscle: "latissimus-dorsi", role: "primary" },
        { muscle: "rhomboids", role: "secondary" },
      ]),
    ).toEqual({ primary: ["upper-back"], secondary: [] });
  });

  it("skips Muscles the renderer cannot draw", () => {
    expect(highlightFor([{ muscle: "hip-flexors", role: "primary" }])).toEqual({ primary: [], secondary: [] });
  });
});
