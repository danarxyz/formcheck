import { describe, expect, it } from "vitest";
import { isAllowedEmail, parseAllowlist } from "./allowlist";

describe("allowlist", () => {
  const allowlist = parseAllowlist(" Owner@Example.com , second@example.com,, ");

  it("allows listed emails regardless of case and whitespace", () => {
    expect(isAllowedEmail("owner@example.com", allowlist)).toBe(true);
    expect(isAllowedEmail("  SECOND@example.com ", allowlist)).toBe(true);
  });

  it("rejects anyone else, and missing emails", () => {
    expect(isAllowedEmail("stranger@example.com", allowlist)).toBe(false);
    expect(isAllowedEmail(undefined, allowlist)).toBe(false);
    expect(isAllowedEmail("", allowlist)).toBe(false);
  });

  it("an empty allowlist allows nobody", () => {
    expect(isAllowedEmail("owner@example.com", parseAllowlist(""))).toBe(false);
  });
});
