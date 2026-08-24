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
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 모임 삭제 확인 다이얼로그.
 *
 * 실제 삭제 Server Action은 Task 019 몫이라, 확인 후에는 데모 안내 토스트만 띄우고
 * 목록 페이지로 이동시켜 "삭제된 것처럼" 흐름을 보여준다(실제 더미 데이터는 변경되지 않는다).
 */
export function GroupDangerZone({
  labels,
  commonLabels,
}: {
  labels: Dictionary["groups"]["settings"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleDelete() {
    startTransition(() => {
      setOpen(false);
      toast.success(labels.deleteSuccessToast);
      router.push("/protected/groups");
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
