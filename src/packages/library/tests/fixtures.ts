import type { ExerciseInput } from "../index";

/** A minimal Exercise that satisfies every content rule. Tests patch it to break one rule at a time. */
export function validExercise(): ExerciseInput {
  return {
    slug: "test-curl",
    name: "Test Curl",
    targetMuscles: [
      { muscle: "biceps-brachii", role: "primary" },
      { muscle: "brachialis", role: "secondary" },
    ],
    cues: ["Siku diam di samping badan", "Angkat sampai otot kontraksi penuh", "Turunkan pelan dan terkontrol"],
    faults: [
      { description: "Mengayun badan", consequence: "Beban pindah ke punggung bawah" },
      { description: "Siku maju ke depan", consequence: "Bahu ikut bekerja, biceps kurang terlatih" },
    ],
    referenceVideo: { platform: "youtube", url: "https://www.youtube.com/watch?v=abc", startSeconds: 30 },
    sources: [
      { title: "Sumber satu", url: "https://one.example/curl", kind: "physiotherapist" },
      { title: "Sumber dua", url: "https://two.example/curl", kind: "coach" },
    ],
    verification: "draft",
    formAnimation: null,
  };
}
