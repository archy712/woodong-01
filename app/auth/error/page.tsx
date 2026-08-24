import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Suspense fallback={null}>
            <PageContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function PageContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const dict = getDictionary(locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{dict.auth.error.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {params?.error
            ? `${dict.auth.error.codeErrorPrefix}${params.error}`
            : dict.auth.error.unspecifiedError}
        </p>
      </CardContent>
    </Card>
  );
}
