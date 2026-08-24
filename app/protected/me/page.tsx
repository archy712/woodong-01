import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UserIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { NotificationChannelSettings } from "@/components/notifications/notification-channel-settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  // (`app/protected/profile/page.tsx`와 동일 패턴). 알림 채널/연동 계정은 Task 018/027 몫이라
  // 이번 Task는 더미 데이터로 렌더링한다.
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

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.me.pageTitle}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.me.profileSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
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
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <UserIcon className="size-4" />
              Google
            </span>
            <Badge variant="secondary">{dict.me.connectedLabel}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <UserIcon className="size-4" />
              Kakao
            </span>
            <Badge variant="outline">{dict.me.notConnectedLabel}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {dict.me.linkedAccountsNotice}
          </p>
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
