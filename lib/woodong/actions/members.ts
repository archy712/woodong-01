"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  isLastAdminError,
  mapSupabaseError,
  LAST_ADMIN_ERROR_MESSAGE,
} from "@/lib/woodong/errors";
import {
  removeGroupMemberSchema,
  updateMemberRoleSchema,
  type RemoveGroupMemberInput,
  type UpdateMemberRoleInput,
} from "@/lib/woodong/groups";
import type { ActionResult } from "@/lib/woodong/common";

/**
 * 멤버 역할 변경·제외 Server Action (Task 021).
 *
 * 권한 판정은 전적으로 `woodong_group_members_update_admin`(`woodong_is_group_admin(group_id)`)
 * RLS 정책이 한다. 일반회원이 호출하면 UPDATE 대상이 0행이 되는데 PostgREST는 이를 에러가 아니라
 * "0행 갱신"으로 돌려주므로 `count: "exact"`로 확인해 권한 오류로 되돌린다(조용히 성공한 것처럼
 * 보이면 안 된다 — `updateGroupAction`/`revokeGroupInviteAction`과 같은 패턴).
 *
 * 마지막 총무 보호는 DB 트리거(`woodong_prevent_last_admin_change`, Task 003)가 강제한다.
 * 애플리케이션에서 "admin 수를 세고 1이면 막는" 식으로 구현하면 두 총무가 동시에 서로를 강등할 때
 * 둘 다 통과해 총무가 0명이 되는 경합이 생긴다. 여기서는 트리거가 올린 예외를 사용자 문구로
 * 옮기는 일만 하고, UI(버튼 비활성)는 세 번째 방어선일 뿐이다.
 */

/** 역할 변경/제외는 설정 화면·상세(멤버 수)·목록(내 역할 뱃지)에 모두 영향을 준다. */
function revalidateMemberPaths(groupId: string) {
  revalidatePath(`/protected/groups/${groupId}/settings`);
  revalidatePath(`/protected/groups/${groupId}`);
  revalidatePath("/protected/groups");
}

export async function updateMemberRoleAction(
  input: UpdateMemberRoleInput,
): Promise<ActionResult<{ role: "admin" | "member"; isSelf: boolean }>> {
  const parsed = updateMemberRoleSchema.safeParse(input);
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

  const { groupId, memberId, role } = parsed.data;

  // 대상이 나 자신인지는 화면 갱신 방식(자기 강등 시 설정 화면이 일반회원 뷰로 바뀐다)을 정하는
  // 데 쓴다. 권한 판정에는 쓰지 않으므로 조회 실패는 치명적이지 않다.
  const { data: target } = await supabase
    .from("woodong_group_members")
    .select("user_id")
    .eq("id", memberId)
    .eq("group_id", groupId)
    .maybeSingle();

  const { error, count } = await supabase
    .from("woodong_group_members")
    .update({ role }, { count: "exact" })
    .eq("id", memberId)
    .eq("group_id", groupId)
    .eq("status", "active");

  if (error) {
    console.error("[updateMemberRoleAction] update failed:", error);
    if (isLastAdminError(error)) {
      return { success: false, formError: LAST_ADMIN_ERROR_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return {
      success: false,
      formError: "멤버 역할은 총무만 변경할 수 있어요.",
    };
  }

  revalidateMemberPaths(groupId);
  return {
    success: true,
    data: { role, isSelf: target?.user_id === userId },
  };
}

/**
 * 멤버 제외(총무가 다른 멤버를 내보냄) 및 모임 나가기(총무가 자기 자신을 제외) Server Action.
 *
 * 두 경우가 같은 액션인 이유: `woodong_group_members`의 UPDATE 정책이 총무 전용이라 SQL 레벨에서
 * 완전히 동일한 조작이고, "마지막 총무는 나갈 수 없다"는 규칙도 같은 트리거가 처리한다.
 * 일반회원의 자발적 탈퇴는 UPDATE 정책상 아직 불가능하며 1차 MVP 범위 밖이다(PRD 3.2 AC에도 없음).
 *
 * ⚠️ 자기 자신을 제외하는 경우에도 RLS는 통과한다. `woodong_is_group_admin()`이 UPDATE 문의
 * 스냅샷(변경 전 상태)을 보기 때문이며, 커밋 후에야 멤버가 아니게 된다.
 */
export async function removeGroupMemberAction(
  input: RemoveGroupMemberInput,
): Promise<ActionResult<{ isSelf: boolean }>> {
  const parsed = removeGroupMemberSchema.safeParse(input);
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

  const { groupId, memberId } = parsed.data;

  const { data: target } = await supabase
    .from("woodong_group_members")
    .select("user_id")
    .eq("id", memberId)
    .eq("group_id", groupId)
    .maybeSingle();

  const { error, count } = await supabase
    .from("woodong_group_members")
    .update({ status: "left" }, { count: "exact" })
    .eq("id", memberId)
    .eq("group_id", groupId)
    .eq("status", "active");

  if (error) {
    console.error("[removeGroupMemberAction] update failed:", error);
    if (isLastAdminError(error)) {
      return { success: false, formError: LAST_ADMIN_ERROR_MESSAGE };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return {
      success: false,
      formError: "멤버를 내보낼 권한이 없어요. 총무에게 요청해주세요.",
    };
  }

  revalidateMemberPaths(groupId);
  return { success: true, data: { isSelf: target?.user_id === userId } };
}
