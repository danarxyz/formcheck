import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "@/env";
import type { PlansDb } from "@/packages/plans";
import * as schema from "./schema";

/**
 * node-postgres over Neon's pooled connection string — Neon's recommended
 * driver for Vercel Fluid compute, where the pool is reused across requests.
 * The same driver serves a local or CI Postgres.
 */
function create(): PlansDb {
  const pool = new Pool({ connectionString: serverEnv().DATABASE_URL });
  // On Vercel, keeps the function alive until idle connections are released.
  attachDatabasePool(pool);
  return drizzle(pool, { schema });
}

let db: PlansDb | undefined;

/** The app's database, created on first use. */
export function getDb(): PlansDb {
  db ??= create();
  return db;
}
