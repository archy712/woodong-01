"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/** 이메일 미제공 안내는 후속 행동(계정 연동)을 유도하므로 기본값보다 길게 노출한다. */
const NO_EMAIL_TOAST_DURATION_MS = 10_000;

/**
 * OAuth 콜백(`app/auth/callback/route.ts`)이 붙여 준 쿼리 파라미터를 읽어
 * 계정 자동 연결 / 이메일 미제공 안내를 1회 노출하고 URL을 정리한다.
 */
export function OAuthResultToast({
  linkedMessage,
  noEmailMessage,
  manualLinkCta,
}: {
  linkedMessage: string;
  noEmailMessage: string;
  manualLinkCta: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const hasNotified = useRef(false);

  const linked = searchParams.get("linked");
  const noEmail = searchParams.get("no_email");

  useEffect(() => {
    if (!linked && !noEmail) return;
    if (hasNotified.current) return;
    hasNotified.current = true;

    if (linked) {
      // 어떤 계정에 붙었는지 알려야 하므로 이메일을 세션에서 직접 읽는다
      // (URL로 실어 나르면 주소창/로그에 그대로 남는다).
      void (async () => {
        // Supabase 브라우저 클라이언트는 **여기서만** 쓰는데, 이 컴포넌트는 루트 레이아웃에
        // 있어서 모듈 최상단에서 import하면 랜딩을 포함한 **모든 페이지**가 클라이언트
        // 번들(초기 청크의 64 KiB 중 61 KiB가 미사용)을 내려받는다(Task 031에서 확인).
        // 실제로 필요한 경로는 OAuth 콜백 직후 `?linked=...`가 붙은 1회뿐이라 그때만 받는다.
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        toast.success(linkedMessage, {
          description: data?.claims?.email,
        });
      })();
    }

    if (noEmail) {
      toast.info(noEmailMessage, {
        duration: NO_EMAIL_TOAST_DURATION_MS,
        action: {
          label: manualLinkCta,
          onClick: () => router.push("/protected/me"),
        },
      });
    }

    // 새로고침/뒤로가기로 안내가 다시 뜨지 않도록 히스토리를 남기지 않고 파라미터만 제거한다.
    const params = new URLSearchParams(searchParams);
    params.delete("linked");
    params.delete("no_email");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [
    linked,
    noEmail,
    linkedMessage,
    noEmailMessage,
    manualLinkCta,
    pathname,
    router,
    searchParams,
  ]);

  return null;
}
