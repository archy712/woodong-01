"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GavelIcon, Loader2Icon } from "lucide-react";
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
import { closeVoteNowAction } from "@/lib/woodong/actions/votes";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 총무의 "지금 마감" 버튼 (Task 030).
 *
 * 마감은 되돌릴 수 없고(다시 열 수 있는 경로가 없다) 모임 전원에게 결과 알림이 나가므로,
 * 다이얼로그로 한 번 더 확인받은 뒤에만 실행한다(모임 삭제와 같은 규약).
 *
 * 총무가 아니면 애초에 이 버튼이 렌더링되지 않지만, 최종 판정은 RPC 안의
 * `woodong_is_group_admin()`이 다시 한다.
 */
export function CloseVoteButton({
  voteId,
  groupId,
  labels,
  commonLabels,
}: {
  voteId: string;
  groupId: string;
  labels: Dictionary["votes"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    startTransition(async () => {
      const result = await closeVoteNowAction({
        voteId,
        groupId,
        notificationTitle: labels.closeNotificationTitle,
        notificationBody: labels.closeNotificationBody,
      });

      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }

      setOpen(false);

      // 이미 닫혀 있었다면(마감 시각이 지나 lazy로 닫혔거나 다른 총무가 먼저 눌렀거나)
      // 실패가 아니다 — 원하던 상태에 이미 도달해 있는 것이라 그대로 알려 준다.
      if (result.data.alreadyClosed) {
        toast.info(labels.closeNowAlreadyClosedToast);
      } else {
        toast.success(
          result.data.notifiedCount > 0
            ? `${labels.closeNowSuccessToast} ${result.data.notifiedCount}${labels.closeNotifiedCountSuffix}`
            : labels.closeNowSuccessToast,
        );
      }

      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-fit">
          <GavelIcon />
          {labels.closeNowButton}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.closeNowDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.closeNowConfirmMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {commonLabels.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              // 기본 동작은 다이얼로그를 곧바로 닫는다. 서버 응답을 받고 토스트를 띄울
              // 때까지는 열어 두고, 진행 중임을 버튼에서 보여준다.
              event.preventDefault();
              handleClose();
            }}
            disabled={isPending}
          >
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {labels.closeNowButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
