import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  CHANNEL_DEFAULT_ENABLED,
  type Notification,
  type NotificationChannel,
  type NotificationPreference,
  type NotificationType,
} from "@/lib/woodong/notifications";

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

/**
 * 알림센터 필터 (Task 040).
 *
 * **필터는 클라이언트가 아니라 여기서 건다.** 목록은 최신 `NOTIFICATIONS_PAGE_SIZE`건으로
 * 잘리는데, 받아 온 50건을 화면에서 거르면 "회비 알림만" 골랐을 때 그 50건 안에 회비 알림이
 * 3건뿐이면 3건만 보인다 — 더 오래된 회비 알림은 애초에 오지도 않았다. 조건을 쿼리에 실으면
 * 잘림이 필터 **뒤에** 적용돼 "회비 알림 최신 50건"이 된다.
 */
export type NotificationFilters = {
  /** 알림 유형. 없으면 전체. */
  type?: NotificationType;
  /** 미읽음만 보기. */
  unreadOnly?: boolean;
};

/**
 * 로그인 사용자의 알림 목록. 최신순. 실패해도 throw하지 않고 빈 배열로 폴백한다.
 *
 * ⚠️ `channel = 'in_app'`으로 거른다(Task 038). 웹 푸시를 켠 사용자는 한 사건에 대해
 * `in_app` 행과 `web_push` 행을 **둘 다** 갖게 되는데, 후자는 기기로 보낸 발송 기록이지
 * 알림센터에 쌓일 항목이 아니다. 거르지 않으면 같은 알림이 목록에 두 번 뜬다.
 *
 * 웹 푸시가 끝내 실패한 경우는 `woodong_mark_push_failed`가 `in_app` 행을
 * `fallback_sent`로 새로 만들어 주므로(PRD 4.4), 이 필터로도 정보를 놓치지 않는다.
 *
 * 같은 이유로 **채널 필터는 제공하지 않는다**(Task 040). 알림센터에 들어올 수 있는 채널은
 * `in_app` 하나뿐이라 선택지가 하나인 필터가 되고, `web_push`를 고르면 항상 0건이다.
 */
export async function listMyNotifications(
  supabase: Client,
  filters: NotificationFilters = {},
  limit = NOTIFICATIONS_PAGE_SIZE,
): Promise<NotificationListItem[]> {
  let query = supabase
    .from("woodong_notifications")
    .select(`${NOTIFICATION_COLUMNS}, woodong_groups(name)`)
    .eq("channel", "in_app");

  if (filters.type) {
    query = query.eq("type", filters.type);
  }
  if (filters.unreadOnly) {
    query = query.is("read_at", null);
  }

  const { data, error } = await query
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
    .eq("channel", "in_app")
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

/** 마이페이지 채널 설정이 화면에 그리는 단위 — 저장된 행이 없어도 채널마다 항상 한 줄이 나온다. */
export type ChannelPreference = {
  channel: NotificationChannel;
  enabled: boolean;
  /**
   * `web_push`의 Push 구독 정보(JSON)가 저장돼 있는지.
   *
   * 켜져 있어도 이 값이 `false`면 보낼 곳이 없다는 뜻이라 팬아웃 대상에서 빠진다
   * (`woodong_notification_channels`). 화면은 이 값으로 "지금 이 브라우저로 받는 중"
   * 안내를 그린다.
   */
  hasDestination: boolean;
};

/** 화면에 그리는 순서. `in_app`이 항상 받을 수 있는 기본 채널이라 위에 둔다. */
export const CHANNEL_ORDER: NotificationChannel[] = ["in_app", "web_push"];

/**
 * 로그인 사용자의 채널별 알림 설정 (Task 027).
 *
 * 저장된 행이 하나도 없는 사용자가 정상이므로(설정을 만든 적 없는 상태), 조회 결과를 그대로
 * 쓰지 않고 **채널 목록을 기준으로 채워서** 돌려준다. 없는 채널의 기본값은
 * `CHANNEL_DEFAULT_ENABLED`가 정하며, 그 값은 팬아웃 RPC의 `coalesce(p.enabled, true)`와
 * 맞춰져 있다(어긋나면 화면에는 켜져 있는데 실제로는 안 오거나 그 반대가 된다).
 */
export async function listMyChannelPreferences(
  supabase: Client,
): Promise<ChannelPreference[]> {
  const { data, error } = await supabase
    .from("woodong_notification_preferences")
    .select("id, user_id, channel, enabled, destination, updated_at");

  if (error) {
    console.error(
      "[queries/notifications] listMyChannelPreferences failed:",
      error,
    );
  }

  const saved = (data ?? []) as NotificationPreference[];

  return CHANNEL_ORDER.map((channel) => {
    const row = saved.find((p) => p.channel === channel);
    return {
      channel,
      enabled: row?.enabled ?? CHANNEL_DEFAULT_ENABLED[channel],
      hasDestination: Boolean(row?.destination),
    };
  });
}
