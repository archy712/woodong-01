import { Suspense } from "react";

import { SignUpForm } from "@/components/sign-up-form";
import { resolveNextPath } from "@/lib/auth/next-path";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <PageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function PageContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const dict = getDictionary(locale);

  // 초대 링크로 들어와 가입까지 이어지는 경우에도 원래 경로로 복귀시킨다(Task 017).
  const next = resolveNextPath(
    Array.isArray(params.next) ? params.next[0] : params.next,
  );

  return (
    <SignUpForm
      auth={dict.auth}
      or={dict.common.or}
      errors={dict.errors}
      legal={dict.legal}
      next={next}
    />
  );
}
