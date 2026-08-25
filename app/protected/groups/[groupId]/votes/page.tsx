import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PlusIcon, VoteIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { listVotes, type VoteListItem } from "@/lib/woodong/queries/votes";
import { processExpiredVotes } from "@/lib/woodong/vote-closing";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CardListSkeleton } from "@/components/page-skeletons";

function VoteCard({
  item,
  groupId,
  dict,
}: {
  item: VoteListItem;
  groupId: string;
  dict: Dictionary;
}) {
  const { vote, totalResponses } = item;

  return (
    <Link href={`/protected/groups/${groupId}/votes/${vote.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{vote.title}</CardTitle>
            <Badge variant={vote.status === "open" ? "default" : "outline"}>
              {vote.status === "open"
                ? dict.votes.statusOpen
                : dict.votes.statusClosed}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {vote.vote_type === "multiple_choice"
              ? dict.votes.type.multipleChoice
              : dict.votes.type.yesNo}
          </span>
          {vote.is_anonymous && (
            <Badge variant="secondary">
              {dict.votes.anonymousResultsNotice}
            </Badge>
          )}
          <span>
            {totalResponses}
            {dict.votes.responseCountSuffix}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

async function VotesContent({
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

  // 비멤버는 RLS 때문에 어차피 빈 목록을 보게 되지만, "투표가 없는 모임"과 구분되지 않는다.
  // 회비·공지 화면과 같은 안내를 먼저 보여주고 조회 자체를 하지 않는다.
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.votes.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  // 마감 lazy 처리 (Task 030): 스케줄러가 없는 1차 MVP에서는 목록에 들어온 이 순간이
  // "마감 시각이 지난 투표가 있는지" 확인할 수 있는 시점이다. 조회보다 **먼저** 실행해야
  // 방금 전환된 상태가 이번 렌더의 진행중/마감 분류에 반영된다. 실패해도 throw하지 않으므로
  // 화면은 그대로 그려진다.
  await processExpiredVotes(supabase, {
    groupId,
    title: dict.votes.closeNotificationTitle,
    body: dict.votes.closeNotificationBody,
  });

  const items = await listVotes(supabase, groupId);
  const openVotes = items.filter((item) => item.vote.status === "open");
  const closedVotes = items.filter((item) => item.vote.status === "closed");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{dict.votes.pageTitle}</h1>
        {/* 쓰기는 RLS가 막지만, 반드시 실패할 버튼을 보여주지 않는다(공지와 같은 규약). */}
        {detail.role === "admin" && (
          <Button asChild size="sm">
            <Link href={`/protected/groups/${groupId}/votes/new`}>
              <PlusIcon />
              {dict.votes.create.title}
            </Link>
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <VoteIcon />
            </EmptyMedia>
            <EmptyTitle>{dict.votes.emptyState}</EmptyTitle>
            <EmptyDescription>{dict.emptyStates.noVotes}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              {dict.votes.statusOpen}
            </h2>
            {openVotes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {openVotes.map((item) => (
                  <VoteCard
                    key={item.vote.id}
                    item={item}
                    groupId={groupId}
                    dict={dict}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {dict.groups.dashboard.noOpenVotes}
              </p>
            )}
          </div>

          {closedVotes.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {dict.votes.statusClosed}
              </h2>
              <div className="flex flex-col gap-3">
                {closedVotes.map((item) => (
                  <VoteCard
                    key={item.vote.id}
                    item={item}
                    groupId={groupId}
                    dict={dict}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function VotesPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<CardListSkeleton rows={3} withAction />}>
      <VotesContent params={params} />
    </Suspense>
  );
}
