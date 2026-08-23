import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";

async function NewGroupContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">모임 만들기</h1>
    </div>
  );
}

export default function NewGroupPage() {
  return (
    <Suspense fallback={null}>
      <NewGroupContent />
    </Suspense>
  );
}
