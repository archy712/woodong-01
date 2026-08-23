import { Suspense } from "react";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

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

  return (
    <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <h1 className="text-3xl font-bold lg:text-4xl">{dict.home.heading}</h1>
    </div>
  );
}
