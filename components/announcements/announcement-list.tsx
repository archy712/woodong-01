"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, MegaphoneIcon, PencilIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { updateAnnouncementAction } from "@/lib/woodong/actions/announcements";
import {
  updateAnnouncementSchema,
  type Announcement,
  type UpdateAnnouncementInput,
} from "@/lib/woodong/announcements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Labels = Dictionary["groups"]["announcements"];

/**
 * 공지가 작성 후 고쳐졌는지 판별한다.
 *
 * `updated_at`은 트리거가 매 UPDATE마다 갱신하는데, INSERT 시점에도 `created_at`과 같은 값이
 * 들어간다. 두 값을 문자열로 비교하면 마이크로초 단위 차이 때문에 갓 만든 공지도 "수정됨"으로
 * 보일 수 있어, 1초를 넘게 벌어졌을 때만 수정으로 친다.
 */
function isEdited(announcement: Announcement): boolean {
  const created = new Date(announcement.created_at).getTime();
  const updated = new Date(announcement.updated_at).getTime();
  return updated - created > 1000;
}

function EditAnnouncementDialog({
  announcement,
  labels,
  commonLabels,
  open,
  onOpenChange,
}: {
  announcement: Announcement;
  labels: Labels;
  commonLabels: Dictionary["common"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const defaultValues: UpdateAnnouncementInput = {
    announcementId: announcement.id,
    title: announcement.title,
    body: announcement.body,
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: updateAnnouncementSchema,
    defaultValues,
    action: updateAnnouncementAction,
    successMessage: labels.editSuccessToast,
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.editTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.titleLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.contentLabel}</FormLabel>
                  <FormControl>
                    <Textarea rows={8} {...field} />
                  </FormControl>
                  <FormDescription>{labels.editNotifyNotice}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {commonLabels.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {labels.editSubmitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 공지 목록 (Task 025에서 실데이터 연동).
 *
 * 목록은 로컬 state로 들지 않고 서버가 내려준 값을 그대로 그린다(회비 대시보드·멤버 목록과 같은
 * 규약). 수정 후에는 `revalidatePath` + `router.refresh()`로 다시 받아온다.
 * 수정 버튼은 총무에게만 렌더링한다 — 쓰기는 RLS가 막지만, 반드시 실패할 버튼을 보여주지 않는다.
 */
export function AnnouncementList({
  announcements,
  isAdmin,
  labels,
  commonLabels,
  emptyLabel,
}: {
  announcements: Announcement[];
  isAdmin: boolean;
  labels: Labels;
  commonLabels: Dictionary["common"];
  emptyLabel: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (announcements.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MegaphoneIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyLabel}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">
                  {announcement.title}
                </CardTitle>
                <div className="flex shrink-0 items-center gap-2">
                  {isEdited(announcement) && (
                    <Badge variant="outline">{labels.editedBadge}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString(
                      "ko-KR",
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm whitespace-pre-line text-muted-foreground">
                {announcement.body}
              </p>
              {isAdmin && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(announcement.id)}
                  >
                    <PencilIcon />
                    {labels.editButton}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {isAdmin && (
            <EditAnnouncementDialog
              // 다이얼로그를 열 때마다 새로 마운트해 최신 공지 내용으로 폼을 채운다
              // (수정 후 다시 열면 예전 값이 남아 있으면 안 된다).
              key={`${announcement.id}-${announcement.updated_at}`}
              announcement={announcement}
              labels={labels}
              commonLabels={commonLabels}
              open={editingId === announcement.id}
              onOpenChange={(open) =>
                setEditingId(open ? announcement.id : null)
              }
            />
          )}
        </li>
      ))}
    </ul>
  );
}
