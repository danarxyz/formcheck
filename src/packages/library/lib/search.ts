import type { MuscleId } from "../muscles";
import type { Exercise } from "./schema";

export type ExerciseQuery = { text?: string; muscle?: MuscleId };

/**
 * Filters Exercises by name (case-insensitive substring) and by Target Muscle
 * (primary or secondary). Primary matches sort before secondary matches.
 */
export function searchExercises(exercises: readonly Exercise[], query: ExerciseQuery): Exercise[] {
  const text = query.text?.trim().toLowerCase();
  const rank = (e: Exercise) => {
    if (!query.muscle) return 0;
    const t = e.targetMuscles.find((m) => m.muscle === query.muscle);
    return t ? (t.role === "primary" ? 0 : 1) : -1;
  };
  return exercises
    .filter((e) => !text || e.name.toLowerCase().includes(text))
    .filter((e) => rank(e) >= 0)
    .toSorted((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}
