import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { GroupDangerZone } from "@/components/groups/group-danger-zone";
import { GroupInviteManager } from "@/components/groups/group-invite-manager";
import { GroupSettingsForm } from "@/components/groups/group-settings-form";
import { AVATAR_EMOJI } from "@/lib/woodong/avatars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  getDummyActiveMembers,
  getDummyGroup,
  getDummyGroupInvites,
} from "@/lib/woodong/dummy";
import { UsersIcon } from "lucide-react";

async function GroupSettingsContent({
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

  const group = getDummyGroup(groupId);

  if (!group) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.groups.settings.title}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  const members = getDummyActiveMembers(groupId);
  const invites = getDummyGroupInvites(groupId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <h1 className="text-2xl font-bold">{dict.groups.settings.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.groups.settings.infoSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GroupSettingsForm
            groupId={groupId}
            defaultValues={{
              name: group.name,
              description: group.description ?? "",
              type: group.type ?? "",
              defaultDueAmount: group.default_due_amount ?? undefined,
            }}
            labels={dict.groups.settings}
            createLabels={dict.groups.create}
            commonLabels={dict.common}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.groups.settings.membersSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <ItemGroup className="gap-1">
              {members.map((member) => (
                <Item key={member.id} size="sm">
                  <ItemMedia variant="image">
                    <Avatar>
                      <AvatarFallback>
                        {AVATAR_EMOJI[member.profile.avatarKey]}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{member.profile.name}</ItemTitle>
                  </ItemContent>
                  <Badge
                    variant={member.role === "admin" ? "default" : "secondary"}
                  >
                    {member.role === "admin"
                      ? dict.groups.members.roleAdmin
                      : dict.groups.members.roleMember}
                  </Badge>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UsersIcon />
                </EmptyMedia>
                <EmptyTitle>{dict.emptyStates.noMembers}</EmptyTitle>
                <EmptyDescription>
                  {dict.groups.settings.membersSectionTitle}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {dict.groups.settings.inviteSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GroupInviteManager
            groupId={groupId}
            initialInvites={invites}
            labels={dict.groups.invite}
            commonLabels={dict.common}
          />
        </CardContent>
      </Card>

      <GroupDangerZone
        labels={dict.groups.settings}
        commonLabels={dict.common}
      />
    </div>
  );
}

export default function GroupSettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <GroupSettingsContent params={params} />
    </Suspense>
  );
}
