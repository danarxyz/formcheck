import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { serverEnv } from "@/env";
import { isAllowedEmail, parseAllowlist } from "./allowlist";

function create() {
  const env = serverEnv();
  const allowlist = parseAllowlist(env.ALLOWED_EMAILS);
  const rejectUnlisted = (email: string | null | undefined) => {
    if (!isAllowedEmail(email, allowlist)) {
      throw new APIError("FORBIDDEN", { message: "This app is private." });
    }
  };

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    socialProviders: {
      google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    },
    // Defence in depth: block account creation AND every new session for unlisted emails,
    // so removing someone from ALLOWED_EMAILS locks them out on their next sign-in.
    databaseHooks: {
      user: { create: { before: async (user) => rejectUnlisted(user.email) } },
      session: {
        create: {
          before: async (session, ctx) => {
            const user = await ctx?.context.internalAdapter.findUserById(session.userId);
            rejectUnlisted(user?.email);
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

let auth: ReturnType<typeof create> | undefined;

export function getAuth() {
  auth ??= create();
  return auth;
}

/** The signed-in owner's id, or null. Use in Server Components and Server Actions. */
export async function currentOwnerId(): Promise<string | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}
