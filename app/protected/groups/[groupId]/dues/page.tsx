import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { DuesDashboard } from "@/components/dues/dues-dashboard";
import { DuesDashboardSkeleton } from "@/components/dues/dues-dashboard-skeleton";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { processDueReminders } from "@/lib/woodong/due-reminders";
import { getDuesOverview } from "@/lib/woodong/queries/dues";
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

  // 리마인드 lazy 처리 (Task 028): 스케줄러가 없는 1차 MVP에서는 회비 화면에 들어온 이 순간이
  // "밀린 리마인드가 있는지" 확인할 수 있는 시점이다. 실패해도 throw하지 않으므로 화면은
  // 그대로 그려진다.
  //
  // 예전에는 조회보다 **먼저** await했는데, 이 화면이 리마인드 결과로 그리는 것이 하나도 없다
  // — RPC가 건드리는 `woodong_dues.last_reminded_at`은 타입에만 있고 렌더링되지 않으며,
  // 알림은 별도 화면(알림센터)과 헤더 배지(독립 Suspense)가 읽는다. 그래서 조회를 붙잡을
  // 이유가 없어 나란히 돌린다(Task 033 후속 LCP 최적화).
  // ⚠️ 나중에 이 화면에서 `last_reminded_at`을 표시하게 되면 다시 순서를 되돌려야 한다.
  const [, overview, members] = await Promise.all([
    processDueReminders(supabase, {
      groupId,
      titleSuffix: dict.dues.reminderNotificationTitleSuffix,
      body: dict.dues.reminderNotificationBody,
    }),
    getDuesOverview(supabase, groupId),
    listGroupMembers(supabase, groupId, data.claims.sub),
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
        labels={dict.dues}
        commonLabels={dict.common}
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
