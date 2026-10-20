import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { AddToPlanButton } from "@/components/plan-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copy } from "@/copy";
import { formatPlanDate } from "@/lib/format";
import { findExercises, MUSCLE_IDS, MUSCLES, muscleName, type MuscleId } from "@/packages/library";
import { parsePlanDate, todayPlanDate } from "@/packages/plans";
import { getPlans, requireOwnerId } from "@/server/plans";

export default function LibraryPage({ searchParams }: PageProps<"/library">) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{copy.loading}</p>}>
      <Library searchParams={searchParams} />
    </Suspense>
  );
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function Library({ searchParams }: Pick<PageProps<"/library">, "searchParams">) {
  const params = await searchParams;
  await connection();
  const date = parsePlanDate(first(params.date)) ?? todayPlanDate();
  const text = first(params.q);
  const muscleParam = first(params.muscle);
  const muscle = (MUSCLE_IDS as readonly string[]).includes(muscleParam) ? (muscleParam as MuscleId) : undefined;

  const ownerId = await requireOwnerId();
  const inPlan = new Set((await getPlans().get(ownerId, date)).exerciseSlugs);
  const exercises = findExercises({ text, muscle });

  return (
    <section className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">{copy.library.title}</h1>
        <p className="text-muted-foreground text-sm">
          <Link href={`/plan/${date}`} className="underline-offset-4 hover:underline">
            {copy.library.subtitleFor(formatPlanDate(date))}
          </Link>
        </p>
      </header>

      <form className="flex flex-col gap-2 sm:flex-row" role="search">
        <input type="hidden" name="date" value={date} />
        <input
          name="q"
          defaultValue={text}
          placeholder={copy.library.searchPlaceholder}
          aria-label={copy.library.searchPlaceholder}
          className="bg-background h-9 flex-1 rounded-lg border px-3 text-sm"
        />
        <select
          name="muscle"
          defaultValue={muscle ?? ""}
          aria-label={copy.library.filterByMuscle}
          className="bg-background h-9 rounded-lg border px-2 text-sm"
        >
          <option value="">{copy.library.allMuscles}</option>
          {MUSCLE_IDS.map((id) => (
            <option key={id} value={id}>
              {MUSCLES[id].name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="lg">
          {copy.library.search}
        </Button>
      </form>

      {exercises.length === 0 ? (
        <p className="text-muted-foreground">{copy.library.noResults}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {exercises.map((exercise) => (
            <li key={exercise.slug} className="bg-card flex items-center gap-3 rounded-xl border p-3">
              <Link href={`/exercise/${exercise.slug}`} className="min-w-0 flex-1">
                <span className="block truncate font-medium">{exercise.name}</span>
                <span className="text-muted-foreground block truncate text-sm">
                  {exercise.targetMuscles
                    .filter((t) => t.role === "primary")
                    .map((t) => muscleName(t.muscle))
                    .join(", ")}
                </span>
              </Link>
              {exercise.verification === "draft" && <Badge variant="outline">Draft</Badge>}
              <AddToPlanButton date={date} slug={exercise.slug} inPlan={inPlan.has(exercise.slug)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
