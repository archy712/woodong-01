import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SettlementList } from "@/components/settlements/settlement-list";
import { CardListSkeleton } from "@/components/page-skeletons";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { listGroupSettlements } from "@/lib/woodong/queries/settlements";

/**
 * 정산 리포트 목록 (Task 036, PRD 6.3).
 *
 * 상단 탭을 6개로 늘리지 않고 회비(`/dues`) 아래에 둔다. 정산은 회비·지출의 결과물이고,
 * `GroupNavTabs`가 `pathname.startsWith(".../dues")`로 활성 탭을 판정하므로 이 화면에서도
 * "회비" 탭이 그대로 켜져 있다.
 */
async function SettlementsContent({
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

  // 비멤버는 RLS 때문에 어차피 빈 목록을 보게 되지만, "정산이 없는 모임"과 구분되지 않는다.
  // 회비·투표 화면과 같은 안내를 먼저 보여주고 조회 자체를 하지 않는다.
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.settlements.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  const settlements = await listGroupSettlements(supabase, groupId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href={`/protected/groups/${groupId}/dues`}>
          <ArrowLeftIcon />
          {dict.settlements.backToDuesLabel}
        </Link>
      </Button>
      <SettlementList
        groupId={groupId}
        settlements={settlements}
        isAdmin={detail.role === "admin"}
        labels={dict.settlements}
      />
    </div>
  );
}

export default function SettlementsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<CardListSkeleton rows={3} withAction />}>
      <SettlementsContent params={params} />
    </Suspense>
  );
}
