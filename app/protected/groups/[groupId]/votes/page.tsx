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
import { getDummyVotesForGroup } from "@/lib/woodong/dummy";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { DummyVoteBundle } from "@/lib/woodong/dummy/votes";

function VoteCard({
  bundle,
  groupId,
  dict,
}: {
  bundle: DummyVoteBundle;
  groupId: string;
  dict: Dictionary;
}) {
  const { vote, results } = bundle;
  const totalResponses = results.reduce((sum, r) => sum + r.response_count, 0);

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

  const bundles = getDummyVotesForGroup(groupId);
  const openVotes = bundles.filter((b) => b.vote.status === "open");
  const closedVotes = bundles.filter((b) => b.vote.status === "closed");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{dict.votes.pageTitle}</h1>
        <Button asChild size="sm">
          <Link href={`/protected/groups/${groupId}/votes/new`}>
            <PlusIcon />
            {dict.votes.create.title}
          </Link>
        </Button>
      </div>

      {bundles.length === 0 ? (
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
                {openVotes.map((bundle) => (
                  <VoteCard
                    key={bundle.vote.id}
                    bundle={bundle}
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
                {closedVotes.map((bundle) => (
                  <VoteCard
                    key={bundle.vote.id}
                    bundle={bundle}
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
    <Suspense fallback={null}>
      <VotesContent params={params} />
    </Suspense>
  );
}
