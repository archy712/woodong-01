"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createDueCycleSchema,
  type CreateDueCycleInput,
  type DueCycle,
  type DueType,
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
