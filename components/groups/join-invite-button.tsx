"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * 초대 참여 버튼. 실제 `woodong_redeem_group_invite()` RPC 호출은 Task 020 몫이라,
 * 이번 Task에서는 데모 안내 토스트 후 모임 상세로 이동시켜 참여 흐름만 보여준다.
 * 비로그인 사용자에게는 이 버튼 대신 초대 화면으로 복귀하는 로그인 링크가 렌더링되므로
 * (`app/invite/[code]/page.tsx`, Task 017), 여기서는 로그인 상태를 전제한다.
 */
export function JoinInviteButton({
  groupId,
  label,
  successToast,
}: {
  groupId: string;
  label: string;
  successToast: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      toast.success(successToast);
      router.push(`/protected/groups/${groupId}`);
    });
  }

  return (
    <Button type="button" onClick={handleJoin} disabled={isPending}>
      {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}
