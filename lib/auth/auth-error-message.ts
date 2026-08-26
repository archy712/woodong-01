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
  // 네트워크가 끊겼거나 GoTrue에 닿지 못한 경우가 먼저다. 이때 오는 것은 GoTrue의 에러가
  // 아니라 `TypeError: Failed to fetch`(또는 supabase-js가 감싼 `AuthRetryableFetchError`)라
  // 아래 코드 매핑에 하나도 걸리지 않고 "일시적인 오류"로 폴백됐다 — 틀린 말은 아니지만,
  // 정작 사용자가 할 수 있는 일(연결 확인)을 알려주지 못한다. 사전에 `networkError` 문구가
  // 4개 언어로 이미 있는데 쓰이는 곳이 없었다(Task 033).
  if (isNetworkError(error)) {
    return errors.networkError;
  }

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
    // "Require current password when updating"(대시보드 토글)이 켜진 뒤 서버가 새로 내려주는
    // 두 코드. 앱은 변경 전에 클라이언트에서 먼저 재인증하므로 보통은 여기까지 오지 않지만,
    // 매핑이 없으면 "일시적인 오류"라는 엉뚱한 안내가 나간다.
    case "current_password_required":
    case "current_password_invalid":
      return errors.authCurrentPasswordInvalid;
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

/**
 * 서버까지 닿지도 못한 실패인지 판별한다.
 *
 * `navigator.onLine`은 "랜선은 꽂혀 있지만 인터넷은 안 되는" 상태를 잡지 못하므로 단독으로
 * 쓰지 않고, 실제로 던져진 에러 모양을 함께 본다.
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && /fetch/i.test(error.message)) return true;

  // supabase-js는 재시도 가능한 네트워크 실패를 이 이름으로 감싸서 올려준다.
  if (error instanceof Error && error.name === "AuthRetryableFetchError") {
    return true;
  }

  return typeof navigator !== "undefined" && navigator.onLine === false;
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
