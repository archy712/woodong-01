"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { redeemGroupInviteAction } from "@/lib/woodong/actions/invites";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 초대 참여 버튼 (Task 020).
 *
 * `woodong_redeem_group_invite()` RPC를 감싼 `redeemGroupInviteAction`을 호출한다.
 * 비로그인 사용자에게는 이 버튼 대신 초대 화면으로 복귀하는 로그인 링크가 렌더링되므로
 * (`app/invite/[code]/page.tsx`, Task 017), 여기서는 로그인 상태를 전제한다.
 *
 * 참여 대상 모임 id를 prop으로 받지 않고 **코드만** 넘기는 것이 중요하다. 모임 id를 클라이언트가
 * 정하면 "코드는 A 모임 것인데 B 모임으로 가입" 같은 위조가 가능해진다. 어느 모임인지는 서버가
 * 코드로부터 결정하고, 이동할 경로도 액션이 돌려준 `groupId`를 쓴다.
 */
export function JoinInviteButton({
  code,
  labels,
  errorLabels,
}: {
  code: string;
  labels: Dictionary["groups"]["invitePage"];
  errorLabels: Dictionary["errors"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    startTransition(async () => {
      const result = await redeemGroupInviteAction({ code });

      if (!result.success) {
        toast.error(result.formError ?? errorLabels.invalidInviteCode);
        // 만료·무효화·소진은 화면에 떠 있는 미리보기 정보와 달라진 상태이므로 다시 읽어 온다.
        router.refresh();
        return;
      }

      toast.success(
        result.data.status === "already_member"
          ? labels.alreadyMemberMessage
          : labels.joinSuccessToast,
      );
      router.push(`/protected/groups/${result.data.groupId}`);
    });
  }

  return (
    <Button type="button" onClick={handleJoin} disabled={isPending}>
      {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
      {labels.joinButton}
    </Button>
  );
}
