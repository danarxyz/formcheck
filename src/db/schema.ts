/**
 * Database schema — personal data only (ADR-0001: the Library is NOT here).
 * Generate migrations with `pnpm db:generate` after changing this file.
 */
import { date, index, integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export * from "./auth-schema";

/** One Plan per owner per date (CONTEXT.md › Plan). */
export const plans = pgTable(
  "plans",
  {
    id: serial("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("plans_owner_date_unique").on(t.ownerId, t.date)],
);

/**
 * An Exercise's place in a Plan. References the Library by slug.
 * Deliberately carries no performance data — tracking is out of scope.
 */
export const planEntries = pgTable(
  "plan_entries",
  {
    planId: integer("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    exerciseSlug: text("exercise_slug").notNull(),
    position: integer("position").notNull(),
  },
  (t) => [unique("plan_entries_plan_exercise_unique").on(t.planId, t.exerciseSlug), index().on(t.planId)],
);
