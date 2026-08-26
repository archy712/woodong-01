"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/woodong/common";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import {
  createSettlementSchema,
  recalculateSettlementSchema,
  settlementTargetSchema,
  type CreateSettlementInput,
  type RecalculateSettlementInput,
  type Settlement,
  type SettlementStatus,
  type SettlementTargetInput,
} from "@/lib/woodong/settlements";

/**
 * 정산 리포트 Server Action (Task 036, PRD 3.4-b).
 *
 * 총무 여부를 애플리케이션에서 조회하지 않는다. 생성·재계산 RPC는 `security invoker`라
 * RLS 정책(`woodong_settlements_insert_admin` 등)이 그대로 막고, 발행 RPC는 `SECURITY DEFINER`라
 * 함수가 직접 `woodong_is_group_admin()`을 확인한다. 어느 쪽이든 일반회원은 42501로 되돌아온다.
 */

const ADMIN_ONLY_MESSAGE = "정산 리포트는 총무만 관리할 수 있어요.";
const ALREADY_PUBLISHED_MESSAGE =
  "이미 발행된 정산 리포트예요. 화면을 새로고침해주세요.";

/** Postgres CHECK 제약 / `raise ... using errcode = '23514'`. */
const CHECK_VIOLATION_CODE = "23514";

function isCheckViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === CHECK_VIOLATION_CODE
  );
}

function revalidateSettlementPaths(groupId: string, settlementId?: string) {
  revalidatePath(`/protected/groups/${groupId}/dues/settlements`);
  if (settlementId) {
    revalidatePath(
      `/protected/groups/${groupId}/dues/settlements/${settlementId}`,
    );
  }
}

/** RPC가 돌려준 `woodong_settlements` 행을 도메인 타입으로 좁힌다. */
function toSettlement(row: {
  id: string;
  group_id: string;
  period_start: string;
  period_end: string;
  total_income: number;
  total_expense: number;
  balance: number;
  status: string;
  published_at: string | null;
  published_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}): Settlement {
  return { ...row, status: row.status as SettlementStatus };
}

/**
 * 정산 **초안** 생성 (검토 단계 도입 결정, Task 036).
 *
 * 이 액션은 발행하지 않는다. 총무가 금액을 확인한 뒤 별도로 `publishSettlementAction()`을
 * 호출해야 멤버 알림이 나간다 — 수입·지출이 전부 수동 입력이라 첫 계산이 곧바로 확정되면
 * 오타 하나에 삭제 후 재발행이 되고 멤버는 같은 정산 알림을 두 번 받는다(PRD 9장).
 *
 * 집계는 전부 DB의 `woodong_create_settlement_draft()` 안에서 일어난다. 헤더 INSERT와
 * 항목 INSERT를 애플리케이션에서 나눠 하면 두 번째가 실패했을 때 **항목이 하나도 없는
 * 정산 리포트**가 남는다.
 */
export async function createSettlementAction(
  input: CreateSettlementInput,
): Promise<ActionResult<Settlement>> {
  const parsed = createSettlementSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, periodStart, periodEnd } = parsed.data;

  const { data, error } = await supabase.rpc(
    "woodong_create_settlement_draft",
    {
      p_group_id: groupId,
      p_period_start: periodStart,
      p_period_end: periodEnd,
    },
  );

  if (error) {
    console.error("[createSettlementAction] rpc failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }
  if (!data) {
    console.error("[createSettlementAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  revalidateSettlementPaths(groupId, data.id);
  return { success: true, data: toSettlement(data) };
}

/**
 * 초안 기간 수정 + 재계산.
 *
 * 발행된 리포트에는 통하지 않는다 — RPC가 `status = 'draft'` 조건으로만 UPDATE하고,
 * `woodong_settlements_prevent_published_change` 트리거가 그 뒤를 한 번 더 막는다.
 * 스냅샷이 나중에 바뀔 수 있으면 스냅샷이 아니다.
 */
export async function recalculateSettlementAction(
  input: RecalculateSettlementInput,
): Promise<ActionResult<Settlement>> {
  const parsed = recalculateSettlementSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, settlementId, periodStart, periodEnd } = parsed.data;

  const { data, error } = await supabase.rpc(
    "woodong_recalculate_settlement_draft",
    {
      p_settlement_id: settlementId,
      p_period_start: periodStart,
      p_period_end: periodEnd,
    },
  );

  if (error) {
    console.error("[recalculateSettlementAction] rpc failed:", error);
    if (isCheckViolation(error)) {
      return { success: false, formError: ALREADY_PUBLISHED_MESSAGE };
    }
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }
  if (!data) {
    console.error("[recalculateSettlementAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  revalidateSettlementPaths(groupId, settlementId);
  return { success: true, data: toSettlement(data) };
}

export type PublishSettlementResult = {
  settlement: Settlement;
  /** 이번 발행으로 실제 만들어진 앱 내 알림 건수(발행자 본인과 `in_app` 비활성 멤버는 제외). */
  notifiedCount: number;
};

/**
 * 정산 리포트 발행 + 앱 내 알림 팬아웃 (PRD 3.3 AC "정산 리포트 발행" 알림).
 *
 * 상태 전환과 팬아웃을 애플리케이션에서 두 번 나눠 하면, 두 번째가 실패했을 때
 * **아무에게도 알려지지 않은 발행분**이 남고(총무는 발행한 줄 안다) 되돌릴 방법이 없다.
 * 그래서 두 문장을 `woodong_publish_settlement()` 안에 넣어 호출 1회 = 트랜잭션 1개로 만든다
 * (`createAnnouncementAction`과 같은 규약).
 */
export async function publishSettlementAction(
  input: SettlementTargetInput & { title: string; body: string },
): Promise<ActionResult<PublishSettlementResult>> {
  const parsed = settlementTargetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, settlementId } = parsed.data;

  const { data, error } = await supabase.rpc("woodong_publish_settlement", {
    p_settlement_id: settlementId,
    p_title: input.title,
    p_body: input.body,
  });

  if (error) {
    console.error("[publishSettlementAction] rpc failed:", error);
    if (isCheckViolation(error)) {
      return { success: false, formError: ALREADY_PUBLISHED_MESSAGE };
    }
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  if (!row) {
    console.error("[publishSettlementAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  revalidateSettlementPaths(groupId, settlementId);
  // 알림센터와 헤더 뱃지는 팬아웃으로 새 알림이 생겼다.
  revalidatePath("/protected/notifications");

  return {
    success: true,
    data: {
      settlement: toSettlement(row.settlement),
      notifiedCount: row.notified_count,
    },
  };
}

/**
 * 정산 리포트 삭제.
 *
 * 발행분도 지울 수 있다. 발행 후에는 수정이 막혀 있으므로(스냅샷), 잘못 발행한 총무에게 남는
 * 유일한 수단이 삭제다. 대신 다시 발행하면 멤버가 알림을 한 번 더 받는다는 사실을 확인
 * 다이얼로그에서 알린다.
 *
 * 항목(`woodong_settlement_items`)은 FK `on delete cascade`로 함께 지워진다. 이미 발송된
 * 알림은 남는다 — 알림 이력을 소급해 지우면 KPI("알림 클릭률")의 분모가 흔들린다.
 */
export async function deleteSettlementAction(
  input: SettlementTargetInput,
): Promise<ActionResult<undefined>> {
  const parsed = settlementTargetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, settlementId } = parsed.data;

  const { error, count } = await supabase
    .from("woodong_settlements")
    .delete({ count: "exact" })
    .eq("id", settlementId)
    .eq("group_id", groupId);

  if (error) {
    console.error("[deleteSettlementAction] delete failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  // RLS는 권한 없는 DELETE를 에러가 아니라 **0행**으로 돌려준다. 걸러 내지 않으면
  // 일반회원에게 "삭제했습니다" 토스트가 뜬다(Task 035와 같은 처리).
  if (count === 0) {
    return { success: false, formError: ADMIN_ONLY_MESSAGE };
  }

  revalidateSettlementPaths(groupId, settlementId);
  return { success: true, data: undefined };
}
