import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

async function AnnouncementsContent({
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

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">
        {dict.groups.announcements.pageTitle}
      </h1>
      <p className="text-sm text-muted-foreground">
        {dict.common.groupIdLabel}: {groupId}
      </p>
    </div>
  );
}

export default function AnnouncementsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <AnnouncementsContent params={params} />
    </Suspense>
  );
}
