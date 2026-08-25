import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseVoteButton } from "@/components/votes/close-vote-button";
import { VoteDetail } from "@/components/votes/vote-detail";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { getVoteDetail } from "@/lib/woodong/queries/votes";
import { processExpiredVotes } from "@/lib/woodong/vote-closing";
import { VoteDetailSkeleton } from "@/components/page-skeletons";

async function VoteDetailContent({
  params,
}: {
  params: Promise<{ groupId: string; voteId: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { groupId, voteId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 마감 lazy 처리 (Task 030): 목록과 같은 이유로 조회보다 **먼저** 실행한다. 상세만 열고
  // 목록을 거치지 않는 경로(알림 클릭)로 들어와도 여기서 마감이 처리돼야 한다.
  await processExpiredVotes(supabase, {
    groupId,
    title: dict.votes.closeNotificationTitle,
    body: dict.votes.closeNotificationBody,
  });

  // "지금 마감" 버튼은 총무에게만 보여준다(쓰기는 RPC가 다시 막는다).
  const [group, detail] = await Promise.all([
    getGroupDetail(supabase, groupId, data.claims.sub),
    getVoteDetail(supabase, voteId, data.claims.sub),
  ]);

  if (!detail) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.votes.detailTitle}</h1>
        <p className="text-sm text-muted-foreground">{dict.votes.notFound}</p>
      </div>
    );
  }

  const { vote, options, results, hasVoted, isClosed } = detail;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{vote.title}</CardTitle>
            <Badge variant={vote.status === "open" ? "default" : "outline"}>
              {vote.status === "open"
                ? dict.votes.statusOpen
                : dict.votes.statusClosed}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {dict.votes.create.closesAtLabel}:{" "}
            {new Date(vote.closes_at).toLocaleString("ko-KR")}
          </p>
          {group?.role === "admin" && !isClosed && (
            <CloseVoteButton
              voteId={vote.id}
              groupId={groupId}
              labels={dict.votes}
              commonLabels={dict.common}
            />
          )}
        </CardHeader>
        <CardContent>
          <VoteDetail
            vote={vote}
            options={options}
            results={results}
            hasVoted={hasVoted}
            isClosed={isClosed}
            labels={dict.votes}
            unnamedVoterLabel={dict.groups.members.unnamedMemberLabel}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function VoteDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; voteId: string }>;
}) {
  return (
    <Suspense fallback={<VoteDetailSkeleton />}>
      <VoteDetailContent params={params} />
    </Suspense>
  );
}
