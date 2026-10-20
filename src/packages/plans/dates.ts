/**
 * A Plan's date: a calendar day with no time component, "YYYY-MM-DD".
 * Branded so a random string can't be passed where a validated date is required.
 */
export type PlanDate = string & { readonly __brand: "PlanDate" };

/** The owner's time zone. "Today" is computed here, never in UTC. */
export const OWNER_TIME_ZONE = "Asia/Makassar";

const PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parsePlanDate(value: string): PlanDate | null {
  const match = PATTERN.exec(value);
  if (!match) return null;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const probe = new Date(Date.UTC(y, m - 1, d));
  const roundTrips = probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
  return roundTrips ? (value as PlanDate) : null;
}

export function todayPlanDate(now: Date = new Date(), timeZone: string = OWNER_TIME_ZONE): PlanDate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    now,
  ) as PlanDate;
}

export function shiftPlanDate(date: PlanDate, days: number): PlanDate {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10) as PlanDate;
}
