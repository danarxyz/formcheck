import { sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createPlans, PlanError, parsePlanDate, type PlanDate, type Plans } from "../index";
import { createTestDb } from "./test-db";

const KNOWN = new Set(["deadlift", "pull-up", "barbell-row"]);
const day = (s: string) => parsePlanDate(s) as PlanDate;
const MON = day("2026-10-19");
const TUE = day("2026-10-20");

let db: Awaited<ReturnType<typeof createTestDb>>;
let plans: Plans;

beforeAll(async () => {
  db = await createTestDb();
  plans = createPlans(db, { isExerciseSlug: (s) => KNOWN.has(s) });
});

beforeEach(async () => {
  await db.execute(sql`truncate plans restart identity cascade`);
});

describe("Plans", () => {
  it("a date with nothing added has an empty Plan", async () => {
    expect(await plans.get("owner-a", MON)).toEqual({ date: MON, exerciseSlugs: [] });
  });

  it("adds Exercises in the order they were added", async () => {
    await plans.add("owner-a", MON, "deadlift");
    const plan = await plans.add("owner-a", MON, "pull-up");
    expect(plan.exerciseSlugs).toEqual(["deadlift", "pull-up"]);
    expect(await plans.get("owner-a", MON)).toEqual(plan);
  });

  it("refuses an Exercise already in the Plan", async () => {
    await plans.add("owner-a", MON, "deadlift");
    await expect(plans.add("owner-a", MON, "deadlift")).rejects.toThrow(
      expect.objectContaining({ code: "already-in-plan" }),
    );
    expect((await plans.get("owner-a", MON)).exerciseSlugs).toEqual(["deadlift"]);
  });

  it("refuses an Exercise that is not in the Library", async () => {
    await expect(plans.add("owner-a", MON, "bench-press")).rejects.toBeInstanceOf(PlanError);
    await expect(plans.add("owner-a", MON, "bench-press")).rejects.toThrow(
      expect.objectContaining({ code: "unknown-exercise" }),
    );
  });

  it("keeps each date's Plan separate", async () => {
    await plans.add("owner-a", MON, "deadlift");
    await plans.add("owner-a", TUE, "pull-up");
    expect((await plans.get("owner-a", MON)).exerciseSlugs).toEqual(["deadlift"]);
    expect((await plans.get("owner-a", TUE)).exerciseSlugs).toEqual(["pull-up"]);
  });

  it("never shows one owner's Plan to another", async () => {
    await plans.add("owner-a", MON, "deadlift");
    expect((await plans.get("owner-b", MON)).exerciseSlugs).toEqual([]);
    await plans.add("owner-b", MON, "deadlift");
    expect((await plans.get("owner-a", MON)).exerciseSlugs).toEqual(["deadlift"]);
  });

  it("removes an Exercise and keeps the rest in order", async () => {
    for (const s of ["deadlift", "pull-up", "barbell-row"]) await plans.add("owner-a", MON, s);
    const plan = await plans.remove("owner-a", MON, "pull-up");
    expect(plan.exerciseSlugs).toEqual(["deadlift", "barbell-row"]);
  });

  it("removing an Exercise that is not there changes nothing", async () => {
    await plans.add("owner-a", MON, "deadlift");
    expect((await plans.remove("owner-a", MON, "pull-up")).exerciseSlugs).toEqual(["deadlift"]);
    expect((await plans.remove("owner-a", TUE, "pull-up")).exerciseSlugs).toEqual([]);
  });

  it("an Exercise removed can be added again, at the end", async () => {
    for (const s of ["deadlift", "pull-up"]) await plans.add("owner-a", MON, s);
    await plans.remove("owner-a", MON, "deadlift");
    expect((await plans.add("owner-a", MON, "deadlift")).exerciseSlugs).toEqual(["pull-up", "deadlift"]);
  });

  it("reorders the Plan", async () => {
    for (const s of ["deadlift", "pull-up", "barbell-row"]) await plans.add("owner-a", MON, s);
    const plan = await plans.reorder("owner-a", MON, ["barbell-row", "deadlift", "pull-up"]);
    expect(plan.exerciseSlugs).toEqual(["barbell-row", "deadlift", "pull-up"]);
    expect(await plans.get("owner-a", MON)).toEqual(plan);
  });

  it("refuses a reorder that adds, drops or repeats Exercises", async () => {
    for (const s of ["deadlift", "pull-up"]) await plans.add("owner-a", MON, s);
    for (const bad of [["deadlift"], ["deadlift", "pull-up", "barbell-row"], ["deadlift", "deadlift"]]) {
      await expect(plans.reorder("owner-a", MON, bad)).rejects.toThrow(
        expect.objectContaining({ code: "not-a-reordering" }),
      );
    }
    expect((await plans.get("owner-a", MON)).exerciseSlugs).toEqual(["deadlift", "pull-up"]);
  });
});
