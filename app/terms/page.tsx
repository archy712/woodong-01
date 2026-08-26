import { Suspense } from "react";

import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { TERMS_OF_SERVICE } from "@/lib/legal/terms-of-service";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
  title: "이용약관 | 우동",
};

export default function TermsOfServicePage() {
  return (
    <Suspense fallback={null}>
      <TermsOfServiceContent />
    </Suspense>
  );
}

async function TermsOfServiceContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <LegalDocumentView
      doc={TERMS_OF_SERVICE}
      localizedHeading={dict.legal.terms.heading}
      localizedDescription={dict.legal.terms.description}
      effectiveDateLabel={dict.legal.effectiveDateLabel}
      canonicalNotice={locale === "ko" ? null : dict.legal.canonicalNotice}
    />
  );
}
