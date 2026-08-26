import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangleIcon, PlusIcon, UsersIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { listMyGroups } from "@/lib/woodong/queries/groups";
import { CardListSkeleton } from "@/components/page-skeletons";

async function GroupsContent() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Task 019에서 더미 조회를 실제 Supabase 쿼리로 교체했다. 납부율 요약은 회비 도메인이
  // 붙는 Phase 5(Task 024)에서 이 카드에 추가한다.
  const result = await listMyGroups(supabase, claimsData.claims.sub);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{dict.groups.pageTitle}</h1>
        <Button asChild size="sm">
          <Link href="/protected/groups/new">
            <PlusIcon />
            {dict.groups.createButton}
          </Link>
        </Button>
      </div>

      {!result.ok ? (
        /*
          조회 실패를 빈 상태로 그리면 "아직 속한 모임이 없어요"가 떠서, 모임이 있는
          사용자에게 없다고 말하게 된다(Task 024-1 관측 → Task 033 수정). 실패는 실패로
          보여주고 다시 시도할 수단을 준다. 링크로 새로고침하는 이유는 이 화면이 서버
          컴포넌트라, 재조회하려면 어차피 서버를 한 번 더 태워야 하기 때문이다.
        */
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangleIcon />
            </EmptyMedia>
            <EmptyTitle>{dict.errors.genericError}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="sm" variant="outline">
              <Link href="/protected/groups">{dict.common.retry}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : result.groups.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {result.groups.map((group) => (
            <li key={group.id}>
              <Link href={`/protected/groups/${group.id}`} className="block">
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {group.type && (
                        <Badge variant="secondary" className="shrink-0">
                          {group.type}
                        </Badge>
                      )}
                    </div>
                    {group.description && (
                      <CardDescription className="line-clamp-2">
                        {group.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="size-4" />
                      {group.memberCount}
                      {dict.common.memberCountSuffix}
                    </span>
                    {group.role === "admin" && (
                      <Badge variant="outline">
                        {dict.groups.members.roleAdmin}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            {/*
              설명 자리에 페이지 제목("모임 목록")이 들어가 있어, 빈 화면에 아무 의미 없는
              한 줄이 붙어 있었다. 안내는 제목 문구가 이미 하고 있고 바로 아래 CTA가
              다음 행동을 가리키므로 설명 줄을 두지 않는다(Task 033).
            */}
            <EmptyTitle>{dict.emptyStates.noGroups}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="sm">
              <Link href="/protected/groups/new">
                <PlusIcon />
                {dict.groups.createButton}
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense
      fallback={<CardListSkeleton rows={3} withAction maxWidth="max-w-3xl" />}
    >
      <GroupsContent />
    </Suspense>
  );
}
