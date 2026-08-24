import { Suspense } from "react";

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <PageContent />
        </Suspense>
      </div>
    </div>
  );
}

async function PageContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <ForgotPasswordForm
      auth={dict.auth}
      genericError={dict.errors.genericError}
    />
  );
}
