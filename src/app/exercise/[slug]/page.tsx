import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReferenceVideo } from "@/components/reference-video";
import { Badge } from "@/components/ui/badge";
import { copy } from "@/copy";
import { getExercise, listExercises, muscleName } from "@/packages/library";
import { MUSCLE_REGIONS } from "@/packages/body-map";
import { BodyMap } from "@/packages/body-map/BodyMap";

/** Form guidance is static content: every Exercise page is prerendered at build time. */
export function generateStaticParams() {
  return listExercises().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exercise/[slug]">): Promise<Metadata> {
  const exercise = getExercise((await params).slug);
  return { title: exercise ? `${exercise.name} — ${copy.appName}` : copy.appName };
}

// The params read lives inside <Suspense> so the route's App Shell stays shared
// across Exercises (instant navigation); each slug is still prerendered.
export default function ExercisePage({ params }: PageProps<"/exercise/[slug]">) {
  return (
    <Suspense fallback={<ExerciseSkeleton />}>
      <ExerciseDetails params={params} />
    </Suspense>
  );
}

function ExerciseSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy>
      <div className="bg-muted h-8 w-2/3 animate-pulse rounded-md" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-muted h-12 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

async function ExerciseDetails({ params }: Pick<PageProps<"/exercise/[slug]">, "params">) {
  const exercise = getExercise((await params).slug);
  if (!exercise) notFound();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{exercise.name}</h1>
        {exercise.verification === "draft" && (
          <div className="rounded-lg border border-dashed p-3 text-sm">
            <Badge variant="outline">{copy.exercise.draft}</Badge>
            <p className="text-muted-foreground mt-1">{copy.exercise.draftHint}</p>
          </div>
        )}
      </header>

      <section className="flex flex-col gap-3" aria-labelledby="cues">
        <h2 id="cues" className="text-lg font-semibold">
          {copy.exercise.cues}
        </h2>
        <ol className="flex flex-col gap-2">
          {exercise.cues.map((cue, i) => (
            <li key={cue} className="bg-muted flex gap-3 rounded-lg p-3 text-base leading-snug">
              <span className="text-muted-foreground font-mono">{i + 1}</span>
              {cue}
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="muscles">
        <h2 id="muscles" className="text-lg font-semibold">
          {copy.exercise.targetMuscles}
        </h2>
        <BodyMap targetMuscles={exercise.targetMuscles} className="mx-auto w-full max-w-xs" />
        <ul className="flex flex-wrap gap-2 text-sm">
          {exercise.targetMuscles.map((t) => (
            <li key={t.muscle} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1" data-role={t.role}>
              <span
                className={
                  t.role === "primary"
                    ? "bg-muscle-primary size-2.5 rounded-full"
                    : "bg-muscle-secondary size-2.5 rounded-full"
                }
                aria-hidden
              />
              {muscleName(t.muscle)}
              <span className="text-muted-foreground">
                · {t.role === "primary" ? copy.exercise.primary : copy.exercise.secondary}
                {MUSCLE_REGIONS[t.muscle].length === 0 && ` (${copy.exercise.notDrawable})`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="faults">
        <h2 id="faults" className="text-lg font-semibold">
          {copy.exercise.faults}
        </h2>
        <ul className="flex flex-col gap-2">
          {exercise.faults.map((fault) => (
            <li key={fault.description} className="border-destructive bg-card rounded-lg border-l-4 p-3">
              <p className="font-medium">{fault.description}</p>
              <p className="text-muted-foreground text-sm">
                {copy.exercise.consequence}: {fault.consequence}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="video">
        <h2 id="video" className="text-lg font-semibold">
          {copy.exercise.video}
        </h2>
        <ReferenceVideo video={exercise.referenceVideo} title={exercise.name} />
      </section>

      <section className="flex flex-col gap-2" aria-labelledby="sources">
        <h2 id="sources" className="text-muted-foreground text-sm font-semibold">
          {copy.exercise.sources}
        </h2>
        <ul className="flex flex-col gap-1 text-sm">
          {exercise.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
