import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";
import { dateOnlyString, wonAmount } from "./common";

/** 회비 항목 구분 — `woodong_due_cycles.due_type` CHECK 제약(regular/extra, PRD 5.5, ROADMAP Task 002) */
export type DueType = "regular" | "extra";

export type DueCycle = Omit<
  Pick<
    Tables<"woodong_due_cycles">,
    | "id"
    | "group_id"
    | "title"
    | "period"
    | "amount"
    | "due_type"
    | "due_date"
    | "reminder_interval_days"
    | "created_by"
    | "created_at"
  >,
  "due_type"
> & { due_type: DueType };

/**
 * 멤버별 회비 청구 상태 — `woodong_dues.status` CHECK 제약(unpaid/partial/paid, PRD 5.6).
 * 연결된 `woodong_payments.amount` 합계 기준으로 DB 트리거가 자동 갱신하며,
 * 애플리케이션에서 직접 이 값을 쓰지 않는다(ROADMAP Task 003/023).
 */
export type DuesStatus = "unpaid" | "partial" | "paid";

export type Due = Omit<
  Pick<
    Tables<"woodong_dues">,
    | "id"
    | "due_cycle_id"
    | "group_id"
    | "user_id"
    | "amount"
    | "status"
    | "last_reminded_at"
  >,
  "status"
> & { status: DuesStatus };

export type Payment = Pick<
  Tables<"woodong_payments">,
  "id" | "due_id" | "group_id" | "amount" | "paid_at" | "recorded_by" | "memo"
>;

// ── zod 스키마 ────────────────────────────────────────────────────────────

/** 회비 항목 생성 폼 (PRD 3.4-a AC, 5.5) — 생성 시 활성 멤버 전원에게 `unpaid` 청구가 팬아웃된다 */
export const createDueCycleSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  title: z
    .string()
    .trim()
    .min(1, "회비 항목명을 입력해주세요")
    .max(100, "회비 항목명은 최대 100자까지 입력 가능합니다"),
  period: z
    .string()
    .trim()
    .min(1, "대상 기간을 입력해주세요")
    .max(20, "대상 기간은 최대 20자까지 입력 가능합니다"),
  amount: wonAmount({
    min: 1,
    minMessage: "회비 금액은 1원 이상이어야 합니다",
  }),
  dueType: z.enum(["regular", "extra"], {
    required_error: "회비 유형을 선택해주세요",
  }),
  dueDate: dateOnlyString("납부 기한을 입력해주세요"),
  reminderIntervalDays: z.coerce
    .number()
    .int("리마인드 주기는 정수(일)로 입력해주세요")
    .min(1, "리마인드 주기는 1일 이상이어야 합니다")
    .max(90, "리마인드 주기는 최대 90일까지 설정 가능합니다")
    .optional(),
});
export type CreateDueCycleInput = z.infer<typeof createDueCycleSchema>;

/**
 * 납부 기록 폼 (PRD 3.4-a AC) — 저장된 이력은 `woodong_payments`에 쌓이고
 * `woodong_dues.status`는 트리거가 합계 비교로 자동 갱신한다.
 */
export const recordPaymentSchema = z.object({
  dueId: z.string().uuid("올바른 청구 ID가 아닙니다"),
  amount: wonAmount({
    min: 1,
    minMessage: "납부 금액은 1원 이상이어야 합니다",
  }),
  paidAt: dateOnlyString("납부 확인 일시를 입력해주세요"),
  memo: z
    .string()
    .trim()
    .max(200, "비고는 최대 200자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
