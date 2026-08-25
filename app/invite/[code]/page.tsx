import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangleIcon, UsersIcon } from "lucide-react";

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
import { JoinInviteButton } from "@/components/groups/join-invite-button";
import { buildLoginPath } from "@/lib/auth/next-path";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";
import type { InviteStatus } from "@/lib/woodong/groups";
import { getInvitePreview } from "@/lib/woodong/queries/invites";

function InviteErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

/** 참여 불가 사유별 안내 문구. `valid`는 이 함수에 도달하지 않는다. */
function unusableMessage(
  status: Exclude<InviteStatus, "valid" | "not_found">,
  dict: Dictionary,
): string {
  switch (status) {
    case "expired":
      return dict.groups.invitePage.expiredMessage;
    case "revoked":
      return dict.groups.invitePage.revokedMessage;
    case "exhausted":
      return dict.groups.invitePage.exhaustedMessage;
  }
}

async function InviteContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [{ code }, locale] = await Promise.all([params, getLocale()]);
  const dict = getDictionary(locale);

  // 초대 화면은 공개 라우트라 세션이 없을 수 있다. 초대 테이블의 SELECT 정책이 총무 전용이므로
  // 조회는 `woodong_get_invite_preview()`(SECURITY DEFINER, anon 허용)를 거친다.
  const supabase = await createClient();
  const [preview, { data: claimsData }] = await Promise.all([
    getInvitePreview(supabase, code),
    supabase.auth.getClaims(),
  ]);
  const isAuthenticated = Boolean(claimsData?.claims);

  if (preview.status === "not_found" || !preview.groupId) {
    // 존재하지 않는 코드와 잘못 입력한 코드를 구분해서 알려줄 이유가 없다(코드 열거 힌트만 된다).
    return (
      <InviteErrorState
        title={dict.errors.invalidInviteCode}
        description={code}
      />
    );
  }

  // 멤버 판정이 초대 유효성보다 먼저다. 이미 멤버인 사람에게는 링크가 만료·무효화·소진됐든
  // "당신은 이미 이 모임 사람"이 맞는 안내이고, 옛 링크를 다시 눌렀다고 에러 화면을 띄우면
  // 멀쩡한 멤버가 자기가 쫓겨난 줄 안다. `woodong_redeem_group_invite()`도 같은 순서로 판정한다.
  if (preview.status !== "valid" && !preview.isMember) {
    return (
      <InviteErrorState
        title={unusableMessage(preview.status, dict)}
        description={preview.groupName ?? code}
      />
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{preview.groupName}</CardTitle>
            {preview.groupType && (
              <Badge variant="secondary">{preview.groupType}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {preview.groupDescription && (
            <p className="text-sm text-muted-foreground">
              {preview.groupDescription}
            </p>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="size-4" />
            {preview.memberCount}
            {dict.common.memberCountSuffix}
          </span>

          {preview.isMember ? (
            <>
              {/* 이미 멤버인 사람에게 "참여하기"를 보여주면 눌러도 아무 변화가 없어 혼란스럽다.
                  참여 버튼 대신 곧바로 모임으로 보내는 링크를 노출한다. */}
              <p className="text-sm text-muted-foreground">
                {dict.groups.invitePage.alreadyMemberNotice}
              </p>
              <Button asChild>
                <Link href={`/protected/groups/${preview.groupId}`}>
                  {dict.groups.invitePage.goToGroupButton}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {dict.groups.invitePage.previewNotice}
              </p>
              {isAuthenticated ? (
                <JoinInviteButton
                  code={code}
                  labels={dict.groups.invitePage}
                  errorLabels={dict.errors}
                />
              ) : (
                // 참여는 로그인이 필요하므로 이 초대 화면 자체를 `next`로 실어 보낸 뒤
                // 로그인 후 다시 여기로 돌려보낸다(Task 017).
                <Button asChild>
                  <Link
                    href={buildLoginPath(`/invite/${encodeURIComponent(code)}`)}
                  >
                    {dict.groups.invitePage.loginToJoinButton}
                  </Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <InviteContent params={params} />
    </Suspense>
  );
}
