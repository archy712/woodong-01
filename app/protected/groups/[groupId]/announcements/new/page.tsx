import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CreateAnnouncementForm } from "@/components/announcements/create-announcement-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";

async function NewAnnouncementContent({
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

  // RPC가 총무 여부를 다시 확인하지만, 일반회원에게 반드시 실패할 폼을 채우게 두지 않는다(이중 방어).
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href={`/protected/groups/${groupId}/announcements`}
          // 최소 44px 터치 타겟(Task 013 규칙). 텍스트만 있는 링크라 높이가 20px에 그쳤다.
          className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {dict.groups.announcements.pageTitle}
        </Link>
        {detail?.role === "admin" ? (
          <CreateAnnouncementForm
            groupId={groupId}
            labels={dict.groups.announcements}
            commonLabels={dict.common}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {detail
              ? dict.groups.announcements.adminOnlyNotice
              : dict.groups.detailNotFound}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewAnnouncementPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <NewAnnouncementContent params={params} />
    </Suspense>
  );
}
