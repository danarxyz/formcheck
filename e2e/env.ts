/**
 * Environment for the E2E run. Points at a throwaway local/CI Postgres —
 * never at Neon. The Google credentials are dummies: the test signs in by
 * seeding a session directly (see global-setup.ts), not through Google.
 */
export const E2E_ENV = {
  DATABASE_URL: process.env.E2E_DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/formcheck_e2e",
  BETTER_AUTH_SECRET: "e2e-only-secret-not-used-anywhere-else-0123456789",
  BETTER_AUTH_URL: "http://localhost:3100",
  GOOGLE_CLIENT_ID: "e2e-dummy",
  GOOGLE_CLIENT_SECRET: "e2e-dummy",
  ALLOWED_EMAILS: "owner@e2e.test",
};
