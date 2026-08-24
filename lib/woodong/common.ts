import { z } from "zod";

/**
 * Server Action 공통 응답 규격.
 *
 * discriminated union으로 성공/실패를 구분하고, 실패 시 react-hook-form의
 * `setError()`에 그대로 매핑할 수 있도록 필드별 에러 배열(`fieldErrors`)과
 * 필드에 속하지 않는 일반 에러 메시지(`formError`)를 분리해서 담는다.
 * 실제 Server Action 래퍼/훅 구현은 Task 008(폼 아키텍처)에서 이 타입을 그대로 재사용한다.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | {
      success: false;
      fieldErrors?: Record<string, string[]>;
      formError?: string;
    };

/**
 * `YYYY-MM-DD` 형식의 날짜 전용 문자열(HTML `<input type="date">` 값) 검증.
 *
 * `z.coerce.date()`는 zod v3(현재 설치 버전 3.25.76 — 최상위 `z.email()`/`z.uuid()` 등
 * v4 API는 아직 없음)에서 `undefined`가 `new Date(undefined)`로 먼저 강제 변환된 뒤
 * 타입 검사가 이뤄져 `required_error`/`invalid_type_error` 커스텀 메시지가 무시되는 문제가 있다.
 * 문자열 스키마 + `refine`으로 우회해 항상 한국어 에러 메시지가 노출되도록 한다.
 */
export const dateOnlyString = (message = "올바른 날짜를 입력해주세요") =>
  z
    .string()
    .min(1, message)
    .refine((value) => !Number.isNaN(Date.parse(value)), message);

/** ISO 8601 등 일시 문자열(HTML `<input type="datetime-local">` 값) 검증. 이유는 `dateOnlyString` 참고. */
export const datetimeString = (message = "올바른 일시를 입력해주세요") =>
  z
    .string()
    .min(1, message)
    .refine((value) => !Number.isNaN(Date.parse(value)), message);

/**
 * 원 단위 정수 금액(`numeric(14,0)`) 공통 검증.
 *
 * `woodong_groups.default_due_amount`, `woodong_due_cycles.amount`, `woodong_dues.amount`,
 * `woodong_payments.amount` 등 소수점 없는 금액 컬럼 전반에서 재사용한다.
 * 상한(`999_999_999_999_99`)은 `numeric(14,0)` 컬럼이 담을 수 있는 최댓값(10^14 - 1)이다.
 */
export const wonAmount = (opts: { min?: number; minMessage?: string } = {}) => {
  const min = opts.min ?? 0;
  return z.coerce
    .number()
    .int("금액은 정수(원 단위)로 입력해주세요")
    .min(
      min,
      opts.minMessage ??
        `금액은 ${min.toLocaleString("ko-KR")}원 이상이어야 합니다`,
    )
    .max(99_999_999_999_999, "금액이 너무 큽니다");
};
