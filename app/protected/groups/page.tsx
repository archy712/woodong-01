import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

async function GroupsContent() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Task 008 범위: "내가 속한 모임 이름 나열" 정도의 최소 실데이터 조회만 붙인다.
  // 카드 UI/정렬/페이지네이션 등 전체 목록 화면 구현은 Task 012/019 범위.
  const { data: memberships } = await supabase
    .from("woodong_group_members")
    .select("group_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const groupIds = memberships?.map((m) => m.group_id) ?? [];

  const { data: groups } = groupIds.length
    ? await supabase
        .from("woodong_groups")
        .select("id, name")
        .in("id", groupIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{dict.groups.pageTitle}</h1>
        <Button asChild size="sm">
          <Link href="/protected/groups/new">{dict.groups.createButton}</Link>
        </Button>
      </div>

      {groups && groups.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                href={`/protected/groups/${group.id}`}
                className="underline underline-offset-4"
              >
                {group.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {dict.emptyStates.noGroups}
        </p>
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={null}>
      <GroupsContent />
    </Suspense>
  );
}
