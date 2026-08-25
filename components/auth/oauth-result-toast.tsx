"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

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
