import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type { Due, DueCycle, DuesStatus, DueType } from "@/lib/woodong/dues";

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

type Client = SupabaseClient<Database>;

export type DuesOverview = {
  /** 납부 기한이 늦은 항목부터. 같은 날짜면 최근 생성 순. */
  cycles: DueCycle[];
  /** 회비 항목 id → 멤버별 청구 목록. */
  duesByCycle: Record<string, Due[]>;
  /** 청구 id → 납부 이력(`woodong_payments`) 합계. 이력이 없으면 키 자체가 없다(0으로 취급). */
  paidAmounts: Record<string, number>;
};

const EMPTY_OVERVIEW: DuesOverview = {
  cycles: [],
  duesByCycle: {},
  paidAmounts: {},
};

/**
 * 모임 회비 화면에 필요한 데이터를 한 번에 읽어 온다.
 *
 * 항목이 없으면 청구·납부 이력 조회를 건너뛴다(신규 모임에서 불필요한 왕복 2회 절약).
 * 납부 이력은 Task 023에서 쌓기 시작하므로 지금은 항상 비어 있지만, 합계 계산 규칙
 * (금액 합계 = 누계 납부액)은 DB 트리거가 `status`를 갱신하는 기준과 동일하게 맞춰 둔다.
 */
export async function getDuesOverview(
  supabase: Client,
  groupId: string,
): Promise<DuesOverview> {
  const { data: cycleRows, error: cycleError } = await supabase
    .from("woodong_due_cycles")
    .select(DUE_CYCLE_COLUMNS)
    .eq("group_id", groupId)
    .order("due_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (cycleError) {
    console.error("[queries/dues] listDueCycles failed:", cycleError);
    return EMPTY_OVERVIEW;
  }

  const cycles: DueCycle[] = (cycleRows ?? []).map((row) => ({
    ...row,
    due_type: row.due_type as DueType,
  }));

  if (cycles.length === 0) return EMPTY_OVERVIEW;

  const [duesResult, paymentsResult] = await Promise.all([
    supabase.from("woodong_dues").select(DUE_COLUMNS).eq("group_id", groupId),
    supabase
      .from("woodong_payments")
      .select("due_id, amount")
      .eq("group_id", groupId),
  ]);

  if (duesResult.error) {
    console.error("[queries/dues] listDues failed:", duesResult.error);
    return { cycles, duesByCycle: {}, paidAmounts: {} };
  }

  const duesByCycle: Record<string, Due[]> = {};
  for (const row of duesResult.data ?? []) {
    const due: Due = { ...row, status: row.status as DuesStatus };
    (duesByCycle[due.due_cycle_id] ??= []).push(due);
  }

  const paidAmounts: Record<string, number> = {};
  if (paymentsResult.error) {
    // 납부 이력을 못 읽어도 청구 목록은 그대로 보여준다(전부 0원 납부로 표시).
    console.error("[queries/dues] listPayments failed:", paymentsResult.error);
  } else {
    for (const payment of paymentsResult.data ?? []) {
      paidAmounts[payment.due_id] =
        (paidAmounts[payment.due_id] ?? 0) + payment.amount;
    }
  }

  return { cycles, duesByCycle, paidAmounts };
}
