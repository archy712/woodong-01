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
import { getDummyGroupSummaries } from "@/lib/woodong/dummy";

async function GroupsContent() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Task 012부터는 Phase 2 방침에 따라 더미 데이터로 렌더링한다. 실 Supabase 연동은
  // Task 019(모임 CRUD)에서 이 더미 조회를 실제 쿼리로 교체한다.
  const groups = getDummyGroupSummaries();

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
                    {group.latestDuePaidRate !== null && (
                      <span>
                        {dict.dues.summaryLabel} {group.latestDuePaidRate}%
                      </span>
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
    <Suspense fallback={null}>
      <GroupsContent />
    </Suspense>
  );
}
