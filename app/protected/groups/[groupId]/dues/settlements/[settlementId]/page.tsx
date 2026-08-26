import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SettlementDetailView } from "@/components/settlements/settlement-detail-view";
import { CardListSkeleton } from "@/components/page-skeletons";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail, listGroupMembers } from "@/lib/woodong/queries/groups";
import { getSettlementDetail } from "@/lib/woodong/queries/settlements";

async function SettlementDetailContent({
  params,
}: {
  params: Promise<{ groupId: string; settlementId: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { groupId, settlementId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

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

  // 리포트 본문과 멤버 목록은 서로의 결과를 쓰지 않는다. 멤버 목록은 발행자·작성자 이름을
  // 해석하는 데만 쓰이므로(공유 `profiles`를 직접 조인할 수 없다) 나란히 읽는다.
  const [settlementDetail, members] = await Promise.all([
    getSettlementDetail(supabase, groupId, settlementId),
    listGroupMembers(supabase, groupId, data.claims.sub),
  ]);

  // 일반회원이 **초안** id를 URL로 직접 열면 RLS가 0행을 주므로 여기로 떨어진다.
  // "없는 리포트"와 같은 안내를 쓴다 — 초안이 존재한다는 사실 자체를 알려 줄 이유가 없다.
  if (!settlementDetail) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-6 sm:p-8">
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link href={`/protected/groups/${groupId}/dues/settlements`}>
            <ArrowLeftIcon />
            {dict.settlements.pageTitle}
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          {dict.settlements.detail.notFound}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="print-hidden self-start"
      >
        <Link href={`/protected/groups/${groupId}/dues/settlements`}>
          <ArrowLeftIcon />
          {dict.settlements.pageTitle}
        </Link>
      </Button>
      <SettlementDetailView
        groupId={groupId}
        detail={settlementDetail}
        members={members}
        isAdmin={detail.role === "admin"}
        labels={dict.settlements}
        commonLabels={dict.common}
        // 항목 카테고리 문구는 회비·지출 화면과 같은 사전을 쓴다. 정산에만 따로 두면
        // 같은 카테고리가 화면마다 다른 이름으로 보인다.
        categoryLabels={{
          dueType: dict.dues.type,
          expense: dict.expenses.category,
        }}
        unnamedMemberLabel={dict.groups.members.unnamedMemberLabel}
        groupName={detail.group.name}
      />
    </div>
  );
}

export default function SettlementDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; settlementId: string }>;
}) {
  return (
    <Suspense fallback={<CardListSkeleton rows={2} />}>
      <SettlementDetailContent params={params} />
    </Suspense>
  );
}
