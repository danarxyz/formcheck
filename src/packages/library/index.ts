/**
 * Entry point of the Library package (see CONTEXT.md › Library, ADR-0001).
 *
 * The Library is validated when this module loads, so invalid content fails
 * `pnpm build` and `pnpm test` — it can never reach the running app.
 *
 * To add an Exercise: create `lib/exercises/<slug>.ts` using
 * `conventional-deadlift.ts` as the template, then add it to RAW below.
 */
import { conventionalDeadlift } from "./lib/exercises/conventional-deadlift";
import type { Exercise } from "./lib/schema";
import { searchExercises, type ExerciseQuery } from "./lib/search";
import { validateLibrary } from "./lib/validate";

const RAW: readonly unknown[] = [conventionalDeadlift];

const EXERCISES: readonly Exercise[] = Object.freeze(validateLibrary(RAW));
const BY_SLUG = new Map(EXERCISES.map((e) => [e.slug, e]));

export function listExercises(): readonly Exercise[] {
  return EXERCISES;
}

export function getExercise(slug: string): Exercise | undefined {
  return BY_SLUG.get(slug);
}

/** Exercises matching a name search and/or Target Muscle filter. */
export function findExercises(query: ExerciseQuery): Exercise[] {
  return searchExercises(EXERCISES, query);
}

export function isExerciseSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export { validateLibrary, LibraryValidationError } from "./lib/validate";
export { searchExercises, type ExerciseQuery } from "./lib/search";
export type { Exercise, ExerciseInput, TargetMuscle, Fault, ReferenceVideo, Source } from "./lib/schema";
export { MUSCLES, MUSCLE_IDS, muscleName, type MuscleId } from "./muscles";
