import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "@/env";
import type { PlansDb } from "@/packages/plans";
import * as schema from "./schema";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);

/**
 * Neon over HTTP in production; plain node-postgres for a local or CI Postgres
 * (Neon's HTTP driver only talks to Neon). Both satisfy the same Drizzle type.
 */
function create(): PlansDb {
  const url = serverEnv().DATABASE_URL;
  if (LOCAL_HOSTS.has(new URL(url).hostname)) {
    return drizzlePg(new Pool({ connectionString: url }), { schema });
  }
  return drizzleNeon(neon(url), { schema });
}

let db: PlansDb | undefined;

/** The app's database, created on first use. */
export function getDb(): PlansDb {
  db ??= create();
  return db;
}
