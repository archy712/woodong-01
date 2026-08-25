"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import type { ActionResult } from "@/lib/woodong/common";

/**
 * 알림 읽음/클릭 처리 Server Action (Task 026).
 *
 * 공지 팬아웃(Task 025)과 달리 **RPC를 쓰지 않는다**. `woodong_notifications`에는
 * `user_id = auth.uid()`인 UPDATE 정책이 이미 있고, Task 003의 컬럼 보호 트리거
 * (`woodong_prevent_unauthorized_notification_update`)가 `read_at`/`clicked_at` 외의
 * 컬럼 변경을 전부 거부한다. 즉 권한 상승이 필요 없고, 오히려 DEFINER로 감싸면
 * 그 트리거가 지켜 주는 보호막을 우리 손으로 우회하는 셈이 된다.
 *
 * 남의 알림을 지정하면 RLS가 에러가 아니라 **0행**으로 응답하므로, 존재 여부를
 * 먼저 SELECT로 확인해 "찾을 수 없음"으로 되돌린다(Task 019~025와 같은 패턴).
 * 있는지/없는지를 구분해서 알려 주면 남의 알림 ID의 존재 자체가 새기 때문에,
 * 타인 알림과 삭제된 알림에 같은 메시지를 쓴다.
 */

const NOT_FOUND_ERROR = "알림을 찾을 수 없어요.";

/** 알림센터와 헤더 종 아이콘 뱃지가 같은 미읽음 데이터에 의존한다. */
function revalidateNotificationPaths() {
  revalidatePath("/protected/notifications");
}

export type MarkNotificationClickedResult = {
  /** 이번 호출로 읽음 처리까지 함께 됐는지(미읽음 상태에서 클릭한 경우). */
  markedRead: boolean;
};

/**
 * 알림 클릭 기록 (KPI "알림 클릭률"의 산출 기반).
 *
 * 클릭은 읽음을 함의하므로 `read_at`이 비어 있으면 함께 채운다. 반대로 **이미 값이 있는
 * 컬럼은 덮어쓰지 않는다** — `read_at`/`clicked_at`은 "처음" 읽고 처음 누른 시각이어야
 * 도달~반응 지연을 계산할 수 있고, 같은 알림을 다시 눌렀다고 지표가 뒤로 밀리면 안 된다.
 *
 * 호출부(알림센터)는 이 Action을 **await한 뒤에 이동**한다. 이동을 먼저 시작하면
 * 브라우저가 진행 중인 요청을 취소해 클릭 기록이 조용히 누락될 수 있다.
 */
export async function markNotificationClickedAction(
  notificationId: string,
): Promise<ActionResult<MarkNotificationClickedResult>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { data: existing, error: selectError } = await supabase
    .from("woodong_notifications")
    .select("id, read_at, clicked_at")
    .eq("id", notificationId)
    .maybeSingle();

  if (selectError) {
    console.error(
      "[markNotificationClickedAction] select failed:",
      selectError,
    );
    return { success: false, formError: mapSupabaseError(selectError) };
  }

  if (!existing) {
    return { success: false, formError: NOT_FOUND_ERROR };
  }

  const now = new Date().toISOString();
  const patch: { read_at?: string; clicked_at?: string } = {};
  if (!existing.read_at) patch.read_at = now;
  if (!existing.clicked_at) patch.clicked_at = now;

  // 이미 읽고 누른 알림을 다시 눌렀다면 쓸 것이 없다. 빈 UPDATE를 보내지 않는다.
  if (Object.keys(patch).length === 0) {
    return { success: true, data: { markedRead: false } };
  }

  const { error, count } = await supabase
    .from("woodong_notifications")
    .update(patch, { count: "exact" })
    .eq("id", notificationId);

  if (error) {
    console.error("[markNotificationClickedAction] update failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: NOT_FOUND_ERROR };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (count === 0) {
    return { success: false, formError: NOT_FOUND_ERROR };
  }

  revalidateNotificationPaths();

  return { success: true, data: { markedRead: patch.read_at !== undefined } };
}

export type MarkAllNotificationsReadResult = {
  /** 이번 호출로 읽음 처리된 알림 수(이미 읽은 것은 제외). */
  markedCount: number;
};

/**
 * 미읽음 알림 일괄 읽음 처리.
 *
 * `clicked_at`은 건드리지 않는다 — 목록에서 "모두 읽음"을 누른 것은 알림을 실제로 열어 본
 * 것이 아니므로, 여기서 클릭까지 찍으면 클릭률 지표가 부풀려진다.
 * 필터는 `read_at is null`뿐이고 대상 범위는 RLS(`user_id = auth.uid()`)가 정한다.
 */
export async function markAllNotificationsReadAction(): Promise<
  ActionResult<MarkAllNotificationsReadResult>
> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { error, count } = await supabase
    .from("woodong_notifications")
    .update({ read_at: new Date().toISOString() }, { count: "exact" })
    .is("read_at", null);

  if (error) {
    console.error("[markAllNotificationsReadAction] update failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidateNotificationPaths();

  return { success: true, data: { markedCount: count ?? 0 } };
}
