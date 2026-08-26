import { Suspense } from "react";

import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { PRIVACY_POLICY } from "@/lib/legal/privacy-policy";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
  title: "개인정보 처리방침 | 우동",
};

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={null}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}

async function PrivacyPolicyContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <LegalDocumentView
      doc={PRIVACY_POLICY}
      localizedHeading={dict.legal.privacy.heading}
      localizedDescription={dict.legal.privacy.description}
      effectiveDateLabel={dict.legal.effectiveDateLabel}
      canonicalNotice={locale === "ko" ? null : dict.legal.canonicalNotice}
    />
  );
}
