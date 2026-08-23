import { Suspense } from "react";

import { AvatarGallery } from "@/components/avatars/avatar-gallery";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function AvatarsGalleryPage() {
  return (
    <Suspense fallback={null}>
      <AvatarsGalleryContent />
    </Suspense>
  );
}

async function AvatarsGalleryContent() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-8 px-5 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{dict.avatars.heading}</h1>
        <p className="text-muted-foreground">{dict.avatars.description}</p>
      </div>

      <AvatarGallery />
    </div>
  );
}
