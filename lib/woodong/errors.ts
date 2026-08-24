import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Postgres 42501("insufficient_privilege")은 GRANT 누락과 RLS 정책(`WITH CHECK`/`USING`)
 * 위반을 모두 포괄하는 코드다. 이 프로젝트의 `woodong_*` 테이블은 전부 RLS로 보호되고
 * GRANT는 Supabase가 기본 제공하므로, 이 코드가 뜨면 사실상 항상 RLS 위반이다
 * (Supabase 공식 트러블슈팅 문서 "Database API 42501 errors" — `mcp__supabase__search_docs`로 확인,
 * `PostgrestError`의 `code` 필드에 담겨 온다: node_modules/@supabase/postgrest-js/src/PostgrestError.ts 참고).
 */
const RLS_ERROR_CODE = "42501";

/** Postgres CHECK 제약(예: `role`/`status` 허용값) 위반. */
const CHECK_CONSTRAINT_ERROR_CODE = "23514";

/** UNIQUE 제약 위반(중복 데이터). */
const UNIQUE_VIOLATION_ERROR_CODE = "23505";

/** FOREIGN KEY 제약 위반(참조 대상이 없거나 접근할 수 없음). */
const FOREIGN_KEY_VIOLATION_ERROR_CODE = "23503";

function hasErrorCode(error: unknown): error is Pick<PostgrestError, "code"> {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

/**
 * RLS(행 수준 보안) 위반으로 거부된 요청인지 판별한다.
 *
 * `code === "42501"`을 우선 확인하고, 코드가 비어 있는 드문 경우를 대비해
 * Postgres가 실제로 내려주는 표준 메시지 문구("row-level security policy")도 보조적으로 확인한다.
 */
export function isRlsError(error: unknown): boolean {
  if (hasErrorCode(error) && error.code === RLS_ERROR_CODE) {
    return true;
  }

  return (
    error instanceof Error &&
    error.message.toLowerCase().includes("row-level security policy")
  );
}

/**
 * Supabase(PostgREST/Postgres) 쿼리 에러를 사용자 친화적 한국어 메시지로 변환한다.
 *
 * Server Action에서 `ActionResult.formError`에 그대로 넣을 수 있는 문자열을 반환한다.
 * 원본 DB 에러 메시지(영문, 컬럼/제약조건명 노출)는 UI에 그대로 노출하지 않고,
 * 서버 로그(`console.error`)로만 남기는 것을 전제로 한다 — 이 함수는 로깅을 하지 않으므로
 * 호출부에서 `console.error(error)`를 함께 남길 것.
 */
export function mapSupabaseError(
  error: unknown,
  fallback = "요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
): string {
  if (isRlsError(error)) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (hasErrorCode(error)) {
    switch (error.code) {
      case UNIQUE_VIOLATION_ERROR_CODE:
        return "이미 존재하는 데이터입니다.";
      case FOREIGN_KEY_VIOLATION_ERROR_CODE:
        return "연결된 데이터를 찾을 수 없습니다.";
      case CHECK_CONSTRAINT_ERROR_CODE:
        return "입력값이 허용된 범위를 벗어났습니다.";
      default:
        return fallback;
    }
  }

  return fallback;
}
