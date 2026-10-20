import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { serializeSignedCookie } from "better-call";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { E2E_ENV } from "./env";

const COOKIE = "better-auth.session_token";

/**
 * Fresh schema + one signed-in owner. Production auth code is untouched: we
 * create the session row Better Auth would create after Google sign-in, and
 * sign its cookie with the same secret the server uses.
 */
export default async function globalSetup() {
  const pool = new Pool({ connectionString: E2E_ENV.DATABASE_URL });
  const db = drizzle(pool, { schema });

  await db.execute(
    sql`drop schema if exists public cascade; drop schema if exists drizzle cascade; create schema public;`,
  );
  await migrate(db, { migrationsFolder: "drizzle" });

  const userId = "e2e-owner";
  const token = randomBytes(32).toString("hex");
  await db
    .insert(schema.user)
    .values({ id: userId, name: "E2E Owner", email: E2E_ENV.ALLOWED_EMAILS, emailVerified: true });
  await db.insert(schema.session).values({
    id: randomBytes(16).toString("hex"),
    token,
    userId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  });
  await pool.end();

  const signed = (await serializeSignedCookie(COOKIE, token, E2E_ENV.BETTER_AUTH_SECRET)).split(";")[0]!;
  const value = signed.slice(COOKIE.length + 1);

  await mkdir("e2e/.auth", { recursive: true });
  await writeFile(
    "e2e/.auth/owner.json",
    JSON.stringify({
      cookies: [
        {
          name: COOKIE,
          value,
          domain: "localhost",
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        },
      ],
      origins: [],
    }),
  );
}
