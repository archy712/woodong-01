import { z } from "zod";

import type { Tables } from "@/lib/supabase/database.types";
import { dateOnlyString, wonAmount } from "./common";

/**
 * 지출 카테고리 — `woodong_expenses.category` CHECK 제약(PRD 5.8, ROADMAP Task 035).
 *
 * `woodong_groups.type`과 달리 자유 값이 아니다. Task 036의 정산 리포트가 카테고리별로
 * 집계하는데, 자유 문자열이면 "회식"/"회식비"/"식대"가 서로 다른 카테고리로 갈라져
 * 집계가 깨진다. 값을 추가하려면 DB의 CHECK 제약과 이 배열, 4개 언어 사전을 함께 고쳐야 한다.
 */
export const EXPENSE_CATEGORIES = [
  "meal",
  "event",
  "supplies",
  "venue",
  "transport",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = Omit<
  Pick<
    Tables<"woodong_expenses">,
    | "id"
    | "group_id"
    | "category"
    | "amount"
    | "receipt_object_path"
    | "paid_by"
    | "spent_at"
    | "memo"
    | "created_at"
  >,
  "category"
> & { category: ExpenseCategory };

/**
 * 목록에 그릴 때 필요한 파생 값까지 붙인 형태.
 *
 * 담당자 이름은 여기 없다. 이름은 공유 `profiles`에 있는데 그 테이블의 SELECT 정책이
 * **본인 행 또는 앱 관리자**라 지출 조회에서 직접 조인할 수 없다. 회비 화면은 이미
 * `woodong_list_group_members()` 결과를 들고 있으므로 `paid_by`를 그 목록에서 찾아 쓴다.
 */
export type ExpenseRow = Expense & {
  /** `woodong-receipts` 비공개 버킷의 서명 URL. 영수증이 없거나 발급 실패면 null. */
  receiptUrl: string | null;
};

// ── zod 스키마 ────────────────────────────────────────────────────────────

/**
 * 지출 등록 폼 (PRD 3.4-b AC).
 *
 * AC가 명시한 필수 항목은 **금액과 카테고리**다. 담당자(`paidBy`)와 비고는 선택이고,
 * 지출 일자는 폼이 오늘 날짜로 채워 두므로 사실상 항상 값이 있다.
 *
 * 영수증 파일은 이 스키마에 넣지 않는다. 업로드는 클라이언트가 Storage에 직접 올린 뒤
 * **경로만** Server Action에 넘기는 구조라(모임 대표 이미지와 동일), 여기서 검증할 대상은
 * File이 아니라 업로드가 끝난 오브젝트 경로다.
 */
export const createExpenseSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  category: z.enum(EXPENSE_CATEGORIES, {
    required_error: "지출 카테고리를 선택해주세요",
    invalid_type_error: "지출 카테고리를 선택해주세요",
  }),
  /**
   * 필수 금액.
   *
   * 폼이 이 칸을 빈 칸으로 시작하는데, `z.coerce.number()`에 `undefined`가 그대로 들어가면
   * `NaN`이 되어 zod 기본 영어 메시지가 노출된다. 빈 값을 먼저 `0`으로 정규화해 항상
   * 한국어 `minMessage`가 나오게 한다(`createDueCycleSchema`와 같은 처리).
   */
  amount: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? 0 : value,
    wonAmount({
      min: 1,
      minMessage: "지출 금액은 1원 이상이어야 합니다",
    }),
  ),
  spentAt: dateOnlyString("지출 일자를 입력해주세요"),
  /**
   * 선택 항목. `<select>`의 "선택 안 함"은 빈 문자열로 오므로 먼저 `undefined`로 정규화한다.
   * 빈 문자열을 그대로 두면 `.uuid()`에 걸려 "비워 두기"가 불가능해진다.
   */
  paidBy: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().uuid("올바른 담당자가 아닙니다").optional(),
  ),
  memo: z
    .string()
    .trim()
    .max(200, "비고는 최대 200자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
  /**
   * 업로드가 끝난 영수증 오브젝트 경로. `{groupId}/{uuid}-{파일명}` 형태여야 한다 —
   * Storage RLS가 경로의 **첫 세그먼트를 모임 id로 보고** 권한을 판정하기 때문이다.
   * Server Action에서 `groupId`와 대조해 한 번 더 확인한다.
   */
  receiptObjectPath: z
    .string()
    .trim()
    .max(500, "영수증 경로가 너무 깁니다")
    .optional()
    .or(z.literal("")),
});
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

/** 지출 수정 폼 — 대상 모임(`groupId`)은 바꿀 수 없다. */
export const updateExpenseSchema = createExpenseSchema.extend({
  expenseId: z.string().uuid("올바른 지출 ID가 아닙니다"),
});
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

/** 지출 삭제. */
export const deleteExpenseSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  expenseId: z.string().uuid("올바른 지출 ID가 아닙니다"),
});
export type DeleteExpenseInput = z.infer<typeof deleteExpenseSchema>;

// ── 집계 ──────────────────────────────────────────────────────────────────

/**
 * 지출 합계(원).
 *
 * 잔액 계산은 `lib/woodong/dues-summary.ts`의 수입 집계와 짝을 이룬다. 두 값을 같은 화면에서
 * 쓰므로 계산을 화면 쪽에 흩뿌리지 않고 순수 함수로 모아 둔다(수입 쪽과 같은 이유).
 */
export function totalExpenseAmount(
  expenses: Pick<Expense, "amount">[],
): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export type GroupBalance = {
  /** 실제 수납액 합계(원). 청구액이 아니다 — 아래 주석 참고. */
  totalIncome: number;
  totalExpense: number;
  /** 수입 − 지출. 지출이 더 많으면 음수가 된다(그대로 보여준다). */
  balance: number;
};

/**
 * 모임 잔액 (PRD 3.4-b, Task 035).
 *
 * 1차 MVP(3.4-a)에서는 지출 데이터가 없어 "잔액" 개념 자체를 노출하지 않았다. 이 함수가
 * 들어오면서 비로소 성립한다.
 *
 * **수입은 청구액이 아니라 실제 수납액**이다. `getDuesOverview()`가 만들어 주는
 * `paidAmounts`(청구 id → `woodong_payments` 합계)를 그대로 더한다. 청구액을 쓰면 아직
 * 아무도 내지 않은 회비까지 통장에 있는 돈으로 계산되어 잔액이 실제보다 부풀려진다.
 */
export function summarizeGroupBalance(
  paidAmounts: Record<string, number>,
  expenses: Pick<Expense, "amount">[],
): GroupBalance {
  const totalIncome = Object.values(paidAmounts).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const totalExpense = totalExpenseAmount(expenses);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

/**
 * 카테고리별 지출 합계. 값이 0인 카테고리는 넣지 않는다(범례가 불필요하게 길어진다).
 * Task 036의 정산 리포트가 같은 집계를 쓴다.
 */
export function sumExpensesByCategory(
  expenses: Pick<Expense, "category" | "amount">[],
): { category: ExpenseCategory; amount: number }[] {
  const totals = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    totals.set(
      expense.category,
      (totals.get(expense.category) ?? 0) + expense.amount,
    );
  }
  // 표시 순서는 금액이 아니라 `EXPENSE_CATEGORIES` 순서를 따른다. 금액순으로 하면
  // 지출을 하나 등록할 때마다 범례 순서가 뒤바뀌어 읽기 어렵다.
  return EXPENSE_CATEGORIES.filter((category) => totals.get(category)).map(
    (category) => ({ category, amount: totals.get(category) as number }),
  );
}
