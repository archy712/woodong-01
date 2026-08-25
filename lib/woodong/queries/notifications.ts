import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type { Notification } from "@/lib/woodong/notifications";

/**
 * 알림 조회 헬퍼 (Task 026).
 *
 * 다른 `queries/*`와 같은 규약으로 **사용자 세션 클라이언트**를 받아 RLS 아래에서만 동작한다.
 * `woodong_notifications`의 SELECT 정책은 `user_id = auth.uid()` 하나뿐이라, 필터를 붙이지
 * 않아도 남의 알림은 애초에 0행이다. 그럼에도 아래 쿼리들은 `user_id`를 명시하지 않는데,
 * **정책이 이미 유일한 필터**이고 여기에 앱 레벨 필터를 덧대면 "정책이 없어도 안전하다"는
 * 착각을 주기 때문이다(Task 025의 REST 검증에서 필터 없는 요청도 본인 것만 온다고 확인했다).
 */

type Client = SupabaseClient<Database>;

/** 알림센터가 한 번에 읽는 최대 건수. 페이지네이션은 1차 범위 밖이라 최신 N건으로 자른다. */
export const NOTIFICATIONS_PAGE_SIZE = 50;

const NOTIFICATION_COLUMNS =
  "id, group_id, user_id, type, related_type, related_id, channel, status, title, body, read_at, clicked_at, created_at";

/**
 * 알림센터 목록 항목 — 알림 레코드에 모임 이름을 얹은 것.
 *
 * 알림은 여러 모임에서 섞여 오므로 "어느 모임 소식인지"가 목록에서 바로 보여야 한다.
 * 모임 이름은 FK 임베드로 한 번에 가져오고, 탈퇴 등으로 모임을 읽을 수 없으면 `null`이 된다.
 */
export type NotificationListItem = Notification & { group_name: string | null };

type NotificationRow = Notification & {
  woodong_groups: { name: string } | null;
};

/** 로그인 사용자의 알림 목록. 최신순. 실패해도 throw하지 않고 빈 배열로 폴백한다. */
export async function listMyNotifications(
  supabase: Client,
  limit = NOTIFICATIONS_PAGE_SIZE,
): Promise<NotificationListItem[]> {
  const { data, error } = await supabase
    .from("woodong_notifications")
    .select(`${NOTIFICATION_COLUMNS}, woodong_groups(name)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[queries/notifications] listMyNotifications failed:", error);
    return [];
  }

  return ((data ?? []) as NotificationRow[]).map(
    ({ woodong_groups, ...notification }) => ({
      ...notification,
      group_name: woodong_groups?.name ?? null,
    }),
  );
}

/**
 * 헤더 종 아이콘 뱃지용 미읽음 개수.
 *
 * 행 본문은 필요 없으므로 `head: true` + `count: "exact"`로 개수만 받는다(모든 라우트의
 * 헤더에서 매 요청 실행되는 쿼리라 페이로드를 0으로 유지한다). 실패 시 0을 반환해 뱃지를
 * 숨긴다 — 헤더 하나 때문에 페이지 전체가 깨지면 안 된다.
 */
export async function countUnreadNotifications(
  supabase: Client,
): Promise<number> {
  const { count, error } = await supabase
    .from("woodong_notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  if (error) {
    console.error(
      "[queries/notifications] countUnreadNotifications failed:",
      error,
    );
    return 0;
  }

  return count ?? 0;
}
