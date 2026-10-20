import { z } from "zod";
import { MUSCLE_IDS } from "../muscles";

/**
 * The content rules for an Exercise. These ARE the spec for Library content:
 * if a rule is not enforced here, it is not a rule. Messages are written for
 * the person (or agent) fixing the content file.
 */

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case, e.g. barbell-row");

const targetMuscle = z.object({
  muscle: z.enum(MUSCLE_IDS),
  role: z.enum(["primary", "secondary"]),
});

const cue = z.string().trim().min(3).max(90, "a Cue must be readable between sets — keep it under 90 characters");

const fault = z.object({
  description: z.string().trim().min(3),
  consequence: z.string().trim().min(3),
});

const youtubeHost = /^(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)$/;

const referenceVideo = z
  .object({
    platform: z.enum(["youtube", "tiktok", "instagram", "other"]),
    url: z.url({ protocol: /^https$/ }),
    startSeconds: z.number().int().nonnegative().optional(),
  })
  .refine((v) => v.platform !== "youtube" || youtubeHost.test(new URL(v.url).hostname), {
    message: "platform is youtube but the url is not a YouTube url",
  })
  .refine((v) => v.platform === "youtube" || v.startSeconds === undefined, {
    message: "startSeconds is only supported for YouTube embeds",
  });

const source = z.object({
  title: z.string().trim().min(3),
  url: z.url({ protocol: /^https$/ }),
  kind: z.enum(["physiotherapist", "coach", "exercise-scientist", "research-paper", "other"]),
});

export const exerciseSchema = z
  .object({
    slug,
    name: z.string().trim().min(2),
    targetMuscles: z.array(targetMuscle).min(1),
    cues: z.array(cue).min(3, "an Exercise needs at least 3 Cues").max(5, "keep Cues to at most 5"),
    faults: z.array(fault).min(2, "an Exercise needs at least 2 Faults").max(4),
    referenceVideo,
    sources: z.array(source).min(2, "an Exercise needs at least 2 independent Sources"),
    verification: z.enum(["draft", "verified"]),
    /** Reserved for the Form Animation milestone. Must stay null in the MVP. */
    formAnimation: z.null(),
  })
  .strict()
  .refine((e) => e.targetMuscles.some((t) => t.role === "primary"), {
    message: "an Exercise needs at least one primary Target Muscle",
    path: ["targetMuscles"],
  })
  .refine((e) => new Set(e.targetMuscles.map((t) => t.muscle)).size === e.targetMuscles.length, {
    message: "a Muscle may appear only once in targetMuscles",
    path: ["targetMuscles"],
  })
  .refine((e) => new Set(e.sources.map((s) => new URL(s.url).hostname)).size >= 2, {
    message: "Sources must come from at least 2 different sites to count as independent",
    path: ["sources"],
  });

export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseInput = z.input<typeof exerciseSchema>;
export type TargetMuscle = Exercise["targetMuscles"][number];
export type Fault = Exercise["faults"][number];
export type ReferenceVideo = Exercise["referenceVideo"];
export type Source = Exercise["sources"][number];
