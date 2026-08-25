import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Supabase Auth 에러를 브랜드 톤 문구로 바꾼다 (Task 018-1).
 *
 * 인증 폼들은 Server Action이 아니라 클라이언트에서 `supabase.auth.*`를 직접 호출하는
 * 예외 패턴이라(`docs/guides/forms-react-hook-form.md`), 지금까지 `error.message`를 그대로
 * 노출해 "Invalid login credentials" 같은 영문 원문이 사용자에게 보였다.
 * 도메인 뮤테이션 쪽 `lib/woodong/errors.ts`의 `mapSupabaseError()`와 같은 역할을 인증 계층에서 한다.
 *
 * 매핑에 없는 에러는 원문을 노출하지 않고 일반 문구로 폴백하되, 디버깅을 위해 콘솔에는 남긴다.
 */
export function mapAuthErrorMessage(
  error: unknown,
  errors: Dictionary["errors"],
): string {
  const code = readErrorCode(error);

  switch (code) {
    case "invalid_credentials":
      return errors.authInvalidCredentials;
    case "user_already_exists":
    case "email_exists":
      return errors.authEmailTaken;
    case "weak_password":
      return errors.authWeakPassword;
    case "same_password":
      return errors.authSamePassword;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return errors.authRateLimit;
    case "identity_already_exists":
      return errors.authIdentityAlreadyLinked;
    case "single_identity_not_deletable":
      return errors.authLastIdentityGuard;
  }

  // GoTrue 응답에 `code`가 없던 시절의 메시지도 폴백으로 받아준다.
  const message = readErrorMessage(error);
  if (message === "User already registered") return errors.authEmailTaken;
  if (message === "Invalid login credentials")
    return errors.authInvalidCredentials;

  if (message) {
    console.error("[auth] unmapped auth error:", code, message);
  }
  return errors.genericError;
}

function readErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code?: unknown };
    if (typeof code === "string") return code;
  }
  return "";
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "";
}
