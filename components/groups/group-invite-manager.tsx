"use client";

import { useState } from "react";
import { CopyIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  issueGroupInviteSchema,
  type GroupInvite,
  type IssueGroupInviteInput,
} from "@/lib/woodong/groups";
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

const demoIssueInviteAction = createDemoAction<
  IssueGroupInviteInput,
  GroupInvite
>((input) => ({
  id: crypto.randomUUID(),
  group_id: input.groupId,
  code: `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  created_by: null,
  expires_at: input.expiresAt,
  max_uses: input.maxUses,
  used_count: 0,
  is_active: true,
  revoked_at: null,
}));

function IssueInviteDialog({
  groupId,
  labels,
  onIssued,
}: {
  groupId: string;
  labels: Dictionary["groups"]["invite"];
  onIssued: (invite: GroupInvite) => void;
}) {
  const [open, setOpen] = useState(false);

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: issueGroupInviteSchema,
    defaultValues: { groupId, expiresAt: "", maxUses: 20 },
    action: demoIssueInviteAction,
    successMessage: labels.issueSuccessToast,
    onSuccess: (invite) => {
      onIssued(invite);
      setOpen(false);
      form.reset({ groupId, expiresAt: "", maxUses: 20 });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <PlusIcon />
          {labels.generateButton}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
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
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {labels.generateButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function GroupInviteManager({
  groupId,
  initialInvites,
  labels,
  commonLabels,
}: {
  groupId: string;
  initialInvites: GroupInvite[];
  labels: Dictionary["groups"]["invite"];
  commonLabels: Dictionary["common"];
}) {
  const [invites, setInvites] = useState(initialInvites);

  function handleCopy(code: string) {
    const url = `${window.location.origin}/invite/${code}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    toast.success(commonLabels.copied);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{labels.title}</p>
        <IssueInviteDialog
          groupId={groupId}
          labels={labels}
          onIssued={(invite) => setInvites((prev) => [invite, ...prev])}
        />
      </div>

      {invites.length > 0 ? (
        <ItemGroup className="gap-2">
          {invites.map((invite) => (
            <Item key={invite.id} variant="outline" size="sm">
              <ItemContent>
                <ItemTitle className="font-mono">
                  {invite.code}
                  {invite.is_active ? (
                    <Badge variant="secondary">{labels.activeLabel}</Badge>
                  ) : (
                    <Badge variant="outline">{labels.inactiveLabel}</Badge>
                  )}
                </ItemTitle>
                <ItemDescription>
                  {labels.expiresAtLabel}:{" "}
                  {invite.expires_at
                    ? new Date(invite.expires_at).toLocaleDateString("ko-KR")
                    : "-"}{" "}
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
                >
                  <CopyIcon />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      ) : (
        <p className="text-sm text-muted-foreground">{labels.emptyState}</p>
      )}
    </div>
  );
}
