"use client";

import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, KakaoIcon } from "@/components/auth/provider-icons";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { mapAuthErrorMessage } from "@/lib/auth/auth-error-message";
import { useState } from "react";

type SocialProvider = "google" | "kakao";

// scope는 지정하지 않는다. Supabase Auth는 `options.scopes`를 provider 기본 scope와
// **병합**할 뿐 교체하지 않아서, Kakao 기본값에 들어 있는 `account_email`을 이쪽에서 뺄 수 없다
// (지정하면 중복 scope만 생김). 우동은 비즈 앱 미등록을 전제로 "이메일 없는 Kakao 계정"을
// 기본 경로로 확정했으므로(docs/ops/SUPABASE_SHARED_PROJECT.md §3), 이메일 미수신은
// Supabase provider의 "Allow users without an email"과 콜백의 no_email 안내로 처리한다.

export function SocialAuthButtons({
  auth,
  errors,
  next,
}: {
  auth: Dictionary["auth"];
  errors: Dictionary["errors"];
  /** 소셜 로그인 성공 후 복귀할 내부 경로. 콜백 라우트에서 다시 검증한다(Task 017). */
  next: string;
}) {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: SocialProvider) => {
    const supabase = createClient();
    setPendingProvider(provider);
    setError(null);

    // 복귀 경로는 provider를 왕복해야 하므로 콜백 URL의 쿼리에 실어 보낸다.
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError(mapAuthErrorMessage(error, errors));
      setPendingProvider(null);
    }
    // 성공하면 브라우저가 provider 인가 화면으로 이동하므로 추가 상태 갱신이 필요 없다.
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn("google")}
        disabled={pendingProvider !== null}
      >
        <GoogleIcon />
        {pendingProvider === "google"
          ? auth.socialConnecting
          : auth.loginWithGoogle}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full border-[#FEE500] bg-[#FEE500] text-[#191600] hover:bg-[#F2DA00] hover:text-[#191600]"
        onClick={() => handleSignIn("kakao")}
        disabled={pendingProvider !== null}
      >
        <KakaoIcon />
        {pendingProvider === "kakao"
          ? auth.socialConnecting
          : auth.loginWithKakao}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
