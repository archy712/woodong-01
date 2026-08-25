"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2Icon,
  ShieldCheckIcon,
  ShieldOffIcon,
  UserMinusIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  removeGroupMemberAction,
  updateMemberRoleAction,
} from "@/lib/woodong/actions/members";
import {
  memberAvatarEmoji,
  memberDisplayName,
} from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type MemberLabels = Dictionary["groups"]["members"];
type CommonLabels = Dictionary["common"];

/** 확인 다이얼로그가 필요한 조작 3종. `null`이면 다이얼로그가 닫힌 상태. */
type PendingAction = {
  kind: "promote" | "demote" | "remove" | "leave";
  member: GroupMemberRow;
} | null;

/** 회비 대시보드(Task 022)와 표시 규칙을 공유하려고 `lib/woodong/member-display.ts`로 옮겼다. */
function displayName(member: GroupMemberRow, labels: MemberLabels): string {
  return memberDisplayName(member, labels.unnamedMemberLabel);
}

/**
 * 모임 멤버 목록 + 역할 관리 (Task 021).
 *
 * 마지막 총무 보호는 세 겹이다: DB 트리거(Task 003) → Server Action의 에러 매핑 →
 * 이 컴포넌트의 버튼 비활성화. UI 판정(`isLastAdmin`)은 어디까지나 "실패할 조작을 유도하지 않기"
 * 위한 것이고, 두 총무가 동시에 서로를 강등하는 경합 같은 건 트리거만이 정확히 막을 수 있다.
 *
 * 목록은 로컬 state로 들고 있지 않고 서버가 내려준 `members`를 그대로 그린다. 뮤테이션 뒤에는
 * Server Action의 `revalidatePath` + `router.refresh()`로 다시 받아온다(초대 관리자와 같은 규약).
 */
export function GroupMemberList({
  groupId,
  members,
  isAdmin,
  labels,
  commonLabels,
}: {
  groupId: string;
  members: GroupMemberRow[];
  isAdmin: boolean;
  labels: MemberLabels;
  commonLabels: CommonLabels;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingAction>(null);
  const [isSubmitting, startTransition] = useTransition();

  const adminCount = members.filter((member) => member.role === "admin").length;

  function isLastAdmin(member: GroupMemberRow): boolean {
    return member.role === "admin" && adminCount <= 1;
  }

  function runAction(action: NonNullable<PendingAction>) {
    startTransition(async () => {
      const { kind, member } = action;

      const result =
        kind === "promote" || kind === "demote"
          ? await updateMemberRoleAction({
              groupId,
              memberId: member.id,
              role: kind === "promote" ? "admin" : "member",
            })
          : await removeGroupMemberAction({ groupId, memberId: member.id });

      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        setPending(null);
        return;
      }

      setPending(null);

      if (kind === "leave") {
        toast.success(labels.leaveSuccessToast);
        // 방금 멤버가 아니게 됐으므로 이 페이지에 머무르면 "접근 권한이 없어요"만 보게 된다.
        router.push("/protected/groups");
        return;
      }

      toast.success(
        kind === "remove"
          ? labels.removeSuccessToast
          : labels.roleChangeSuccessToast,
      );
      router.refresh();
    });
  }

  const dialogText: Record<
    NonNullable<PendingAction>["kind"],
    { title: string; description: string; action: string }
  > = {
    promote: {
      title: labels.promoteDialogTitle,
      description: labels.promoteConfirmMessage,
      action: labels.promoteButton,
    },
    demote: {
      title: labels.demoteDialogTitle,
      description: labels.demoteConfirmMessage,
      action: labels.demoteButton,
    },
    remove: {
      title: labels.removeDialogTitle,
      description: labels.removeConfirmMessage,
      action: labels.removeButton,
    },
    leave: {
      title: labels.leaveDialogTitle,
      description: labels.leaveConfirmMessage,
      action: labels.leaveButton,
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <ItemGroup className="gap-1">
        {members.map((member) => {
          const lastAdmin = isLastAdmin(member);
          const roleActionKind = member.role === "admin" ? "demote" : "promote";
          const removeActionKind = member.isMe ? "leave" : "remove";

          return (
            <Item key={member.id} size="sm">
              <ItemMedia variant="image">
                <Avatar>
                  <AvatarFallback>
                    {memberAvatarEmoji(member.avatarKey)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {displayName(member, labels)}
                  {member.isMe && (
                    <Badge variant="outline">{labels.meLabel}</Badge>
                  )}
                </ItemTitle>
                {member.phoneNumber && (
                  <ItemDescription>
                    {labels.phoneLabel}: {member.phoneNumber}
                  </ItemDescription>
                )}
              </ItemContent>
              <Badge
                variant={member.role === "admin" ? "default" : "secondary"}
              >
                {member.role === "admin" ? labels.roleAdmin : labels.roleMember}
              </Badge>
              {isAdmin && (
                <ItemActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                      roleActionKind === "demote"
                        ? labels.demoteButton
                        : labels.promoteButton
                    }
                    // 마지막 총무의 강등은 트리거가 어차피 막는다. 여기서 미리 잠가
                    // 실패할 게 확실한 조작을 유도하지 않는다.
                    disabled={lastAdmin || isSubmitting}
                    onClick={() => setPending({ kind: roleActionKind, member })}
                  >
                    {roleActionKind === "demote" ? (
                      <ShieldOffIcon />
                    ) : (
                      <ShieldCheckIcon />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={
                      removeActionKind === "leave"
                        ? labels.leaveButton
                        : labels.removeButton
                    }
                    disabled={lastAdmin || isSubmitting}
                    onClick={() =>
                      setPending({ kind: removeActionKind, member })
                    }
                  >
                    <UserMinusIcon />
                  </Button>
                </ItemActions>
              )}
            </Item>
          );
        })}
      </ItemGroup>

      {isAdmin && adminCount <= 1 && (
        <p className="text-xs text-muted-foreground">
          {labels.lastAdminNotice}
        </p>
      )}
      {!isAdmin && (
        <p className="text-xs text-muted-foreground">
          {labels.memberViewNotice}
        </p>
      )}

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending ? dialogText[pending.kind].title : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? dialogText[pending.kind].description : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              {commonLabels.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(event) => {
                // 기본 동작은 다이얼로그를 즉시 닫는 것이라, 서버 응답 전에 사라져
                // 진행 상태를 보여줄 수 없다. 닫기는 액션 완료 후 직접 한다.
                event.preventDefault();
                if (pending) runAction(pending);
              }}
            >
              {isSubmitting && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {pending ? dialogText[pending.kind].action : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
