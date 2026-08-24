import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CreateVoteForm } from "@/components/votes/create-vote-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

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

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href={`/protected/groups/${groupId}/votes`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {dict.votes.pageTitle}
        </Link>
        <CreateVoteForm groupId={groupId} labels={dict.votes} />
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
