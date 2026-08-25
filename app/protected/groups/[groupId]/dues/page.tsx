import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { DuesDashboard } from "@/components/dues/dues-dashboard";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
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

  const [overview, members] = await Promise.all([
    getDuesOverview(supabase, groupId),
    listGroupMembers(supabase, groupId, data.claims.sub),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6 sm:p-8">
      <DuesDashboard
        groupId={groupId}
        cycles={overview.cycles}
        duesByCycle={overview.duesByCycle}
        paidAmounts={overview.paidAmounts}
        members={members}
        isAdmin={detail.role === "admin"}
        labels={dict.dues}
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
    <Suspense fallback={null}>
      <DuesContent params={params} />
    </Suspense>
  );
}
