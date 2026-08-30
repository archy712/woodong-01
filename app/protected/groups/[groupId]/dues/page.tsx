import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { DuesDashboard } from "@/components/dues/dues-dashboard";
import { DuesDashboardSkeleton } from "@/components/dues/dues-dashboard-skeleton";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDuesOverview } from "@/lib/woodong/queries/dues";
import { listGroupExpenses } from "@/lib/woodong/queries/expenses";
import { getGroupDetail, listGroupMembers } from "@/lib/woodong/queries/groups";

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

  // 비멤버는 RLS 때문에 어차피 빈 화면을 보게 되지만, "회비 항목이 없는 모임"과 구분되지 않는다.
  // 모임 상세와 같은 안내를 먼저 보여주고 조회 자체를 하지 않는다.
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.dues.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  // Task 037 전까지는 이 자리에서 회비 리마인드를 lazy로 만들었다(렌더 도중 쓰기). 이제는
  // pg_cron 잡 `woodong_due_reminders`가 매일 09:00 KST에 만든다 — 화면을 열지 않은 사람도
  // 리마인드를 받고, 회비 화면은 순수한 조회로 돌아왔다(docs/ops/CRON_JOBS.md).
  const [overview, members, expenses] = await Promise.all([
    getDuesOverview(supabase, groupId),
    listGroupMembers(supabase, groupId, data.claims.sub),
    // 지출도 같은 묶음에 넣는다(Task 035). 잔액 카드가 회비 수납액과 함께 그려지므로
    // 순차로 붙이면 이 화면에 왕복 1회가 그대로 더해진다.
    listGroupExpenses(supabase, groupId),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6 sm:p-8">
      <DuesDashboard
        groupId={groupId}
        defaultDueAmount={detail.group.default_due_amount}
        cycles={overview.cycles}
        duesByCycle={overview.duesByCycle}
        paymentsByDue={overview.paymentsByDue}
        paidAmounts={overview.paidAmounts}
        members={members}
        isAdmin={detail.role === "admin"}
        expenses={expenses}
        labels={dict.dues}
        expenseLabels={dict.expenses}
        commonLabels={dict.common}
        exportLabels={dict.exports}
        settlementsLinkLabel={dict.settlements.entryLinkLabel}
        unnamedMemberLabel={dict.groups.members.unnamedMemberLabel}
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
    <Suspense fallback={<DuesDashboardSkeleton />}>
      <DuesContent params={params} />
    </Suspense>
  );
}
