import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type {
  Settlement,
  SettlementDetail,
  SettlementItemType,
  SettlementStatus,
} from "@/lib/woodong/settlements";

/**
 * 정산 리포트 조회 헬퍼 (Task 036).
 *
 * `queries/dues.ts`·`queries/expenses.ts`와 같은 규약: 호출부가 만든 **사용자 세션 클라이언트**를
 * 받아 RLS 아래에서만 동작한다(service role 사용 금지).
 *
 * ⚠️ **초안 숨김을 애플리케이션에서 다시 필터링하지 않는다.** `woodong_settlements_select_member`
 * 정책이 `status = 'published' or woodong_is_group_admin(group_id)`를 이미 강제한다. 여기서
 * `status`로 한 번 더 거르면 두 곳이 어긋날 때 어느 쪽이 진실인지 알 수 없게 되고, 진짜 방어선은
 * 언제나 RLS다.
 */

const SETTLEMENT_COLUMNS =
  "id, group_id, period_start, period_end, total_income, total_expense, balance, status, published_at, published_by, created_by, created_at, updated_at";

const SETTLEMENT_ITEM_COLUMNS =
  "id, settlement_id, item_type, category, amount, description, entry_count, sort_order";

type Client = SupabaseClient<Database>;

/**
 * 모임의 정산 리포트 목록. 정산 기간이 최근인 것부터(같은 기간이면 최근 생성 순).
 *
 * 발행일이 아니라 **정산 기간**으로 정렬한다. 총무가 8월 정산을 늦게 발행하고 9월 정산을
 * 먼저 발행하는 일이 흔한데, 발행일순으로 두면 목록에서 기간이 뒤죽박죽 보인다.
 */
export async function listGroupSettlements(
  supabase: Client,
  groupId: string,
): Promise<Settlement[]> {
  const { data, error } = await supabase
    .from("woodong_settlements")
    .select(SETTLEMENT_COLUMNS)
    .eq("group_id", groupId)
    .order("period_start", { ascending: false })
    .order("period_end", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries/settlements] listGroupSettlements failed:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    status: row.status as SettlementStatus,
  }));
}

/**
 * 리포트 하나 + 항목별 상세.
 *
 * 헤더와 항목을 왕복 2회로 나누면 상세 화면의 임계 경로가 그만큼 길어지므로 PostgREST
 * 임베딩(FK `woodong_settlement_items.settlement_id`)으로 한 번에 읽는다. RLS는 임베딩된
 * 테이블에도 그대로 적용된다(Task 033 후속 LCP 최적화에서 회비 화면에 쓴 것과 같은 방식).
 *
 * `groupId`로도 좁히는 이유: 다른 모임의 리포트 id를 URL에 넣으면 RLS가 어차피 0행을 주지만,
 * 그 경우 화면이 "없는 리포트"와 "남의 리포트"를 같은 안내로 처리하도록 조건을 명시해 둔다.
 */
export async function getSettlementDetail(
  supabase: Client,
  groupId: string,
  settlementId: string,
): Promise<SettlementDetail | null> {
  const { data, error } = await supabase
    .from("woodong_settlements")
    .select(
      `${SETTLEMENT_COLUMNS}, woodong_settlement_items(${SETTLEMENT_ITEM_COLUMNS})`,
    )
    .eq("id", settlementId)
    .eq("group_id", groupId)
    // 순서는 스냅샷에 박아 둔 `sort_order`(수입=회비 기한순 → 지출=카테고리 정의순)를 따른다.
    // 임베딩된 테이블에도 `referencedTable`로 정렬을 걸 수 있어 클라이언트에서 다시 정렬하지 않는다.
    .order("sort_order", {
      referencedTable: "woodong_settlement_items",
      ascending: true,
    })
    .maybeSingle();

  if (error) {
    console.error("[queries/settlements] getSettlementDetail failed:", error);
    return null;
  }
  if (!data) return null;

  const { woodong_settlement_items: itemRows, ...settlementColumns } = data;

  return {
    settlement: {
      ...settlementColumns,
      status: settlementColumns.status as SettlementStatus,
    },
    items: (itemRows ?? []).map((row) => ({
      ...row,
      item_type: row.item_type as SettlementItemType,
    })),
  };
}
