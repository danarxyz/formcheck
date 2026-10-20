import { connection } from "next/server";
import { Suspense } from "react";
import { PlanView } from "@/components/plan-view";
import { copy } from "@/copy";
import { todayPlanDate } from "@/packages/plans";

export default function TodayPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{copy.loading}</p>}>
      <Today />
    </Suspense>
  );
}

async function Today() {
  await connection(); // "today" depends on the request time
  const today = todayPlanDate();
  return <PlanView date={today} today={today} />;
}
