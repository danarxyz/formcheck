import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import Link from "next/link";
import { addToPlan, moveInPlan, removeFromPlan } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { copy } from "@/copy";
import { formatPlanDate } from "@/lib/format";
import { getExercise, muscleName } from "@/packages/library";
import { shiftPlanDate, type PlanDate } from "@/packages/plans";
import { getPlans, requireOwnerId } from "@/server/plans";

/** The Plan for one date: an ordered shortlist with links into each Exercise's form guidance. */
export async function PlanView({ date, today }: { date: PlanDate; today: PlanDate }) {
  const ownerId = await requireOwnerId();
  const { exerciseSlugs } = await getPlans().get(ownerId, date);
  const isToday = date === today;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-2">
        <Link
          href={`/plan/${shiftPlanDate(date, -1)}`}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          aria-label={copy.plan.previousDay}
        >
          <ChevronLeft />
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            {isToday ? copy.plan.titleToday : copy.plan.titleFor(formatPlanDate(date))}
          </h1>
          {isToday ? (
            <p className="text-muted-foreground text-sm">{formatPlanDate(date)}</p>
          ) : (
            <Link href="/" className="text-muted-foreground text-sm underline-offset-4 hover:underline">
              {copy.plan.backToToday}
            </Link>
          )}
        </div>
        <Link
          href={`/plan/${shiftPlanDate(date, 1)}`}
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          aria-label={copy.plan.nextDay}
        >
          <ChevronRight />
        </Link>
      </header>

      {exerciseSlugs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground">{copy.plan.empty}</p>
          <Link href={`/library?date=${date}`} className={buttonVariants()}>
            <Plus /> {copy.plan.emptyCta}
          </Link>
        </div>
      ) : (
        <>
          <ol className="flex flex-col gap-2" data-testid="plan-list">
            {exerciseSlugs.map((slug, index) => {
              const exercise = getExercise(slug);
              if (!exercise) return null; // Exercise removed from the Library since it was planned.
              const primary = exercise.targetMuscles.filter((t) => t.role === "primary");
              return (
                <li key={slug} className="bg-card flex items-center gap-2 rounded-xl border p-3">
                  <span className="text-muted-foreground w-6 text-center font-mono text-sm">{index + 1}</span>
                  <Link href={`/exercise/${slug}`} className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{exercise.name}</span>
                    <span className="text-muted-foreground block truncate text-sm">
                      {primary.map((t) => muscleName(t.muscle)).join(", ")}
                    </span>
                  </Link>
                  {exercise.verification === "draft" && <Badge variant="outline">Draft</Badge>}
                  <PlanItemControls
                    date={date}
                    slug={slug}
                    isFirst={index === 0}
                    isLast={index === exerciseSlugs.length - 1}
                  />
                </li>
              );
            })}
          </ol>
          <Link href={`/library?date=${date}`} className={buttonVariants({ variant: "outline" })}>
            <Plus /> {copy.plan.addMore}
          </Link>
        </>
      )}
    </section>
  );
}

function PlanItemControls({
  date,
  slug,
  isFirst,
  isLast,
}: {
  date: PlanDate;
  slug: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <form action={moveInPlan}>
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="direction" value="up" />
        <Button type="submit" variant="ghost" size="icon-sm" disabled={isFirst} aria-label={copy.plan.moveUp}>
          <ArrowUp />
        </Button>
      </form>
      <form action={moveInPlan}>
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="direction" value="down" />
        <Button type="submit" variant="ghost" size="icon-sm" disabled={isLast} aria-label={copy.plan.moveDown}>
          <ArrowDown />
        </Button>
      </form>
      <form action={removeFromPlan}>
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="slug" value={slug} />
        <Button type="submit" variant="ghost" size="icon-sm" aria-label={copy.plan.remove}>
          <X />
        </Button>
      </form>
    </div>
  );
}

/** Used by the Library to add an Exercise to a Plan. */
export function AddToPlanButton({ date, slug, inPlan }: { date: PlanDate; slug: string; inPlan: boolean }) {
  if (inPlan) return <Badge variant="secondary">{copy.library.inPlan}</Badge>;
  return (
    <form action={addToPlan}>
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" size="sm">
        <Plus /> {copy.library.add}
      </Button>
    </form>
  );
}
