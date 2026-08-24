import { Suspense } from "react";
import { AlertTriangleIcon, UsersIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { JoinInviteButton } from "@/components/groups/join-invite-button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  findDummyInviteByCode,
  getDummyActiveMembers,
  isDummyInviteUsable,
} from "@/lib/woodong/dummy";

async function InviteContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [{ code }, locale] = await Promise.all([params, getLocale()]);
  const dict = getDictionary(locale);

  const found = findDummyInviteByCode(code);

  if (!found) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangleIcon />
            </EmptyMedia>
            <EmptyTitle>{dict.errors.invalidInviteCode}</EmptyTitle>
            <EmptyDescription>{code}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const { invite, group } = found;

  if (!isDummyInviteUsable(invite)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangleIcon />
            </EmptyMedia>
            <EmptyTitle>{dict.groups.invitePage.expiredMessage}</EmptyTitle>
            <EmptyDescription>{group.name}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const memberCount = getDummyActiveMembers(group.id).length;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{group.name}</CardTitle>
            {group.type && <Badge variant="secondary">{group.type}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {group.description && (
            <p className="text-sm text-muted-foreground">{group.description}</p>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="size-4" />
            {memberCount}
            {dict.common.memberCountSuffix}
          </span>
          <p className="text-sm text-muted-foreground">
            {dict.groups.invitePage.previewNotice}
          </p>
          <JoinInviteButton
            groupId={group.id}
            label={dict.groups.invitePage.joinButton}
            successToast={dict.groups.invitePage.joinSuccessToast}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <InviteContent params={params} />
    </Suspense>
  );
}
