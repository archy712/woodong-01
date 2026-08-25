import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "@/components/change-password-form";
import { LinkedAccounts } from "@/components/me/linked-accounts";
import { NotificationChannelSettings } from "@/components/notifications/notification-channel-settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_AVATAR_KEY,
  isAvatarKey,
  AVATAR_EMOJI,
} from "@/lib/woodong/avatars";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { DUMMY_NOTIFICATION_PREFERENCES } from "@/lib/woodong/dummy";

async function MeContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 프로필(이름/이메일)은 이미 실제로 동작하는 Supabase 조회를 그대로 재사용한다
  // (`app/protected/profile/page.tsx`와 동일 패턴). 알림 채널은 Task 027 몫이라
  // 아직 더미 데이터로 렌더링한다.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, name, phone_number, bio")
    .eq("id", userId)
    .maybeSingle();

  const { data: woodongProfile } = await supabase
    .from("woodong_profiles")
    .select("avatar_key")
    .eq("user_id", userId)
    .maybeSingle();

  const avatarKey =
    woodongProfile && isAvatarKey(woodongProfile.avatar_key)
      ? woodongProfile.avatar_key
      : DEFAULT_AVATAR_KEY;

  // 연동된 로그인 수단은 JWT의 `app_metadata.providers`에서 읽는다(Task 018-1).
  //
  // 처음에는 `getUserIdentities()`를 썼지만, 이 API는 내부적으로 `getUser()`를 호출하고
  // 서버 컴포넌트에서는 세션 갱신 시점에 "Auth session missing!"으로 실패하는 경우가 있다.
  // 실패하면 실제로는 연동된 provider가 전부 "연동 안 됨"으로 표시돼 사용자를 오도한다.
  // 이 저장소가 `getUser()` 대신 `getClaims()`를 쓰는 관례와 같은 이유이며, 클레임은 이미
  // 서명 검증을 마친 값이라 추가 네트워크 호출도 필요 없다.
  // 해제에 필요한 identity_id는 실제 해제 시점에 브라우저 클라이언트가 조회한다.
  const appMetadata = data.claims.app_metadata;
  const providers =
    appMetadata?.providers ??
    (appMetadata?.provider ? [appMetadata.provider] : []);

  const hasEmailIdentity = providers.includes("email");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.me.pageTitle}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.me.profileSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback className="text-xl">
                {AVATAR_EMOJI[avatarKey]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {profile?.name || data.claims.email || userId}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile?.email ?? data.claims.email}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/protected/profile">{dict.me.editProfileButton}</Link>
          </Button>
        </CardContent>
      </Card>

      {/* 비밀번호 변경은 현재 비밀번호 재인증이 전제라, 이메일 identity가 있는 계정만 노출한다. */}
      {hasEmailIdentity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {dict.auth.changePassword.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm
              auth={dict.auth}
              email={data.claims.email ?? ""}
              errors={dict.errors}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.notifications.channelSettings.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationChannelSettings
            initialPreferences={DUMMY_NOTIFICATION_PREFERENCES}
            labels={dict.notifications.channelSettings}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.me.linkedAccountsSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LinkedAccounts
            providers={providers}
            email={data.claims.email ?? null}
            labels={dict.me}
            errors={dict.errors}
            // Kakao 이메일 동의를 거부한 계정은 이메일 로그인 수단을 붙일 수 없다(PRD 3.6.2).
            noEmailNotice={
              data.claims.email ? null : dict.auth.kakaoNoEmailNotice
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function MePage() {
  return (
    <Suspense fallback={null}>
      <MeContent />
    </Suspense>
  );
}
