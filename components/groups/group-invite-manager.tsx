"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CopyIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import {
  issueGroupInviteAction,
  revokeGroupInviteAction,
} from "@/lib/woodong/actions/invites";
import { issueGroupInviteSchema, type GroupInvite } from "@/lib/woodong/groups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const DEFAULT_MAX_USES = 20;
const DEFAULT_EXPIRY_DAYS = 7;

/**
 * `<input type="datetime-local">`이 받는 `YYYY-MM-DDTHH:mm`(타임존 없는 로컬 시각) 문자열.
 *
 * ⚠️ 렌더 중에 호출하면 안 된다. Client Component도 SSR되므로 서버와 클라이언트가 서로 다른
 * 시각을 계산해 hydration 불일치가 난다. 다이얼로그를 **열 때**(사용자 상호작용 이후)만 부른다.
 */
function defaultExpiresAtValue(): string {
  const date = new Date(Date.now() + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** 목록에서 이 초대가 지금 실제로 쓸 수 있는 상태인지(PRD 5.4 참여 가능 조건과 동일). */
function isInviteUsable(invite: GroupInvite): boolean {
  if (!invite.is_active || invite.revoked_at) return false;
  if (!invite.expires_at || new Date(invite.expires_at).getTime() <= Date.now())
    return false;
  if (invite.max_uses !== null && invite.used_count >= invite.max_uses)
    return false;
  return true;
}

function IssueInviteDialog({
  groupId,
  labels,
  hasUsableInvite,
  onIssued,
}: {
  groupId: string;
  labels: Dictionary["groups"]["invite"];
  hasUsableInvite: boolean;
  onIssued: () => void;
}) {
  const [open, setOpen] = useState(false);

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: issueGroupInviteSchema,
    defaultValues: { groupId, expiresAt: "", maxUses: DEFAULT_MAX_USES },
    action: issueGroupInviteAction,
    successMessage: labels.issueSuccessToast,
    onSuccess: () => {
      setOpen(false);
      onIssued();
    },
  });

  function handleOpenChange(next: boolean) {
    // 만료 일시 기본값(7일 뒤)은 다이얼로그를 열 때 채운다 — 렌더 중 `new Date()`는 hydration 불일치.
    if (next) {
      form.reset({
        groupId,
        expiresAt: defaultExpiresAtValue(),
        maxUses: DEFAULT_MAX_USES,
      });
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <PlusIcon />
          {hasUsableInvite ? labels.reissueButton : labels.generateButton}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasUsableInvite ? labels.reissueButton : labels.generateButton}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.expiresAtLabel}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.maxUsesLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              {labels.reissueNotice}
            </p>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {hasUsableInvite ? labels.reissueButton : labels.generateButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function RevokeInviteButton({
  groupId,
  inviteId,
  labels,
  commonLabels,
  onRevoked,
}: {
  groupId: string;
  inviteId: string;
  labels: Dictionary["groups"]["invite"];
  commonLabels: Dictionary["common"];
  onRevoked: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRevoke() {
    startTransition(async () => {
      const result = await revokeGroupInviteAction({ groupId, inviteId });

      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }

      toast.success(labels.revokeSuccessToast);
      onRevoked();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={labels.revokeButton}
          disabled={isPending}
        >
          {isPending ? <Loader2Icon className="animate-spin" /> : <XIcon />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.revokeDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.revokeConfirmMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{commonLabels.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevoke}>
            {labels.revokeButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * 초대 링크 발급·복사·무효화 (Task 020).
 *
 * 목록은 로컬 state로 들고 있지 않고 **서버가 내려준 `invites`를 그대로** 그린다. 뮤테이션 뒤에는
 * Server Action의 `revalidatePath` + `router.refresh()`로 서버 데이터를 다시 받아오므로,
 * 낙관적으로 끼워 넣은 행과 실제 DB 상태가 어긋날 일이 없다(특히 "새 링크 발급 → 기존 링크 자동
 * 무효화"처럼 한 번의 액션이 다른 행까지 바꾸는 경우 로컬 state로는 정확히 반영하기 어렵다).
 *
 * 이 컴포넌트는 **총무에게만** 렌더링된다(호출부에서 분기). 초대 SELECT/INSERT/UPDATE 정책이
 * 전부 `woodong_is_group_admin()`이라 일반회원에게 보여줘도 빈 목록 + 실패하는 버튼일 뿐이다.
 */
export function GroupInviteManager({
  groupId,
  invites,
  labels,
  commonLabels,
}: {
  groupId: string;
  invites: GroupInvite[];
  labels: Dictionary["groups"]["invite"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();
  const hasUsableInvite = invites.some(isInviteUsable);

  function handleCopy(code: string) {
    const url = `${window.location.origin}/invite/${code}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    toast.success(commonLabels.copied);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{labels.reissueNotice}</p>
        <IssueInviteDialog
          groupId={groupId}
          labels={labels}
          hasUsableInvite={hasUsableInvite}
          onIssued={() => router.refresh()}
        />
      </div>

      {invites.length > 0 ? (
        <ItemGroup className="gap-2">
          {invites.map((invite) => {
            const usable = isInviteUsable(invite);
            return (
              <Item key={invite.id} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle className="font-mono">
                    {invite.code}
                    {usable ? (
                      <Badge variant="secondary">{labels.activeLabel}</Badge>
                    ) : (
                      <Badge variant="outline">{labels.inactiveLabel}</Badge>
                    )}
                  </ItemTitle>
                  <ItemDescription>
                    {labels.createdAtLabel}: {formatDateTime(invite.created_at)}
                    <br />
                    {labels.expiresAtLabel}: {formatDateTime(invite.expires_at)}{" "}
                    · {invite.used_count}/{invite.max_uses ?? "∞"}{" "}
                    {labels.usedCountLabel}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={labels.copyLinkButton}
                    onClick={() => handleCopy(invite.code)}
                    disabled={!usable}
                  >
                    <CopyIcon />
                  </Button>
                  {usable && (
                    <RevokeInviteButton
                      groupId={groupId}
                      inviteId={invite.id}
                      labels={labels}
                      commonLabels={commonLabels}
                      onRevoked={() => router.refresh()}
                    />
                  )}
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.emptyState}</p>
      )}
    </div>
  );
}
