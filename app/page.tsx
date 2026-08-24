import {
  BellIcon,
  CalendarCheckIcon,
  MegaphoneIcon,
  PiggyBankIcon,
  ReceiptTextIcon,
  UsersRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

const FEATURE_ICONS = [
  UsersRoundIcon,
  PiggyBankIcon,
  ReceiptTextIcon,
  CalendarCheckIcon,
  MegaphoneIcon,
  BellIcon,
];

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const features = dict.home.features.items.map((item, i) => ({
    ...item,
    icon: FEATURE_ICONS[i],
  }));

  return (
    <div className="flex w-full max-w-5xl flex-col gap-20 px-5 py-16">
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="inline-flex flex-wrap items-baseline justify-center gap-x-1 font-semibold text-brand-coral">
          {locale === "ko" ? (
            <>
              <span className="text-3xl lg:text-4xl">우</span>
              <span className="text-base">리</span>
              <span className="text-3xl lg:text-4xl">동</span>
              <span className="text-base">호회 운영 플랫폼</span>
            </>
          ) : (
            <span className="text-xs">{dict.home.hero.kicker}</span>
          )}
        </span>
        <h1 className="text-3xl !leading-tight font-bold whitespace-pre-line lg:text-4xl">
          {dict.home.hero.title}
        </h1>
        <p className="whitespace-pre-line text-muted-foreground lg:text-lg">
          {dict.home.hero.subtitle}
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/auth/sign-up">{dict.home.hero.cta}</Link>
        </Button>
      </section>

      <section className="flex flex-col gap-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-bold lg:text-3xl">
            {dict.home.features.heading}
          </h2>
          <p className="text-muted-foreground">
            {dict.home.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border p-6"
            >
              <feature.icon className="size-6" strokeWidth={1.75} />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
