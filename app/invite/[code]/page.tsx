import { Suspense } from "react";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

async function InviteContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [{ code }, locale] = await Promise.all([params, getLocale()]);
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">{dict.groups.invitePage.title}</h1>
      <p className="text-sm text-muted-foreground">
        {dict.groups.invitePage.codeLabel}: {code}
      </p>
    </div>
  );
}

export default function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <InviteContent params={params} />
    </Suspense>
  );
}
