"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { WOODONG_RECEIPTS_BUCKET } from "@/lib/supabase/storage";
import type { ActionResult } from "@/lib/woodong/common";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import {
  createExpenseSchema,
  deleteExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
  type DeleteExpenseInput,
  type UpdateExpenseInput,
} from "@/lib/woodong/expenses";

const ADMIN_ONLY_MESSAGE = "지출 내역은 총무만 관리할 수 있어요.";

function revalidateExpensePaths(groupId: string) {
  revalidatePath(`/protected/groups/${groupId}/dues`);
  revalidatePath(`/protected/groups/${groupId}`);
}

/**
 * 업로드된 영수증 경로가 이 모임의 것인지 확인한다.
 *
 * Storage RLS는 경로의 **첫 세그먼트를 모임 id로 보고** 권한을 판정한다
 * (`woodong_is_group_admin((storage.foldername(name))[1]::uuid)`). 따라서 다른 모임의 총무가
 * 자기 모임 경로로 올린 오브젝트를 이 모임의 지출 행에 매달면, DB 행은 이 모임 소유인데
 * 파일은 저쪽 모임 소유가 되어 조회 권한이 어긋난다. 값을 저장하기 전에 한 번 막는다.
 */
function isOwnGroupReceiptPath(path: string, groupId: string): boolean {
  return path.startsWith(`${groupId}/`);
}

/**
 * 지출 등록 Server Action (Task 035, PRD 3.4-b).
 *
 * 총무 여부를 애플리케이션에서 조회하지 않는다. `woodong_expenses_insert_admin` 정책이
 * `woodong_is_group_admin(group_id)`를 강제하므로 일반회원의 INSERT는 RLS에서 42501로
 * 거부된다(회비 항목 생성과 같은 규약).
 *
 * 영수증 파일 업로드는 이 액션이 하지 않는다. 클라이언트가 Storage에 직접 올린 뒤 경로만
 * 넘긴다(모임 대표 이미지와 동일한 구조). Server Action은 multipart 본문에 5MB 이미지를
 * 실어 보내는 데 적합하지 않고, Storage RLS가 이미 총무만 쓰도록 막고 있다.
 */
export async function createExpenseAction(
  input: CreateExpenseInput,
): Promise<ActionResult<{ expenseId: string }>> {
  const parsed = createExpenseSchema.safeParse(input);
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
    category,
    amount,
    spentAt,
    paidBy,
    memo,
    receiptObjectPath,
  } = parsed.data;

  if (receiptObjectPath && !isOwnGroupReceiptPath(receiptObjectPath, groupId)) {
    return {
      success: false,
      formError: "영수증 업로드 경로가 올바르지 않아요. 다시 첨부해주세요.",
    };
  }

  const { data, error } = await supabase
    .from("woodong_expenses")
    .insert({
      group_id: groupId,
      category,
      amount,
      spent_at: spentAt,
      paid_by: paidBy ?? null,
      memo: memo || null,
      receipt_object_path: receiptObjectPath || null,
      created_by: claimsData.claims.sub,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createExpenseAction] insert failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidateExpensePaths(groupId);
  return { success: true, data: { expenseId: data.id } };
}

/**
 * 지출 수정 Server Action.
 *
 * 영수증을 새로 올려 교체하면 **이전 오브젝트를 삭제**한다. 남겨 두면 아무 행도 가리키지 않는
 * 파일이 비공개 버킷에 계속 쌓여 Free 플랜 용량을 먹는다(`docs/ops/FREE_PLAN_MONITORING.md`).
 * 삭제가 실패해도 수정 자체는 성공으로 처리한다 — 고아 파일 하나 때문에 사용자가 고친 내용을
 * 되돌리는 편이 더 나쁘다.
 */
export async function updateExpenseAction(
  input: UpdateExpenseInput,
): Promise<ActionResult<{ expenseId: string }>> {
  const parsed = updateExpenseSchema.safeParse(input);
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
    expenseId,
    groupId,
    category,
    amount,
    spentAt,
    paidBy,
    memo,
    receiptObjectPath,
  } = parsed.data;

  if (receiptObjectPath && !isOwnGroupReceiptPath(receiptObjectPath, groupId)) {
    return {
      success: false,
      formError: "영수증 업로드 경로가 올바르지 않아요. 다시 첨부해주세요.",
    };
  }

  // 교체 대상을 알아야 하므로 기존 경로를 먼저 읽는다. 못 읽으면(비멤버·삭제됨) 아래 UPDATE도
  // 어차피 0행이 되어 같은 안내로 떨어진다.
  const { data: existing } = await supabase
    .from("woodong_expenses")
    .select("receipt_object_path")
    .eq("id", expenseId)
    .eq("group_id", groupId)
    .maybeSingle();

  const nextPath = receiptObjectPath || null;
  const { error, count } = await supabase
    .from("woodong_expenses")
    .update(
      {
        category,
        amount,
        spent_at: spentAt,
        paid_by: paidBy ?? null,
        memo: memo || null,
        receipt_object_path: nextPath,
      },
      { count: "exact" },
    )
    .eq("id", expenseId)
    .eq("group_id", groupId);

  if (error) {
    console.error("[updateExpenseAction] update failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  // RLS는 권한 없는 UPDATE를 에러가 아니라 **0행**으로 돌려준다. 여기서 걸러 내지 않으면
  // 일반회원에게 "저장했습니다" 토스트가 뜬다.
  if (count === 0) {
    return { success: false, formError: ADMIN_ONLY_MESSAGE };
  }

  const previousPath = existing?.receipt_object_path ?? null;
  if (previousPath && previousPath !== nextPath) {
    const { error: removeError } = await supabase.storage
      .from(WOODONG_RECEIPTS_BUCKET)
      .remove([previousPath]);
    if (removeError) {
      console.error(
        "[updateExpenseAction] stale receipt cleanup failed:",
        removeError,
      );
    }
  }

  revalidateExpensePaths(groupId);
  return { success: true, data: { expenseId } };
}

/** 지출 삭제 Server Action. 영수증 오브젝트도 함께 지운다(사유는 `updateExpenseAction` 참고). */
export async function deleteExpenseAction(
  input: DeleteExpenseInput,
): Promise<ActionResult<undefined>> {
  const parsed = deleteExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, expenseId } = parsed.data;

  const { data: existing } = await supabase
    .from("woodong_expenses")
    .select("receipt_object_path")
    .eq("id", expenseId)
    .eq("group_id", groupId)
    .maybeSingle();

  const { error, count } = await supabase
    .from("woodong_expenses")
    .delete({ count: "exact" })
    .eq("id", expenseId)
    .eq("group_id", groupId);

  if (error) {
    console.error("[deleteExpenseAction] delete failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (count === 0) {
    return { success: false, formError: ADMIN_ONLY_MESSAGE };
  }

  if (existing?.receipt_object_path) {
    const { error: removeError } = await supabase.storage
      .from(WOODONG_RECEIPTS_BUCKET)
      .remove([existing.receipt_object_path]);
    if (removeError) {
      console.error(
        "[deleteExpenseAction] receipt cleanup failed:",
        removeError,
      );
    }
  }

  revalidateExpensePaths(groupId);
  return { success: true, data: undefined };
}
