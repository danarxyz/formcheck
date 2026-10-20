import type { ExerciseInput } from "./schema";

/**
 * Identity helper used by every content file. It gives authors (human or AI)
 * autocomplete and type errors while writing an Exercise; the full content
 * rules run in `validateLibrary`, which the test suite and build execute.
 */
export function defineExercise<const T extends ExerciseInput>(exercise: T): T {
  return exercise;
}
