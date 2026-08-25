import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { processDueReminders } from "@/lib/woodong/due-reminders";
import { listMyNotifications } from "@/lib/woodong/queries/notifications";
import { CardListSkeleton } from "@/components/page-skeletons";

async function NotificationsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 리마인드 lazy 처리 (Task 028) — 회비 화면과 함께 PRD가 지정한 두 진입점 중 하나다.
  // 여기서는 모임을 좁히지 않는다(알림센터는 모든 모임의 소식을 모아 보는 곳이다).
  // 목록 조회보다 **먼저** 실행해야 방금 만들어진 리마인드가 이번 렌더에 들어온다.
  //
  // ℹ️ 헤더 종 아이콘 뱃지는 이 페이지와 동시에 렌더되므로, 이번에 새로 만들어진 리마인드가
  // 뱃지 숫자에는 한 박자 늦게 반영될 수 있다(목록에는 바로 보인다). 다음 이동에서 맞춰진다.
  await processDueReminders(supabase, {
    titleSuffix: dict.dues.reminderNotificationTitleSuffix,
    body: dict.dues.reminderNotificationBody,
  });

  // 필터를 걸지 않아도 RLS(`user_id = auth.uid()`)가 본인 알림만 내려준다.
  const notifications = await listMyNotifications(supabase);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.notifications.pageTitle}</h1>
      <NotificationsList
        notifications={notifications}
        labels={dict.notifications}
      />
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<CardListSkeleton rows={4} />}>
      <NotificationsContent />
    </Suspense>
  );
}
