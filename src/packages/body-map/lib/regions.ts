import type { MuscleId, TargetMuscle } from "@/packages/library";

/**
 * Regions the current renderer (react-body-highlighter) can colour.
 * Coarser than our Muscle taxonomy on purpose — see ADR-0002.
 */
export type Region =
  | "trapezius"
  | "upper-back"
  | "lower-back"
  | "chest"
  | "biceps"
  | "triceps"
  | "forearm"
  | "back-deltoids"
  | "front-deltoids"
  | "abs"
  | "obliques"
  | "adductor"
  | "abductors"
  | "hamstring"
  | "quadriceps"
  | "calves"
  | "gluteal";

/**
 * Every Muscle MUST appear here — the Record type makes a missing one a
 * compile error. An empty array means "not drawable; shown in text only".
 */
export const MUSCLE_REGIONS: Record<MuscleId, readonly Region[]> = {
  "latissimus-dorsi": ["upper-back"],
  "teres-major": ["upper-back"],
  rhomboids: ["upper-back"],
  "upper-trapezius": ["trapezius"],
  "middle-trapezius": ["upper-back"],
  "lower-trapezius": ["upper-back"],
  "posterior-deltoid": ["back-deltoids"],
  "erector-spinae": ["lower-back"],
  "biceps-brachii": ["biceps"],
  brachialis: ["biceps"],
  brachioradialis: ["forearm"],
  "forearm-flexors": ["forearm"],
  "forearm-extensors": ["forearm"],
  "gluteus-maximus": ["gluteal"],
  hamstrings: ["hamstring"],
  quadriceps: ["quadriceps"],
  adductors: ["adductor"],
  "rectus-abdominis": ["abs"],
  obliques: ["obliques"],
  "hip-flexors": [],
};

export type RegionHighlight = { primary: Region[]; secondary: Region[] };

/**
 * Which regions to colour, and how. A region shared by a primary and a
 * secondary Muscle is shown as primary.
 */
export function highlightFor(targetMuscles: readonly TargetMuscle[]): RegionHighlight {
  const primary = new Set<Region>();
  const secondary = new Set<Region>();
  for (const t of targetMuscles) {
    for (const region of MUSCLE_REGIONS[t.muscle]) {
      (t.role === "primary" ? primary : secondary).add(region);
    }
  }
  for (const region of primary) secondary.delete(region);
  return { primary: [...primary], secondary: [...secondary] };
}
