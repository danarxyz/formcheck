import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { PlanView } from "@/components/plan-view";
import { copy } from "@/copy";
import { parsePlanDate, todayPlanDate } from "@/packages/plans";

export default function PlanPage({ params }: PageProps<"/plan/[date]">) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{copy.loading}</p>}>
      <PlanForDate params={params} />
    </Suspense>
  );
}

async function PlanForDate({ params }: Pick<PageProps<"/plan/[date]">, "params">) {
  const date = parsePlanDate((await params).date);
  if (!date) notFound();
  await connection();
  return <PlanView date={date} today={todayPlanDate()} />;
}
