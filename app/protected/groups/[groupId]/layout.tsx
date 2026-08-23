import { Suspense } from "react";

import { GroupNavTabs } from "@/components/groups/group-nav-tabs";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <Suspense fallback={<div className="h-12 w-full border-b" />}>
        <GroupNavTabsContent params={params} />
      </Suspense>
      {children}
    </div>
  );
}

async function GroupNavTabsContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return <GroupNavTabs groupId={groupId} labels={dict.nav.groupTabs} />;
}
