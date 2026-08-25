import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type { Announcement } from "@/lib/woodong/announcements";

/**
 * 공지 조회 헬퍼 (Task 025).
 *
 * `queries/dues.ts`·`queries/groups.ts`와 같은 규약: 호출부가 만든 **사용자 세션 클라이언트**를
 * 받아 RLS 아래에서만 동작한다(service role 금지). `woodong_announcements`의 SELECT 정책이
 * `woodong_is_group_member(group_id)`라 비멤버는 애초에 0행을 받는다.
 */

type Client = SupabaseClient<Database>;

const ANNOUNCEMENT_COLUMNS =
  "id, group_id, title, body, created_by, created_at, updated_at";

/** 모임의 공지 목록. 최신 작성 순. 실패해도 throw하지 않고 빈 배열로 폴백한다. */
export async function listAnnouncements(
  supabase: Client,
  groupId: string,
): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("woodong_announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries/announcements] listAnnouncements failed:", error);
    return [];
  }

  return data ?? [];
}

/** 모임 홈의 "최근 공지" 카드용 — 최신 N건만. */
export async function listRecentAnnouncements(
  supabase: Client,
  groupId: string,
  limit = 3,
): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("woodong_announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      "[queries/announcements] listRecentAnnouncements failed:",
      error,
    );
    return [];
  }

  return data ?? [];
}
