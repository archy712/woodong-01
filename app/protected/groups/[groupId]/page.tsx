import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

async function GroupDetailContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const { groupId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Task 008 범위: 생성 직후 진입했을 때 모임 이름이 보이는 정도의 최소 조회만 붙인다.
  // 멤버 목록/회비/공지 등 상세 화면 전체 구현은 Task 012/019 범위.
  const { data: group } = await supabase
    .from("woodong_groups")
    .select("id, name, description")
    .eq("id", groupId)
    .maybeSingle();

  if (!group) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-8">
        <h1 className="text-2xl font-bold">{dict.groups.detailTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">{group.name}</h1>
      {group.description && (
        <p className="text-sm text-muted-foreground">{group.description}</p>
      )}
    </div>
  );
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <GroupDetailContent params={params} />
    </Suspense>
  );
}
