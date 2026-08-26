import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type {
  Due,
  DueCycle,
  DuesStatus,
  DueType,
  Payment,
} from "@/lib/woodong/dues";
import {
  summarizeDueCycle,
  type DueCycleSummary,
} from "@/lib/woodong/dues-summary";

/**
 * 회비 조회 헬퍼 (Task 022).
 *
 * `queries/groups.ts`와 같은 규약: 호출부가 만든 **사용자 세션 클라이언트**를 받아 RLS 아래에서만
 * 동작한다(service role 사용 금지). `woodong_due_cycles`/`woodong_dues`/`woodong_payments`의
 * SELECT 정책이 전부 `woodong_is_group_member(group_id)`라 비멤버는 애초에 0행을 받는다.
 */

const DUE_CYCLE_COLUMNS =
  "id, group_id, title, period, amount, due_type, due_date, reminder_interval_days, created_by, created_at";

const DUE_COLUMNS =
  "id, due_cycle_id, group_id, user_id, amount, status, last_reminded_at";

const PAYMENT_COLUMNS =
  "id, due_id, group_id, amount, paid_at, recorded_by, memo";

type Client = SupabaseClient<Database>;

export type DuesOverview = {
  /** 납부 기한이 늦은 항목부터. 같은 날짜면 최근 생성 순. */
  cycles: DueCycle[];
  /** 회비 항목 id → 멤버별 청구 목록. */
  duesByCycle: Record<string, Due[]>;
  /** 청구 id → 납부 이력(`woodong_payments`) 목록. 최근 납부일 순. */
  paymentsByDue: Record<string, Payment[]>;
  /** 청구 id → 납부 이력 합계. 이력이 없으면 키 자체가 없다(0으로 취급). */
  paidAmounts: Record<string, number>;
};

const EMPTY_OVERVIEW: DuesOverview = {
  cycles: [],
  duesByCycle: {},
  paymentsByDue: {},
  paidAmounts: {},
};

/**
 * 모임 회비 화면에 필요한 데이터를 한 번에 읽어 온다.
 *
 * 항목이 없으면 청구·납부 이력 조회를 건너뛴다(신규 모임에서 불필요한 왕복 2회 절약).
 * 누계 납부액은 여기서 이력 합계로 계산하는데, 이는 DB 트리거(`woodong_update_due_status`)가
 * `woodong_dues.status`를 갱신할 때 쓰는 기준과 **같은 식**이다(Task 023). 두 계산이 어긋나면
 * "상태는 완납인데 화면 진행률은 80%" 같은 모순이 생긴다.
 */
export async function getDuesOverview(
  supabase: Client,
  groupId: string,
): Promise<DuesOverview> {
  // 청구·납부는 `group_id`가 비정규화돼 있어 회차 목록을 기다릴 필요가 없다. 예전에는 회차를
  // 먼저 읽고 "0건이면 조기 반환"하려고 순차로 돌렸는데, 그 절약(회차 0건일 때 왕복 2회)보다
  // 항상 붙는 왕복 1회가 더 비쌌다 — 회차가 있는 흔한 경우가 매번 손해를 봤다
  // (Task 033 후속 LCP 최적화).
  const [cyclesResult, duesResult, paymentsResult] = await Promise.all([
    supabase
      .from("woodong_due_cycles")
      .select(DUE_CYCLE_COLUMNS)
      .eq("group_id", groupId)
      .order("due_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("woodong_dues").select(DUE_COLUMNS).eq("group_id", groupId),
    supabase
      .from("woodong_payments")
      .select(PAYMENT_COLUMNS)
      .eq("group_id", groupId)
      .order("paid_at", { ascending: false }),
  ]);

  const { data: cycleRows, error: cycleError } = cyclesResult;
  if (cycleError) {
    console.error("[queries/dues] listDueCycles failed:", cycleError);
    return EMPTY_OVERVIEW;
  }

  const cycles: DueCycle[] = (cycleRows ?? []).map((row) => ({
    ...row,
    due_type: row.due_type as DueType,
  }));

  if (cycles.length === 0) return EMPTY_OVERVIEW;

  if (duesResult.error) {
    console.error("[queries/dues] listDues failed:", duesResult.error);
    return { cycles, duesByCycle: {}, paymentsByDue: {}, paidAmounts: {} };
  }

  const duesByCycle: Record<string, Due[]> = {};
  for (const row of duesResult.data ?? []) {
    const due: Due = { ...row, status: row.status as DuesStatus };
    (duesByCycle[due.due_cycle_id] ??= []).push(due);
  }

  const paymentsByDue: Record<string, Payment[]> = {};
  const paidAmounts: Record<string, number> = {};
  if (paymentsResult.error) {
    // 납부 이력을 못 읽어도 청구 목록은 그대로 보여준다(전부 0원 납부로 표시).
    console.error("[queries/dues] listPayments failed:", paymentsResult.error);
  } else {
    for (const payment of paymentsResult.data ?? []) {
      (paymentsByDue[payment.due_id] ??= []).push(payment);
      paidAmounts[payment.due_id] =
        (paidAmounts[payment.due_id] ?? 0) + payment.amount;
    }
  }

  return { cycles, duesByCycle, paymentsByDue, paidAmounts };
}

/**
 * 모임 홈의 회비 요약 카드용 — **가장 최근 회비 항목 하나**만 집계한다 (Task 024).
 *
 * 홈에서 `getDuesOverview()`를 그대로 쓰면 모임의 모든 항목·청구·납부 이력을 다 읽어 오는데,
 * 정작 카드가 쓰는 건 최신 항목 한 건이다. 항목이 쌓일수록 홈이 느려지므로 대상 항목의 청구와
 * 그 청구에 달린 이력만 좁혀서 읽는다. 집계 식은 대시보드와 **같은 `summarizeDueCycle()`**를
 * 써서 두 화면의 납부율이 어긋나지 않게 한다.
 *
 * 회비 항목이 하나도 없거나 비멤버(RLS로 0행)면 `null`.
 */
export async function getLatestDueCycleSummary(
  supabase: Client,
  groupId: string,
): Promise<{ cycle: DueCycle; summary: DueCycleSummary } | null> {
  // 회차 → 청구 → 납부는 앞의 결과가 있어야 다음을 부를 수 있어 왕복 3회가 순차로 쌓였다.
  // 모임 홈에서 이 체인이 가장 긴 경로였다. PostgREST 임베딩(FK
  // `woodong_dues.due_cycle_id`, `woodong_payments.due_id`)으로 **한 번에** 가져온다
  // (Task 033 후속 LCP 최적화). RLS는 임베딩된 테이블에도 그대로 적용되므로 보이는 행은 같다.
  const { data: cycleRow, error: cycleError } = await supabase
    .from("woodong_due_cycles")
    .select(
      `${DUE_CYCLE_COLUMNS}, woodong_dues(${DUE_COLUMNS}, woodong_payments(due_id, amount))`,
    )
    .eq("group_id", groupId)
    .order("due_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleError) {
    console.error("[queries/dues] getLatestDueCycle failed:", cycleError);
    return null;
  }
  if (!cycleRow) return null;

  const { woodong_dues: dueRows, ...cycleColumns } = cycleRow;

  const cycle: DueCycle = {
    ...cycleColumns,
    due_type: cycleColumns.due_type as DueType,
  };

  const paidAmounts: Record<string, number> = {};
  const dues: Due[] = (dueRows ?? []).map((row) => {
    const { woodong_payments: payments, ...dueColumns } = row;
    for (const payment of payments ?? []) {
      paidAmounts[payment.due_id] =
        (paidAmounts[payment.due_id] ?? 0) + payment.amount;
    }
    return { ...dueColumns, status: dueColumns.status as DuesStatus };
  });

  return { cycle, summary: summarizeDueCycle(dues, paidAmounts) };
}
