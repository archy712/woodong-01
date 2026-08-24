import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MegaphoneIcon, PlusIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDummyAnnouncements } from "@/lib/woodong/dummy";

async function AnnouncementsContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { groupId } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const announcements = getDummyAnnouncements(groupId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          {dict.groups.announcements.pageTitle}
        </h1>
        <Button asChild size="sm">
          <Link href={`/protected/groups/${groupId}/announcements/new`}>
            <PlusIcon />
            {dict.groups.announcements.writeButton}
          </Link>
        </Button>
      </div>

      {announcements.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {announcements.map((a) => (
            <li key={a.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {a.body}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MegaphoneIcon />
            </EmptyMedia>
            <EmptyTitle>{dict.emptyStates.noAnnouncements}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

export default function AnnouncementsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <AnnouncementsContent params={params} />
    </Suspense>
  );
}
