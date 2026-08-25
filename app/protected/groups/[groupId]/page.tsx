import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  BellIcon,
  MegaphoneIcon,
  UsersIcon,
  VoteIcon,
  WalletIcon,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { formatWon } from "@/lib/woodong/dues-summary";
import { listRecentAnnouncements } from "@/lib/woodong/queries/announcements";
import { getLatestDueCycleSummary } from "@/lib/woodong/queries/dues";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { listOpenVotes } from "@/lib/woodong/queries/votes";
import { processExpiredVotes } from "@/lib/woodong/vote-closing";

async function GroupDetailContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  const { groupId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 모임 자체는 Task 019, 회비 요약은 Task 024, 공지 요약은 Task 025, 투표 요약은 Task 030에서
  // 실제 쿼리로 교체했다(투표 카드만 Task 029에서 빠져 있었다).
  const detail = await getGroupDetail(supabase, groupId, claimsData.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.groups.detailTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  const { group, memberCount, coverUrl } = detail;

  // 마감 lazy 처리 (Task 030): "진행 중인 투표" 카드는 `status`로 거르므로, 마감 시각이 지난
  // 투표를 먼저 닫지 않으면 여기에 계속 진행중으로 남는다. 조회보다 **먼저** 실행한다.
  await processExpiredVotes(supabase, {
    groupId,
    title: dict.votes.closeNotificationTitle,
    body: dict.votes.closeNotificationBody,
  });

  const [latestDues, recentAnnouncements, openVotes] = await Promise.all([
    getLatestDueCycleSummary(supabase, groupId),
    listRecentAnnouncements(supabase, groupId),
    listOpenVotes(supabase, groupId),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      {coverUrl && (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={coverUrl}
            alt={group.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {group.type && <Badge variant="secondary">{group.type}</Badge>}
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <UsersIcon className="size-4" />
          {memberCount}
          {dict.common.memberCountSuffix}
        </span>
      </div>

      {/* 공지 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MegaphoneIcon className="size-4" />
              {dict.groups.dashboard.announcementsTitle}
            </CardTitle>
            <Link
              href={`/protected/groups/${groupId}/announcements`}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {dict.common.viewAllLink}
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentAnnouncements.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentAnnouncements.map((a) => (
                <li key={a.id} className="text-sm">
                  <p className="font-medium">{a.title}</p>
                  <p className="line-clamp-1 text-muted-foreground">{a.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {dict.emptyStates.noAnnouncements}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 회비 납부율 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletIcon className="size-4" />
              {dict.groups.dashboard.duesTitle}
            </CardTitle>
            <Link
              href={`/protected/groups/${groupId}/dues`}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {dict.common.viewAllLink}
            </Link>
          </div>
          {latestDues && (
            <CardDescription>{latestDues.cycle.title}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {latestDues ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>{dict.dues.summaryLabel}</span>
                <span className="font-semibold">
                  {latestDues.summary.paidRate}%
                </span>
              </div>
              <Progress value={latestDues.summary.paidRate} />
              <span className="text-sm text-muted-foreground">
                {/* 분모는 모임 인원이 아니라 **이 항목의 청구 인원**이다 — 항목 생성 뒤 가입한
                    멤버는 소급 청구되지 않으므로(Task 022 정책) 둘이 다를 수 있다. */}
                {latestDues.summary.countByStatus.unpaid +
                  latestDues.summary.countByStatus.partial}
                {dict.groups.dashboard.unpaidCountLabel} /{" "}
                {latestDues.summary.totalCount}
                {dict.dues.chargedCountSuffix}
              </span>
              {/* 지출 데이터가 없으므로 잔액이 아니라 **수납액/청구액**만 보여준다(PRD 3.4-a). */}
              <span className="text-sm text-muted-foreground">
                {dict.dues.collectedAmountLabel}{" "}
                <span className="font-medium text-foreground">
                  {formatWon(latestDues.summary.collectedAmount)}
                </span>{" "}
                / {formatWon(latestDues.summary.chargedAmount)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {dict.dues.emptyState}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 진행 중인 투표 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <VoteIcon className="size-4" />
              {dict.groups.dashboard.votesTitle}
            </CardTitle>
            <Link
              href={`/protected/groups/${groupId}/votes`}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {dict.common.viewAllLink}
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {openVotes.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {openVotes.map((vote) => (
                <li key={vote.id}>
                  <Link
                    href={`/protected/groups/${groupId}/votes/${vote.id}`}
                    className="flex min-h-11 items-center justify-between gap-2 text-sm hover:underline"
                  >
                    <span className="font-medium">{vote.title}</span>
                    <Badge variant="outline">{dict.votes.statusOpen}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {dict.groups.dashboard.noOpenVotes}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <BellIcon className="size-4 shrink-0" />
          {dict.dues.incomeOnlyNotice}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <GroupDetailContent params={params} />
    </Suspense>
  );
}
