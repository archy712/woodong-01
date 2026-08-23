import { Suspense } from "react";

import { ChartGallery } from "@/components/charts/chart-gallery";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function ChartsGalleryPage() {
  return (
    <Suspense fallback={null}>
      <ChartsGalleryContent />
    </Suspense>
  );
}

async function ChartsGalleryContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-8 px-5 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{dict.charts.heading}</h1>
        <p className="text-muted-foreground">{dict.charts.description}</p>
      </div>

      <ChartGallery />
    </div>
  );
}
