"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useState } from "react";

type SocialProvider = "google" | "kakao";

// scope는 지정하지 않는다. Supabase Auth는 `options.scopes`를 provider 기본 scope와
// **병합**할 뿐 교체하지 않아서, Kakao 기본값에 들어 있는 `account_email`을 이쪽에서 뺄 수 없다
// (지정하면 중복 scope만 생김). 우동은 비즈 앱 미등록을 전제로 "이메일 없는 Kakao 계정"을
// 기본 경로로 확정했으므로(docs/ops/SUPABASE_SHARED_PROJECT.md §3), 이메일 미수신은
// Supabase provider의 "Allow users without an email"과 콜백의 no_email 안내로 처리한다.

export function SocialAuthButtons({
  auth,
  genericError,
  next,
}: {
  auth: Dictionary["auth"];
  genericError: string;
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
      setError(error.message || genericError);
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
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09C3.27 21.3 7.31 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.31 14.33c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.68H1.3A11.98 11.98 0 0 0 0 12.05c0 1.94.46 3.77 1.3 5.37l4.01-3.09z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.68l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
            fill="#EA4335"
          />
        </svg>
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
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            d="M12 3C6.99 3 3 6.2 3 10.14c0 2.5 1.68 4.7 4.21 5.96l-.86 3.16c-.08.28.23.5.47.34l3.79-2.5c.45.05.92.08 1.39.08 5.01 0 9-3.2 9-7.14S17.01 3 12 3z"
            fill="#191600"
          />
        </svg>
        {pendingProvider === "kakao"
          ? auth.socialConnecting
          : auth.loginWithKakao}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
