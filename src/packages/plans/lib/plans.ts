import { and, asc, eq, max, sql, type SQL } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { planEntries, plans } from "@/db/schema";
import type * as schema from "@/db/schema";
import type { PlanDate } from "../dates";

export type Plan = { date: PlanDate; exerciseSlugs: string[] };
export type PlanErrorCode = "unknown-exercise" | "already-in-plan" | "not-a-reordering";

export class PlanError extends Error {
  constructor(public readonly code: PlanErrorCode) {
    super(`Plan rule violated: ${code}`);
    this.name = "PlanError";
  }
}

/**
 * The only way to read or change Plans. Every operation is scoped to one owner
 * and one date, and enforces the Plan rules from CONTEXT.md itself.
 */
export type Plans = {
  /** The Plan for a date. A date with nothing added has an empty Plan. */
  get(ownerId: string, date: PlanDate): Promise<Plan>;
  /** Appends an Exercise. Throws `unknown-exercise` or `already-in-plan`. */
  add(ownerId: string, date: PlanDate, exerciseSlug: string): Promise<Plan>;
  /** Removes an Exercise. Removing one that is not there is a no-op. */
  remove(ownerId: string, date: PlanDate, exerciseSlug: string): Promise<Plan>;
  /** Sets the order. Must contain exactly the Plan's Exercises, else `not-a-reordering`. */
  reorder(ownerId: string, date: PlanDate, exerciseSlugs: string[]): Promise<Plan>;
};

/** Any Drizzle Postgres database with our schema: Neon in production, PGlite in tests. */
export type PlansDb = PgDatabase<PgQueryResultHKT, typeof schema>;

export type PlansDeps = { isExerciseSlug: (slug: string) => boolean };

// Every statement below is a single SQL statement: the Neon HTTP driver has no
// interactive transactions, and the unique constraints make each step safe on its own.
export function createPlans(db: PlansDb, deps: PlansDeps): Plans {
  const planIdFor = (ownerId: string, date: PlanDate): SQL =>
    sql`(select ${plans.id} from ${plans} where ${plans.ownerId} = ${ownerId} and ${plans.date} = ${date})`;

  async function get(ownerId: string, date: PlanDate): Promise<Plan> {
    const rows = await db
      .select({ slug: planEntries.exerciseSlug })
      .from(planEntries)
      .innerJoin(plans, eq(plans.id, planEntries.planId))
      .where(and(eq(plans.ownerId, ownerId), eq(plans.date, date)))
      .orderBy(asc(planEntries.position));
    return { date, exerciseSlugs: rows.map((r) => r.slug) };
  }

  async function add(ownerId: string, date: PlanDate, exerciseSlug: string): Promise<Plan> {
    if (!deps.isExerciseSlug(exerciseSlug)) throw new PlanError("unknown-exercise");

    await db.insert(plans).values({ ownerId, date }).onConflictDoNothing();
    const planId = planIdFor(ownerId, date);
    const nextPosition = sql`(select coalesce(${max(planEntries.position)}, -1) + 1 from ${planEntries} where ${planEntries.planId} = ${planId})`;

    const inserted = await db
      .insert(planEntries)
      .values({ planId: sql`${planId}`, exerciseSlug, position: sql`${nextPosition}` })
      .onConflictDoNothing()
      .returning({ slug: planEntries.exerciseSlug });
    if (inserted.length === 0) throw new PlanError("already-in-plan");

    return get(ownerId, date);
  }

  async function remove(ownerId: string, date: PlanDate, exerciseSlug: string): Promise<Plan> {
    await db
      .delete(planEntries)
      .where(and(eq(planEntries.planId, planIdFor(ownerId, date)), eq(planEntries.exerciseSlug, exerciseSlug)));
    return get(ownerId, date);
  }

  async function reorder(ownerId: string, date: PlanDate, exerciseSlugs: string[]): Promise<Plan> {
    const current = await get(ownerId, date);
    const proposed = new Set(exerciseSlugs);
    const isReordering =
      proposed.size === exerciseSlugs.length &&
      exerciseSlugs.length === current.exerciseSlugs.length &&
      current.exerciseSlugs.every((s) => proposed.has(s));
    if (!isReordering) throw new PlanError("not-a-reordering");
    if (exerciseSlugs.length === 0) return current;

    const positionCase = sql.join(
      [
        sql`case ${planEntries.exerciseSlug}`,
        ...exerciseSlugs.map((slug, i) => sql`when ${slug} then ${i}::integer`),
        sql`end`,
      ],
      sql` `,
    );
    await db
      .update(planEntries)
      .set({ position: positionCase })
      .where(eq(planEntries.planId, planIdFor(ownerId, date)));
    return get(ownerId, date);
  }

  return { get, add, remove, reorder };
}
