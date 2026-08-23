import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

async function VoteDetailContent({
  params,
}: {
  params: Promise<{ groupId: string; voteId: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { groupId, voteId } = await params;

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">투표 상세</h1>
      <p className="text-sm text-muted-foreground">
        모임 ID: {groupId} / 투표 ID: {voteId}
      </p>
    </div>
  );
}

export default function VoteDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; voteId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <VoteDetailContent params={params} />
    </Suspense>
  );
}
