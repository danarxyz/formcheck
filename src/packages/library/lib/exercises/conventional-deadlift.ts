import { defineExercise } from "../define-exercise";

/**
 * REFERENCE EXERCISE — copy this file's shape for new Exercises.
 * Every Cue and Fault below appears in BOTH Sources. Status stays "draft"
 * until the owner has checked it against the Sources and tried the movement.
 */
export const conventionalDeadlift = defineExercise({
  slug: "conventional-deadlift",
  name: "Conventional Deadlift",
  targetMuscles: [
    { muscle: "gluteus-maximus", role: "primary" },
    { muscle: "erector-spinae", role: "primary" },
    { muscle: "hamstrings", role: "secondary" },
    { muscle: "quadriceps", role: "secondary" },
    { muscle: "adductors", role: "secondary" },
    { muscle: "upper-trapezius", role: "secondary" },
    { muscle: "forearm-flexors", role: "secondary" },
  ],
  cues: [
    "Bar di atas tengah kaki, ±2–3 cm dari tulang kering",
    "Tarik napas dalam ke perut, kunci (brace) sebelum bar naik",
    "Lengan lurus, kencangkan lat: tarik bar ke arah tulang kering",
    "Dorong lantai menjauh; bar menempel badan sampai berdiri tegak",
  ],
  faults: [
    {
      description: "Menyentak bar dari lantai tanpa membangun tegangan dulu",
      consequence: "Pinggul naik duluan dan punggung membulat di awal tarikan",
    },
    {
      description: "Bar menjauh ke depan kaki saat diangkat",
      consequence: "Keseimbangan hilang ke depan dan beban pindah ke punggung bawah",
    },
    {
      description: "Punggung membulat di bawah beban",
      consequence: "Posisi tulang belakang tidak terkunci sehingga tenaga bocor dan risiko cedera naik",
    },
  ],
  referenceVideo: {
    platform: "youtube",
    url: "https://www.youtube.com/watch?v=uJwNTgbDLz0",
  },
  sources: [
    {
      title: "How to Deadlift — Greg Nuckols, Stronger by Science",
      url: "https://strongerbyscience.com/how-to-deadlift/",
      kind: "coach",
    },
    {
      title: "How to Deadlift: Muscles Worked & Proper Form — StrengthLog",
      url: "https://www.strengthlog.com/deadlift/",
      kind: "other",
    },
  ],
  verification: "draft",
  formAnimation: null,
});
