import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { AnnouncementList } from "@/components/announcements/announcement-list";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { listAnnouncements } from "@/lib/woodong/queries/announcements";
import { getGroupDetail } from "@/lib/woodong/queries/groups";
import { CardListSkeleton } from "@/components/page-skeletons";

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

  // 비멤버는 RLS 때문에 어차피 빈 목록을 보게 되지만, "공지가 없는 모임"과 구분되지 않는다.
  // 회비 화면과 같은 안내를 먼저 보여주고 조회 자체를 하지 않는다.
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">
          {dict.groups.announcements.pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  const announcements = await listAnnouncements(supabase, groupId);
  const isAdmin = detail.role === "admin";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          {dict.groups.announcements.pageTitle}
        </h1>
        {/* 쓰기는 RLS와 RPC가 막지만, 총무가 아닌 사람에게 반드시 실패할 버튼을 보여주지 않는다. */}
        {isAdmin && (
          <Button asChild size="sm">
            <Link href={`/protected/groups/${groupId}/announcements/new`}>
              <PlusIcon />
              {dict.groups.announcements.writeButton}
            </Link>
          </Button>
        )}
      </div>

      <AnnouncementList
        announcements={announcements}
        isAdmin={isAdmin}
        labels={dict.groups.announcements}
        commonLabels={dict.common}
        emptyLabel={dict.emptyStates.noAnnouncements}
      />
    </div>
  );
}

export default function AnnouncementsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={<CardListSkeleton rows={3} withAction />}>
      <AnnouncementsContent params={params} />
    </Suspense>
  );
}
