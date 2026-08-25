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
import { getDummyGroupDashboard } from "@/lib/woodong/dummy";
import { getGroupDetail } from "@/lib/woodong/queries/groups";

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

  // 모임 자체는 Task 019에서 실제 쿼리로 교체했다. 공지/회비/투표 요약은 각 도메인 Task
  // (024/028/029)에서 교체 예정이라 아직 더미다 — 실제 모임 id에는 더미가 없으므로
  // 각 카드가 자연스럽게 빈 상태로 렌더링된다.
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
  const dashboard = getDummyGroupDashboard(groupId);

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
          {dashboard.latestAnnouncements.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {dashboard.latestAnnouncements.map((a) => (
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
          {dashboard.latestDueCycle && (
            <CardDescription>{dashboard.latestDueCycle.title}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {dashboard.latestDueCycle ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>{dict.dues.summaryLabel}</span>
                <span className="font-semibold">
                  {dashboard.latestDuePaidRate}%
                </span>
              </div>
              <Progress value={dashboard.latestDuePaidRate} />
              <span className="text-sm text-muted-foreground">
                {dashboard.unpaidMemberCount}
                {dict.groups.dashboard.unpaidCountLabel} /{" "}
                {dashboard.totalMemberCount}
                {dict.common.memberCountSuffix}
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
          {dashboard.openVotes.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {dashboard.openVotes.map(({ vote }) => (
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
