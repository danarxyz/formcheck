import "server-only";
import { redirect } from "next/navigation";
import { currentOwnerId } from "@/auth/server";
import { getDb } from "@/db/client";
import { isExerciseSlug } from "@/packages/library";
import { createPlans, type Plans } from "@/packages/plans";

/**
 * Data access layer for Plans. Pages and Server Actions go through here so the
 * owner check can never be forgotten.
 */
export async function requireOwnerId(): Promise<string> {
  const ownerId = await currentOwnerId();
  if (!ownerId) redirect("/sign-in");
  return ownerId;
}

let plans: Plans | undefined;

export function getPlans(): Plans {
  plans ??= createPlans(getDb(), { isExerciseSlug });
  return plans;
}
