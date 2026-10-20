"use server";

import { refresh } from "next/cache";
import { parsePlanDate, PlanError } from "@/packages/plans";
import { getPlans, requireOwnerId } from "@/server/plans";

/**
 * Server Actions for Plans. Inputs come from forms, so everything is parsed;
 * rule violations a user can trigger by double-tapping (already in plan,
 * stale reorder) are swallowed — the refreshed page shows the true state.
 */

function readDate(form: FormData) {
  const date = parsePlanDate(String(form.get("date") ?? ""));
  if (!date) throw new Error("invalid date");
  return date;
}

function readSlug(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  if (!slug) throw new Error("missing slug");
  return slug;
}

async function tolerate(action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    if (!(error instanceof PlanError)) throw error;
  }
  refresh();
}

export async function addToPlan(form: FormData) {
  const ownerId = await requireOwnerId();
  await tolerate(() => getPlans().add(ownerId, readDate(form), readSlug(form)));
}

export async function removeFromPlan(form: FormData) {
  const ownerId = await requireOwnerId();
  await tolerate(() => getPlans().remove(ownerId, readDate(form), readSlug(form)));
}

export async function moveInPlan(form: FormData) {
  const ownerId = await requireOwnerId();
  const date = readDate(form);
  const slug = readSlug(form);
  const direction = form.get("direction") === "up" ? -1 : 1;

  await tolerate(async () => {
    const { exerciseSlugs } = await getPlans().get(ownerId, date);
    const from = exerciseSlugs.indexOf(slug);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= exerciseSlugs.length) return;
    const next = [...exerciseSlugs];
    [next[from], next[to]] = [next[to]!, next[from]!];
    await getPlans().reorder(ownerId, date, next);
  });
}
