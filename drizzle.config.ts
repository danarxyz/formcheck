import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same file Next.js reads, so there is one place for local secrets.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations need a direct (non-pooled) connection; local/CI Postgres has only DATABASE_URL.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "" },
  strict: true,
});
