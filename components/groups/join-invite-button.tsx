"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * 초대 참여 버튼. 실제 `woodong_redeem_group_invite()` RPC 호출은 Task 020 몫이라,
 * 이번 Task에서는 데모 안내 토스트 후 모임 상세로 이동시켜 참여 흐름만 보여준다.
 * 비로그인 상태라면 `proxy.ts`가 `/protected/groups/[groupId]`를 감지해 로그인으로 보낸다
 * (실제 인증 게이트가 그대로 동작하는 것을 함께 보여주는 의도적인 설계).
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
