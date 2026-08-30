import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { parseNotificationType } from "@/lib/woodong/notifications";
import { listMyNotifications } from "@/lib/woodong/queries/notifications";
import { CardListSkeleton } from "@/components/page-skeletons";

async function NotificationsContent({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; unread?: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 알 수 없는 값은 조용히 "전체"로 떨어진다(Task 040). 잘못된 쿼리스트링 때문에 에러 화면을
  // 띄우기보다 필터가 걸리지 않은 목록을 보여주는 쪽이 낫다.
  const { type, unread } = await searchParams;
  const activeType = parseNotificationType(type);
  const unreadOnly = unread === "1";

  // 필터를 걸지 않아도 RLS(`user_id = auth.uid()`)가 본인 알림만 내려준다.
  const notifications = await listMyNotifications(supabase, {
    type: activeType,
    unreadOnly,
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.notifications.pageTitle}</h1>
      <NotificationFilters
        activeType={activeType}
        unreadOnly={unreadOnly}
        labels={dict.notifications}
      />
      <NotificationsList
        notifications={notifications}
        isFiltered={Boolean(activeType) || unreadOnly}
        labels={dict.notifications}
      />
    </div>
  );
}

export default function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; unread?: string }>;
}) {
  return (
    <Suspense fallback={<CardListSkeleton rows={4} />}>
      <NotificationsContent searchParams={searchParams} />
    </Suspense>
  );
}
