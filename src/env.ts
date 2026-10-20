import { z } from "zod";

/**
 * Server environment, validated on first use (not at import) so `next build`
 * works without secrets. Every server secret is read through here — never
 * via `process.env` directly. Template: `.env.example`.
 */
const schema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32, "generate with: openssl rand -base64 32"),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  /** Comma-separated emails allowed to sign in. */
  ALLOWED_EMAILS: z.string().min(3),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  cached ??= schema.parse(process.env);
  return cached;
}
