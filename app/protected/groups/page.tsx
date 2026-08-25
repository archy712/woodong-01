import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PlusIcon, UsersIcon } from "lucide-react";

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
  EmptyDescription,
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
  const groups = await listMyGroups(supabase, claimsData.claims.sub);

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

      {groups.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {groups.map((group) => (
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
            <EmptyTitle>{dict.emptyStates.noGroups}</EmptyTitle>
            <EmptyDescription>{dict.groups.pageTitle}</EmptyDescription>
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
