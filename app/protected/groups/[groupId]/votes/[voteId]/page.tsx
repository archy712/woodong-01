import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteDetail } from "@/components/votes/vote-detail";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getVoteDetail } from "@/lib/woodong/queries/votes";

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

  const { voteId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const detail = await getVoteDetail(supabase, voteId, data.claims.sub);

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
        </CardHeader>
        <CardContent>
          <VoteDetail
            vote={vote}
            options={options}
            results={results}
            hasVoted={hasVoted}
            isClosed={isClosed}
            labels={dict.votes}
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
    <Suspense fallback={null}>
      <VoteDetailContent params={params} />
    </Suspense>
  );
}
