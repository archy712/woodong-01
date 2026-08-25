import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { HeaderAuthNav } from "@/components/header-auth-nav";
import { HtmlLangSync } from "@/components/html-lang-sync";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { hasEnvVars } from "@/lib/utils";

export async function AppHeader() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center">
          <Logo locale={locale} taglineText={dict.nav.brandTagline} />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Suspense fallback={null}>
            <HeaderAuthNav
              groupsLabel={dict.nav.groupsLabel}
              notificationsLabel={dict.nav.notificationsLabel}
              unreadBadgeLabel={dict.notifications.unreadBadgeLabel}
            />
          </Suspense>
          <HtmlLangSync locale={locale} />
          <LanguageSwitcher locale={locale} />
          <ThemeSwitcher labels={dict.nav.theme} />
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense fallback={<div className="h-9 w-20" />}>
              <AuthButton
                profileLabel={dict.nav.profileLabel}
                logoutLabel={dict.nav.logoutLabel}
                signInLabel={dict.nav.signInLabel}
                signUpLabel={dict.nav.signUpLabel}
              />
            </Suspense>
          )}
        </div>
      </div>
    </header>
  );
}
