import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  getSignedStorageUrls,
  WOODONG_RECEIPTS_BUCKET,
} from "@/lib/supabase/storage";
import type { ExpenseCategory, ExpenseRow } from "@/lib/woodong/expenses";

/**
 * 지출 조회 헬퍼 (Task 035).
 *
 * `queries/dues.ts`와 같은 규약: 호출부가 만든 **사용자 세션 클라이언트**를 받아 RLS 아래에서만
 * 동작한다(service role 사용 금지). `woodong_expenses`의 SELECT 정책이
 * `woodong_is_group_member(group_id)`라 비멤버는 애초에 0행을 받는다.
 */

const EXPENSE_COLUMNS =
  "id, group_id, category, amount, receipt_object_path, paid_by, spent_at, memo, created_at";

type Client = SupabaseClient<Database>;

/**
 * 모임의 지출 목록. 지출일 역순(같은 날짜면 최근 등록 순).
 *
 * 영수증 서명 URL은 행마다 발급해야 하는데, 행 수만큼 왕복하지 않도록 경로를 모아
 * `createSignedUrls`로 **한 번에** 받는다. 영수증이 하나도 없으면 요청 자체를 생략한다.
 */
export async function listGroupExpenses(
  supabase: Client,
  groupId: string,
): Promise<ExpenseRow[]> {
  const { data, error } = await supabase
    .from("woodong_expenses")
    .select(EXPENSE_COLUMNS)
    .eq("group_id", groupId)
    .order("spent_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries/expenses] listGroupExpenses failed:", error);
    return [];
  }

  const rows = data ?? [];
  const receiptPaths = rows
    .map((row) => row.receipt_object_path)
    .filter((path): path is string => Boolean(path));

  const receiptUrls = await getSignedStorageUrls(
    supabase,
    WOODONG_RECEIPTS_BUCKET,
    receiptPaths,
  );

  return rows.map((row) => ({
    ...row,
    category: row.category as ExpenseCategory,
    receiptUrl: row.receipt_object_path
      ? (receiptUrls[row.receipt_object_path] ?? null)
      : null,
  }));
}
