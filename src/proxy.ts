import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate: no session cookie → straight to /sign-in, without rendering.
 * This is NOT the security boundary — every Plan read/write re-checks the
 * session server-side (src/server/plans.ts). Exercise pages stay public-shaped
 * but are gated too, since the app is private.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/((?!sign-in|api/auth|_next|favicon.ico).*)"],
};
