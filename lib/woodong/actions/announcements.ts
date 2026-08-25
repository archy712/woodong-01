"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  type Announcement,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "@/lib/woodong/announcements";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import type { ActionResult } from "@/lib/woodong/common";

const ADMIN_ONLY_ERROR = "공지는 총무만 작성할 수 있어요.";

export type CreateAnnouncementResult = {
  announcement: Announcement;
  /** 이번 발송으로 실제 만들어진 앱 내 알림 건수(작성자 본인과 `in_app` 비활성 멤버는 제외). */
  notifiedCount: number;
};

/** 공지 화면과 모임 홈(최근 공지 카드)이 모두 같은 데이터에 의존한다. */
function revalidateAnnouncementPaths(groupId: string) {
  revalidatePath(`/protected/groups/${groupId}/announcements`);
  revalidatePath(`/protected/groups/${groupId}`);
  // 알림센터와 헤더 뱃지는 팬아웃으로 새 알림이 생겼을 수 있다.
  revalidatePath("/protected/notifications");
}

/**
 * 공지 작성 + 앱 내 알림 팬아웃 Server Action (Task 025).
 *
 * 공지 INSERT와 멤버별 알림 INSERT를 애플리케이션에서 두 번 나눠 하면, 두 번째가 실패했을 때
 * **아무에게도 전달되지 않은 공지**가 남고(총무는 발송한 줄 안다) 애플리케이션에서는 되돌릴 방법이
 * 없다. 그래서 두 문장을 `woodong_create_announcement()` 안에 넣어 호출 1회 = 트랜잭션 1개로 만든다.
 *
 * ⚠️ 그 RPC는 다른 우동 팬아웃(`woodong_create_due_cycle`, INVOKER)과 달리 **`SECURITY DEFINER`**다.
 * `woodong_notifications`에는 INSERT 정책이 아예 없어서(본인 행 SELECT/UPDATE만) 어떤 클라이언트도
 * 남의 알림을 만들 수 없기 때문이다. 총무 판정을 RLS에 맡길 수 없으므로 함수가 직접
 * `woodong_is_group_admin()`으로 확인하고, 일반회원 호출은 `42501`로 되돌아온다.
 *
 * ℹ️ `service_role` 키는 이 경로 어디에서도 쓰지 않는다(Edge Function 없음). 키가 클라이언트
 * 번들로 샐 여지 자체가 없다.
 */
export async function createAnnouncementAction(
  input: CreateAnnouncementInput,
): Promise<ActionResult<CreateAnnouncementResult>> {
  const parsed = createAnnouncementSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, title, body } = parsed.data;

  const { data, error } = await supabase.rpc("woodong_create_announcement", {
    p_group_id: groupId,
    p_title: title,
    p_body: body,
  });

  if (error) {
    console.error("[createAnnouncementAction] rpc failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_ERROR };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  if (!row) {
    console.error("[createAnnouncementAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  revalidateAnnouncementPaths(groupId);

  return {
    success: true,
    data: {
      announcement: {
        id: row.announcement_id,
        group_id: row.announcement_group_id,
        title: row.announcement_title,
        body: row.announcement_body,
        created_by: row.announcement_created_by,
        created_at: row.announcement_created_at,
        updated_at: row.announcement_updated_at,
      },
      notifiedCount: row.notified_count,
    },
  };
}

/**
 * 공지 수정 Server Action (Task 025).
 *
 * 작성과 달리 **RPC를 쓰지 않는다** — 수정은 알림 팬아웃이 없어 권한 상승이 필요 없고,
 * `woodong_announcements_update_admin` 정책(`woodong_is_group_admin`)이 이미 총무만 통과시킨다.
 * 권한이 없으면 PostgREST가 에러가 아니라 **0행**으로 응답하므로 `count: "exact"`로 확인해
 * 권한 오류로 되돌린다(Task 019~023과 같은 패턴).
 *
 * `updated_at`은 Task 002의 `woodong_set_updated_at()` 트리거가 갱신하므로 여기서 쓰지 않는다.
 */
export async function updateAnnouncementAction(
  input: UpdateAnnouncementInput,
): Promise<ActionResult<Announcement>> {
  const parsed = updateAnnouncementSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { announcementId, title, body } = parsed.data;

  const { data, error, count } = await supabase
    .from("woodong_announcements")
    .update({ title, body }, { count: "exact" })
    .eq("id", announcementId)
    .select("id, group_id, title, body, created_by, created_at, updated_at");

  if (error) {
    console.error("[updateAnnouncementAction] update failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: "공지는 총무만 수정할 수 있어요." };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  if (!row || count === 0) {
    // RLS가 막았거나(0행) 이미 삭제된 공지다. 둘을 구분할 방법이 없고, 구분해서 알려 주면
    // "그 공지가 존재하는지" 자체가 비멤버에게 새는 정보가 된다.
    return { success: false, formError: "공지는 총무만 수정할 수 있어요." };
  }

  revalidateAnnouncementPaths(row.group_id);

  return { success: true, data: row };
}
