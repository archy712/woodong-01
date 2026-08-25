import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { GroupDangerZone } from "@/components/groups/group-danger-zone";
import { GroupInviteManager } from "@/components/groups/group-invite-manager";
import { GroupSettingsForm } from "@/components/groups/group-settings-form";
import { AVATAR_EMOJI, DEFAULT_AVATAR_KEY } from "@/lib/woodong/avatars";
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
import { getGroupDetail, listGroupMembers } from "@/lib/woodong/queries/groups";
import { listGroupInvites } from "@/lib/woodong/queries/invites";
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

  const detail = await getGroupDetail(supabase, groupId, data.claims.sub);

  if (!detail) {
    return (
      <div className="flex w-full flex-1 flex-col gap-4 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{dict.groups.settings.title}</h1>
        <p className="text-sm text-muted-foreground">
          {dict.groups.detailNotFound}
        </p>
      </div>
    );
  }

  const { group, role, coverUrl } = detail;
  const isAdmin = role === "admin";
  const members = await listGroupMembers(supabase, groupId, data.claims.sub);
  // 초대 목록의 SELECT 정책은 총무 전용이라 일반회원은 어차피 빈 배열을 받는다. 불필요한
  // 왕복을 아끼려고 총무일 때만 조회한다.
  const invites = isAdmin ? await listGroupInvites(supabase, groupId) : [];

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
          {isAdmin ? (
            <GroupSettingsForm
              groupId={groupId}
              defaultValues={{
                groupId,
                name: group.name,
                description: group.description ?? "",
                type: group.type ?? "",
                defaultDueAmount: group.default_due_amount ?? undefined,
              }}
              coverUrl={coverUrl}
              labels={dict.groups.settings}
              createLabels={dict.groups.create}
              commonLabels={dict.common}
            />
          ) : (
            // 쓰기는 RLS가 막지만, 총무가 아닌 사람에게 수정 폼을 보여주면 실패할 조작을
            // 유도하게 되므로 UI에서도 먼저 막는다(이중 방어).
            <p className="text-sm text-muted-foreground">
              {dict.groups.settings.adminOnlyNotice}
            </p>
          )}
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
            <>
              <ItemGroup className="gap-1">
                {members.map((member) => (
                  <Item key={member.id} size="sm">
                    <ItemMedia variant="image">
                      <Avatar>
                        <AvatarFallback>
                          {AVATAR_EMOJI[DEFAULT_AVATAR_KEY]}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        {member.isMe
                          ? dict.groups.members.meLabel
                          : dict.groups.members.unnamedMemberLabel}
                      </ItemTitle>
                    </ItemContent>
                    <Badge
                      variant={
                        member.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {member.role === "admin"
                        ? dict.groups.members.roleAdmin
                        : dict.groups.members.roleMember}
                    </Badge>
                  </Item>
                ))}
              </ItemGroup>
              {/* 이름/연락처는 공유 profiles의 SELECT 정책이 "본인 행" 한정이라 아직 못 읽는다.
                  우동 전용 SECURITY DEFINER RPC로 채우는 것은 Task 021 몫이다. */}
              <p className="mt-3 text-xs text-muted-foreground">
                {dict.groups.members.namesComingSoonNotice}
              </p>
            </>
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
          {isAdmin ? (
            <GroupInviteManager
              groupId={groupId}
              invites={invites}
              labels={dict.groups.invite}
              commonLabels={dict.common}
            />
          ) : (
            // 초대 발급/조회/무효화 정책이 전부 `woodong_is_group_admin()`이라 일반회원에게는
            // 빈 목록과 반드시 실패하는 버튼만 보인다. 정보 수정 카드와 같이 안내로 대체한다.
            <p className="text-sm text-muted-foreground">
              {dict.groups.invite.adminOnlyNotice}
            </p>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <GroupDangerZone
          groupId={groupId}
          labels={dict.groups.settings}
          commonLabels={dict.common}
        />
      )}
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
