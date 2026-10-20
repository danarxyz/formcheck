import { describe, expect, it } from "vitest";
import { parsePlanDate, shiftPlanDate, todayPlanDate, type PlanDate } from "../index";

describe("Plan dates", () => {
  it("accepts real calendar dates only", () => {
    expect(parsePlanDate("2026-10-20")).toBe("2026-10-20");
    expect(parsePlanDate("2028-02-29")).toBe("2028-02-29");
    expect(parsePlanDate("2026-02-30")).toBeNull();
    expect(parsePlanDate("2026-13-01")).toBeNull();
    expect(parsePlanDate("20-10-2026")).toBeNull();
    expect(parsePlanDate("2026-10-20T00:00")).toBeNull();
  });

  it("'today' follows the owner's time zone, not UTC", () => {
    // 23:30 in Bali (UTC+8) is still 15:30 UTC the same day…
    expect(todayPlanDate(new Date("2026-10-20T15:30:00Z"))).toBe("2026-10-20");
    // …but 00:30 in Bali is the previous day in UTC.
    expect(todayPlanDate(new Date("2026-10-20T16:30:00Z"))).toBe("2026-10-21");
  });

  it("moves across month and year boundaries", () => {
    expect(shiftPlanDate("2026-10-31" as PlanDate, 1)).toBe("2026-11-01");
    expect(shiftPlanDate("2027-01-01" as PlanDate, -1)).toBe("2026-12-31");
  });
});
