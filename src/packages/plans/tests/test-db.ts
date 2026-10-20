import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";

/**
 * A fresh, real Postgres (PGlite, in-process) with the real migrations applied.
 * Tests hit actual SQL constraints, so they behave exactly like Neon.
 */
export async function createTestDb(ownerIds: string[] = ["owner-a", "owner-b"]) {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "drizzle" });
  for (const id of ownerIds) {
    await db.insert(schema.user).values({ id, name: id, email: `${id}@example.com` });
  }
  return db;
}
