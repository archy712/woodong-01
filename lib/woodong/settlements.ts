import { z } from "zod";

import type { Tables } from "@/lib/supabase/database.types";
import { dateOnlyString } from "./common";
import type { DueType } from "./dues";
import type { ExpenseCategory } from "./expenses";

/**
 * 정산 리포트 (PRD 3.4-b·5.9, ROADMAP Task 036).
 *
 * 이 화면의 숫자는 전부 **발행 시점 스냅샷**이다. 회비 수입과 지출은 발행 이후에도 계속
 * 수정·삭제되므로, 리포트가 원본을 실시간 조회하면 "지난달에 공유한 정산이 오늘 열어 보니
 * 숫자가 다른" 일이 생긴다. 집계는 DB의 `woodong_build_settlement_items()`가 한 번만 하고
 * 애플리케이션은 저장된 값을 그대로 읽는다 — 여기에 재계산 로직을 두면 스냅샷의 의미가 없다.
 */

/**
 * 리포트 상태 — `woodong_settlements.status` CHECK 제약.
 *
 * 검토 단계(초안 → 발행)는 PRD 9장 "정산 데이터 정확성" 리스크에 대한 답이다. 수입·지출이
 * 전부 총무의 수동 입력이라 금액 오류 확률이 실재하는데, 발행은 전 멤버 알림 팬아웃을 동반해
 * 되돌릴 수 없다. 초안이 없으면 오타 하나에 삭제 → 재발행이 되고 멤버는 알림을 두 번 받는다.
 */
export const SETTLEMENT_STATUSES = ["draft", "published"] as const;
export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

/** 항목 구분 — `woodong_settlement_items.item_type` CHECK 제약. */
export type SettlementItemType = "income" | "expense";

/**
 * 항목의 카테고리.
 *
 * 수입은 회비 항목의 `due_type`, 지출은 `woodong_expenses.category`에서 복사된 값이다.
 * 두 집합은 겹치지 않으므로 `item_type`과 함께 보면 항상 하나로 해석된다.
 *
 * DB 쪽에는 일부러 CHECK를 걸지 않았다(스냅샷은 지금 존재하지 않는 과거 카테고리도 담을 수
 * 있어야 한다). 그래서 화면은 사전에 없는 값이 올 가능성을 열어 두고 폴백해야 한다 —
 * `settlementCategoryLabel()`이 그 역할을 한다.
 */
export type SettlementCategory = DueType | ExpenseCategory;

export type Settlement = Omit<
  Pick<
    Tables<"woodong_settlements">,
    | "id"
    | "group_id"
    | "period_start"
    | "period_end"
    | "total_income"
    | "total_expense"
    | "balance"
    | "status"
    | "published_at"
    | "published_by"
    | "created_by"
    | "created_at"
    | "updated_at"
  >,
  "status"
> & { status: SettlementStatus };

export type SettlementItem = Omit<
  Pick<
    Tables<"woodong_settlement_items">,
    | "id"
    | "settlement_id"
    | "item_type"
    | "category"
    | "amount"
    | "description"
    | "entry_count"
    | "sort_order"
  >,
  "item_type"
> & { item_type: SettlementItemType };

/** 상세 화면이 그리는 한 덩어리. 항목은 `sort_order` 순(수입 → 지출)으로 온다. */
export type SettlementDetail = {
  settlement: Settlement;
  items: SettlementItem[];
};

// ── zod 스키마 ────────────────────────────────────────────────────────────

/**
 * 기간 검증 공통 조각.
 *
 * DB에도 `period_end >= period_start` CHECK와 RPC의 명시적 검사가 있지만, 폼에서 잡아야
 * 사용자가 필드 아래에서 한국어 안내를 본다. 세 겹 중 어느 하나도 없어서는 안 된다 —
 * DB는 REST 직접 호출을 막고, 폼은 사용자를 돕는다.
 */
const periodShape = {
  periodStart: dateOnlyString("정산 시작일을 입력해주세요"),
  periodEnd: dateOnlyString("정산 종료일을 입력해주세요"),
};

function refinePeriod<T extends { periodStart: string; periodEnd: string }>(
  schema: z.ZodType<T>,
) {
  return schema.refine((value) => value.periodEnd >= value.periodStart, {
    message: "종료일은 시작일보다 빠를 수 없어요",
    path: ["periodEnd"],
  });
}

/** 정산 초안 생성 폼. */
export const createSettlementSchema = refinePeriod(
  z.object({
    groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
    ...periodShape,
  }),
);
export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;

/** 초안 기간 수정 + 재계산. 발행된 리포트에는 쓸 수 없다(DB 트리거가 막는다). */
export const recalculateSettlementSchema = refinePeriod(
  z.object({
    groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
    settlementId: z.string().uuid("올바른 정산 리포트 ID가 아닙니다"),
    ...periodShape,
  }),
);
export type RecalculateSettlementInput = z.infer<
  typeof recalculateSettlementSchema
>;

/** 발행 / 삭제 — 대상 지정만 필요하다. */
export const settlementTargetSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  settlementId: z.string().uuid("올바른 정산 리포트 ID가 아닙니다"),
});
export type SettlementTargetInput = z.infer<typeof settlementTargetSchema>;

// ── 표시 헬퍼 ─────────────────────────────────────────────────────────────

/**
 * 스냅샷에 담긴 카테고리 값을 화면 문구로 옮긴다.
 *
 * 사전에 없는 값(= 나중에 개편돼 사라진 카테고리가 옛 리포트에 남아 있는 경우)은 원본 문자열을
 * 그대로 보여준다. 빈칸으로 두면 금액만 떠 있는 줄이 되어 리포트를 읽을 수 없게 된다.
 */
export function settlementCategoryLabel(
  category: string,
  labels: { dueType: Record<string, string>; expense: Record<string, string> },
  itemType: SettlementItemType,
): string {
  const table = itemType === "income" ? labels.dueType : labels.expense;
  return table[category] ?? category;
}

/** `YYYY-MM-DD ~ YYYY-MM-DD`. 목록·상세·인쇄본이 전부 같은 표기를 쓰도록 여기로 모았다. */
export function formatSettlementPeriod(settlement: {
  period_start: string;
  period_end: string;
}): string {
  return `${settlement.period_start} ~ ${settlement.period_end}`;
}

/** 수입/지출 항목만 골라낸다. 항목은 이미 `sort_order` 순이라 상대 순서가 유지된다. */
export function filterSettlementItems(
  items: SettlementItem[],
  itemType: SettlementItemType,
): SettlementItem[] {
  return items.filter((item) => item.item_type === itemType);
}
