import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";
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

  // 검증에 실패한 `next`(외부 URL 등)는 여기서 기본 경로로 폴백된다(Task 017).
  const next = resolveNextPath(
    Array.isArray(params.next) ? params.next[0] : params.next,
  );

  return (
    <LoginForm
      auth={dict.auth}
      or={dict.common.or}
      errors={dict.errors}
      next={next}
    />
  );
}
