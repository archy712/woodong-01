import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CreateGroupForm } from "@/components/create-group-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

async function NewGroupContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/protected/groups"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {dict.groups.pageTitle}
        </Link>
        <CreateGroupForm labels={dict.groups.create} />
      </div>
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
