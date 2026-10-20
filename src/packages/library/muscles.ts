/**
 * Muscle taxonomy owned by this project (ADR-0002).
 *
 * This is a CLOSED set. Exercise content may only reference these ids, and
 * TypeScript rejects anything else. Adding a Muscle means adding it here AND
 * giving it a body-map region in `lib/body-map-regions.ts` — the compiler
 * enforces the second step, because that map is typed as
 * `Record<MuscleId, ...>`.
 */
export const MUSCLES = {
  "latissimus-dorsi": { name: "Latissimus dorsi" },
  "teres-major": { name: "Teres major" },
  rhomboids: { name: "Rhomboids" },
  "upper-trapezius": { name: "Upper trapezius" },
  "middle-trapezius": { name: "Middle trapezius" },
  "lower-trapezius": { name: "Lower trapezius" },
  "posterior-deltoid": { name: "Posterior deltoid" },
  "erector-spinae": { name: "Erector spinae" },
  "biceps-brachii": { name: "Biceps brachii" },
  brachialis: { name: "Brachialis" },
  brachioradialis: { name: "Brachioradialis" },
  "forearm-flexors": { name: "Forearm flexors (grip)" },
  "forearm-extensors": { name: "Forearm extensors" },
  "gluteus-maximus": { name: "Gluteus maximus" },
  hamstrings: { name: "Hamstrings" },
  quadriceps: { name: "Quadriceps" },
  adductors: { name: "Adductors" },
  "rectus-abdominis": { name: "Rectus abdominis" },
  obliques: { name: "Obliques" },
  "hip-flexors": { name: "Hip flexors" },
} as const satisfies Record<string, { name: string }>;

export type MuscleId = keyof typeof MUSCLES;

export const MUSCLE_IDS = Object.keys(MUSCLES) as [MuscleId, ...MuscleId[]];

export function muscleName(id: MuscleId): string {
  return MUSCLES[id].name;
}
