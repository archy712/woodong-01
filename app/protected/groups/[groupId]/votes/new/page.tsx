import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CreateVoteForm } from "@/components/votes/create-vote-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getGroupDetail } from "@/lib/woodong/queries/groups";

async function NewVoteContent({
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

  // 목록에서 버튼을 감추는 것만으로는 부족하다 — URL로 직접 들어오는 경로가 있다.
  // 최종 방어는 RPC 안의 총무 판정이고, 여기서는 반드시 실패할 폼을 보여주지 않는다.
  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);
  const isAdmin = detail?.role === "admin";

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href={`/protected/groups/${groupId}/votes`}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {dict.votes.pageTitle}
        </Link>
        {isAdmin ? (
          <CreateVoteForm groupId={groupId} labels={dict.votes} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {dict.votes.adminOnlyNotice}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewVotePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <NewVoteContent params={params} />
    </Suspense>
  );
}
