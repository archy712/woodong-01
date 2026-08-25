"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteGroupAction } from "@/lib/woodong/actions/groups";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 모임 삭제 확인 다이얼로그 (Task 019).
 *
 * 삭제는 하드 삭제이고 연관 데이터(회비·투표·공지·알림)가 CASCADE로 함께 사라지므로,
 * 다이얼로그로 한 번 더 확인받은 뒤에만 `deleteGroupAction`을 호출한다.
 * 총무가 아니면 애초에 이 카드가 렌더링되지 않지만, 서버에서도 RLS가 다시 막는다.
 */
export function GroupDangerZone({
  groupId,
  labels,
  commonLabels,
}: {
  groupId: string;
  labels: Dictionary["groups"]["settings"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGroupAction({ groupId });

      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }

      setOpen(false);
      toast.success(labels.deleteSuccessToast);
      router.push("/protected/groups");
      router.refresh();
    });
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-base text-destructive">
          {labels.dangerZoneTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {labels.deleteConfirmMessage}
        </p>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" className="w-fit">
              {labels.deleteButton}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{labels.deleteDialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {labels.deleteConfirmMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{commonLabels.cancel}</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {labels.deleteButton}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
