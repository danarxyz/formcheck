import type { PlanDate } from "@/packages/plans";

/** "Selasa, 20 Oktober" — a PlanDate is a calendar day, so format it in UTC to avoid shifting. */
export function formatPlanDate(date: PlanDate): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
