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
            {/*
              배지도 `status`가 아니라 `isClosed`를 본다. 배치 마감은 최대 5분 늦으므로
              (Task 037) `status`를 쓰면 그동안 배지는 "진행중", 본문은 "마감된 투표라 더
              이상 참여할 수 없어요"가 되어 화면 안에서 말이 어긋난다.
            */}
            <Badge variant={isClosed ? "outline" : "default"}>
              {isClosed ? dict.votes.statusClosed : dict.votes.statusOpen}
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
