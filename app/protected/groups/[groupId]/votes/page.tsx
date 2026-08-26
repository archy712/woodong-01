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
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { listVotes, type VoteListItem } from "@/lib/woodong/queries/votes";
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
  const { vote, totalResponses, isClosed } = item;

  return (
    <Link href={`/protected/groups/${groupId}/votes/${vote.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{vote.title}</CardTitle>
            <Badge variant={isClosed ? "outline" : "default"}>
              {isClosed ? dict.votes.statusClosed : dict.votes.statusOpen}
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

  // 마감은 pg_cron 잡 `woodong_vote_closing`이 5분마다 처리한다(Task 037). 예전에는 이 자리에서
  // lazy로 닫았다 — 목록을 여는 순간이 유일한 처리 시점이었기 때문이다.
  const items = await listVotes(supabase, groupId);
  // 분류 기준은 `status`가 아니라 `isClosed`다 — 배치가 아직 닫지 않은 투표를 진행중 칸에
  // 두면 "참여할 수 없는 진행중 투표"가 보인다(`isVoteClosed()` 주석 참고).
  const openVotes = items.filter((item) => !item.isClosed);
  const closedVotes = items.filter((item) => item.isClosed);

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
            {/*
              `votes.emptyState`와 `emptyStates.noVotes`는 한국어 문장이 완전히 같아서
              둘 다 쓰면 같은 말이 위아래로 두 번 나온다. 게다가 `votes.emptyState`는
              en/ja/zh 사전에도 한국어가 그대로 들어 있어, 번역된 `emptyStates.noVotes` 쪽만
              남기는 것이 두 문제를 함께 해결한다(Task 033).
            */}
            <EmptyTitle>{dict.emptyStates.noVotes}</EmptyTitle>
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
