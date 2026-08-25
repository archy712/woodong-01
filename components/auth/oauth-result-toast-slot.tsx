import { OAuthResultToast } from "@/components/auth/oauth-result-toast";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

/**
 * `getLocale()`(쿠키/헤더 접근)이 필요한 서버 측 래퍼. 루트 레이아웃에서
 * `<Suspense>` 안에 두어 `cacheComponents: true`의 blocking-route 에러를 피한다.
 */
export async function OAuthResultToastSlot() {
  const dict = getDictionary(await getLocale());

  return (
    <OAuthResultToast
      linkedMessage={dict.auth.socialAccountLinkedToast}
      noEmailMessage={dict.auth.kakaoNoEmailNotice}
      manualLinkCta={dict.auth.manualLinkCta}
    />
  );
}
