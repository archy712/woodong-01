"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createDueCycleSchema,
  dateOnlyToIso,
  deletePaymentSchema,
  recordPaymentSchema,
  updatePaymentSchema,
  type CreateDueCycleInput,
  type DeletePaymentInput,
  type DueCycle,
  type DueType,
  type Payment,
  type RecordPaymentInput,
  type UpdatePaymentInput,
} from "@/lib/woodong/dues";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import type { ActionResult } from "@/lib/woodong/common";

export type CreateDueCycleResult = {
  cycle: DueCycle;
  /** 이번 생성으로 실제 만들어진 청구(`woodong_dues`) 건수 = 생성 시점의 활성 멤버 수. */
  chargedCount: number;
};

/**
 * 회비 항목 생성 + 청구 팬아웃 Server Action (Task 022).
 *
 * 항목 INSERT와 멤버별 청구 INSERT는 반드시 함께 성공하거나 함께 실패해야 하므로
 * (청구가 하나도 없는 회비 항목이 남으면 총무는 만든 줄 알고 아무도 청구받지 않는다),
 * 두 문장을 `woodong_create_due_cycle()` 안에 넣어 **호출 1회 = 트랜잭션 1개**로 처리한다.
 *
 * 그 함수는 `SECURITY INVOKER`라 총무 판정을 애플리케이션이 아니라 RLS
 * (`woodong_due_cycles_insert_admin` → `woodong_is_group_admin()`)가 그대로 강제한다.
 * 일반회원이 호출하면 42501로 거부되므로 여기서 총무 여부를 따로 조회하지 않는다.
 */
export async function createDueCycleAction(
  input: CreateDueCycleInput,
): Promise<ActionResult<CreateDueCycleResult>> {
  const parsed = createDueCycleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const {
    groupId,
    title,
    period,
    amount,
    dueType,
    dueDate,
    reminderIntervalDays,
  } = parsed.data;

  const { data, error } = await supabase.rpc("woodong_create_due_cycle", {
    p_group_id: groupId,
    p_title: title,
    p_period: period,
    p_amount: amount,
    p_due_type: dueType,
    p_due_date: dueDate,
    ...(reminderIntervalDays === undefined
      ? {}
      : { p_reminder_interval_days: reminderIntervalDays }),
  });

  if (error) {
    console.error("[createDueCycleAction] rpc failed:", error);
    if (isRlsError(error)) {
      return {
        success: false,
        formError: "회비 항목은 총무만 만들 수 있어요.",
      };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  if (!row) {
    console.error("[createDueCycleAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  // 회비 화면과 모임 홈(회비 요약 카드)이 모두 이 데이터에 의존한다.
  revalidatePath(`/protected/groups/${groupId}/dues`);
  revalidatePath(`/protected/groups/${groupId}`);

  return {
    success: true,
    data: {
      cycle: {
        id: row.cycle_id,
        group_id: row.cycle_group_id,
        title: row.cycle_title,
        period: row.cycle_period,
        amount: row.cycle_amount,
        due_type: row.cycle_due_type as DueType,
        due_date: row.cycle_due_date,
        reminder_interval_days: row.cycle_reminder_interval_days,
        created_by: row.cycle_created_by,
        created_at: row.cycle_created_at,
      },
      chargedCount: row.charged_count,
    },
  };
}

const PAYMENT_COLUMNS =
  "id, due_id, group_id, amount, paid_at, recorded_by, memo";

/** 회비 화면과 모임 홈(회비 요약 카드)이 모두 납부 상태에 의존한다. */
function revalidateDuesPaths(groupId: string) {
  revalidatePath(`/protected/groups/${groupId}/dues`);
  revalidatePath(`/protected/groups/${groupId}`);
}

/** 총무가 아닌 사용자가 납부 이력을 건드리려 할 때의 문구(RLS 거부·0행 갱신 공통). */
const PAYMENT_ADMIN_ONLY_MESSAGE = "납부 이력은 총무만 기록·수정할 수 있어요.";

/**
 * 납부 이력 기록 Server Action (Task 023).
 *
 * ⚠️ **`woodong_dues.status`는 절대 애플리케이션에서 쓰지 않는다.** 이력을 넣으면 DB 트리거
 * (`woodong_update_due_status`, Task 003)가 `woodong_payments.amount` 합계와 청구 금액을 비교해
 * `unpaid`/`partial`/`paid`를 다시 계산한다. 앱이 status를 직접 쓰면 (a) 이력 합계와 상태가 어긋날 수
 * 있고, (b) `woodong_dues`에는 애초에 UPDATE 정책조차 없다(트리거만 갱신할 수 있다).
 *
 * `group_id`는 클라이언트가 보낸 값을 믿지 않고 **청구 행에서 조회해서** 채운다. 클라이언트가
 * 정하게 두면 "A 모임의 청구인데 B 모임 소속으로 기록"해 RLS 판정을 흐릴 여지가 생긴다.
 */
export async function recordPaymentAction(
  input: RecordPaymentInput,
): Promise<ActionResult<Payment>> {
  const parsed = recordPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { dueId, amount, paidAt, memo } = parsed.data;

  const { data: due, error: dueError } = await supabase
    .from("woodong_dues")
    .select("id, group_id")
    .eq("id", dueId)
    .maybeSingle();

  if (dueError) {
    console.error("[recordPaymentAction] due lookup failed:", dueError);
    return { success: false, formError: mapSupabaseError(dueError) };
  }
  // 비멤버는 RLS 때문에 0행을 받는다("없음"과 "권한 없음"을 구분해 주지 않는다).
  if (!due) {
    return { success: false, formError: "청구 정보를 찾을 수 없어요." };
  }

  const { data, error } = await supabase
    .from("woodong_payments")
    .insert({
      due_id: due.id,
      group_id: due.group_id,
      amount,
      paid_at: dateOnlyToIso(paidAt),
      recorded_by: userId,
      memo: memo ? memo : null,
    })
    .select(PAYMENT_COLUMNS)
    .single();

  if (error) {
    console.error("[recordPaymentAction] insert failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: PAYMENT_ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidateDuesPaths(due.group_id);
  return { success: true, data };
}

/**
 * 납부 이력 수정 Server Action (Task 023) — 오입력 정정.
 *
 * 금액을 고치면 트리거가 합계를 다시 계산하므로 상태(`paid` ↔ `partial` ↔ `unpaid`)도 함께 되돌아온다.
 * 대상 청구(`due_id`)는 수정 대상에서 제외한다 — 이력을 다른 사람의 청구로 옮기는 건 정정이 아니라
 * 삭제 후 재기록이어야 하고, 옮기면 트리거가 **옮기기 전 청구**의 상태를 다시 계산하지 못한다.
 *
 * 일반회원의 시도는 `woodong_payments_update_admin` 정책이 막는데, PostgREST는 RLS 거부를 에러가
 * 아니라 **0행 갱신**으로 돌려주므로 `count: "exact"`로 확인해 권한 오류로 되돌린다(Task 019~021과 같은 패턴).
 */
export async function updatePaymentAction(
  input: UpdatePaymentInput,
): Promise<ActionResult<undefined>> {
  const parsed = updatePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { paymentId, amount, paidAt, memo } = parsed.data;

  const { data: payment, error: lookupError } = await supabase
    .from("woodong_payments")
    .select("id, group_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (lookupError) {
    console.error("[updatePaymentAction] lookup failed:", lookupError);
    return { success: false, formError: mapSupabaseError(lookupError) };
  }
  if (!payment) {
    return { success: false, formError: "납부 이력을 찾을 수 없어요." };
  }

  const { error, count } = await supabase
    .from("woodong_payments")
    .update(
      {
        amount,
        paid_at: dateOnlyToIso(paidAt),
        memo: memo ? memo : null,
      },
      { count: "exact" },
    )
    .eq("id", paymentId);

  if (error) {
    console.error("[updatePaymentAction] update failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return { success: false, formError: PAYMENT_ADMIN_ONLY_MESSAGE };
  }

  revalidateDuesPaths(payment.group_id);
  return { success: true, data: undefined };
}

/**
 * 납부 이력 삭제 Server Action (Task 023).
 *
 * 이력이 사라지면 트리거가 남은 합계로 상태를 다시 계산한다(마지막 이력을 지우면 `unpaid`로 복귀).
 * 잘못 기록한 납부를 "0원으로 수정"하는 우회 경로를 만들지 않으려고 삭제를 정식 경로로 둔다
 * (금액 하한이 1원이라 0원 수정은 애초에 막힌다).
 */
export async function deletePaymentAction(
  input: DeletePaymentInput,
): Promise<ActionResult<undefined>> {
  const parsed = deletePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { paymentId } = parsed.data;

  const { data: payment, error: lookupError } = await supabase
    .from("woodong_payments")
    .select("id, group_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (lookupError) {
    console.error("[deletePaymentAction] lookup failed:", lookupError);
    return { success: false, formError: mapSupabaseError(lookupError) };
  }
  if (!payment) {
    return { success: false, formError: "납부 이력을 찾을 수 없어요." };
  }

  const { error, count } = await supabase
    .from("woodong_payments")
    .delete({ count: "exact" })
    .eq("id", paymentId);

  if (error) {
    console.error("[deletePaymentAction] delete failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return { success: false, formError: PAYMENT_ADMIN_ONLY_MESSAGE };
  }

  revalidateDuesPaths(payment.group_id);
  return { success: true, data: undefined };
}
