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

/** `raise exception`으로 올린 사용자 정의 예외(plpgsql 기본 SQLSTATE). */
const RAISE_EXCEPTION_ERROR_CODE = "P0001";

/**
 * 마지막 총무 보호 트리거(`woodong_prevent_last_admin_change`, Task 003)가 막았을 때의 문구.
 *
 * PRD 3.2 AC에 명시된 문장 그대로이며, DB 트리거가 올리는 메시지와 동일하다. DB가 내려준
 * 원문을 그대로 노출하지 않고 이 상수를 쓰는 이유: DB 메시지를 사용자에게 그대로 보여주는
 * 습관이 생기면 다른 트리거가 추가됐을 때 영문 내부 메시지가 새어 나갈 수 있다.
 */
export const LAST_ADMIN_ERROR_MESSAGE =
  "마지막 총무는 역할을 변경하거나 탈퇴할 수 없습니다. 먼저 다른 멤버를 총무로 지정해주세요";

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
 * 마지막 총무 보호 트리거가 거부한 요청인지 판별한다 (Task 021).
 *
 * `P0001`은 plpgsql `raise exception` 전부가 쓰는 범용 코드라 코드만으로는 어떤 트리거가
 * 막았는지 알 수 없다. 트리거 메시지의 고유 문구까지 함께 확인해, 나중에 다른 `raise exception`이
 * 추가돼도 "마지막 총무" 문구가 엉뚱한 에러에 붙지 않게 한다.
 */
export function isLastAdminError(error: unknown): boolean {
  if (!hasErrorCode(error) || error.code !== RAISE_EXCEPTION_ERROR_CODE) {
    return false;
  }

  const { message } = error as unknown as { message?: unknown };

  return typeof message === "string" && message.includes("마지막 총무");
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
