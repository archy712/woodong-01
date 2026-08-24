import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDummyNotifications } from "@/lib/woodong/dummy";

async function NotificationsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const notifications = getDummyNotifications();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.notifications.pageTitle}</h1>
      <NotificationsList
        initialNotifications={notifications}
        labels={dict.notifications}
      />
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={null}>
      <NotificationsContent />
    </Suspense>
  );
}
