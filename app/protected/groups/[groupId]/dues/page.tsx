import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { DuesDashboard } from "@/components/dues/dues-dashboard";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  calcDuePaidAmount,
  getDummyActiveMembers,
  getDummyDueCycles,
  getDummyDuesForCycle,
} from "@/lib/woodong/dummy";
import type { Due } from "@/lib/woodong/dues";

async function DuesContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { groupId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const cycles = getDummyDueCycles(groupId);
  const members = getDummyActiveMembers(groupId);

  const duesByCycle: Record<string, Due[]> = {};
  const paidAmounts: Record<string, number> = {};
  for (const cycle of cycles) {
    const dues = getDummyDuesForCycle(cycle.id);
    duesByCycle[cycle.id] = dues;
    for (const due of dues) {
      paidAmounts[due.id] = calcDuePaidAmount(due);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6 sm:p-8">
      <DuesDashboard
        groupId={groupId}
        initialCycles={cycles}
        initialDuesByCycle={duesByCycle}
        initialPaidAmounts={paidAmounts}
        members={members}
        labels={dict.dues}
        commonLabels={dict.common}
      />
    </div>
  );
}

export default function DuesPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <DuesContent params={params} />
    </Suspense>
  );
}
