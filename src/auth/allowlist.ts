/** Parses the ALLOWED_EMAILS env value. Comparison is case-insensitive and whitespace-tolerant. */
export function parseAllowlist(raw: string): ReadonlySet<string> {
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedEmail(email: string | null | undefined, allowlist: ReadonlySet<string>): boolean {
  return typeof email === "string" && allowlist.has(email.trim().toLowerCase());
}
