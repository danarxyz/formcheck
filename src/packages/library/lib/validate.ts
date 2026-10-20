import { exerciseSchema, type Exercise } from "./schema";

export class LibraryValidationError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Library content is invalid:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "LibraryValidationError";
  }
}

/**
 * Parses raw content into Exercises, enforcing every content rule plus the
 * rules that span Exercises (unique slugs). Throws with ALL problems at once
 * so a content author can fix a file in one pass.
 */
export function validateLibrary(raw: readonly unknown[]): Exercise[] {
  const problems: string[] = [];
  const exercises: Exercise[] = [];

  raw.forEach((entry, index) => {
    const label = typeof entry === "object" && entry !== null && "slug" in entry ? String(entry.slug) : `#${index}`;
    const result = exerciseSchema.safeParse(entry);
    if (!result.success) {
      for (const issue of result.error.issues) {
        problems.push(`${label} › ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
      return;
    }
    exercises.push(result.data);
  });

  const seen = new Set<string>();
  for (const e of exercises) {
    if (seen.has(e.slug)) problems.push(`${e.slug}: duplicate slug`);
    seen.add(e.slug);
  }

  if (problems.length > 0) throw new LibraryValidationError(problems);
  return exercises;
}
