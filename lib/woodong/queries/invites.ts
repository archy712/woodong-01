import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { normalizeInviteCode } from "@/lib/woodong/invite-code";
import type {
  GroupInvite,
  InvitePreview,
  InviteStatus,
} from "@/lib/woodong/groups";

/**
 * 초대 조회 헬퍼 (Task 020).
 *
 * `queries/groups.ts`와 같은 규약을 따른다: 호출부가 만든 **사용자 세션 클라이언트**를 받아
 * RLS 아래에서 동작하고(service role 금지), 실패는 throw하지 않고 안전한 기본값으로 폴백한다.
 */

type Client = SupabaseClient<Database>;

const INVITE_COLUMNS =
  "id, group_id, code, created_by, created_at, expires_at, max_uses, used_count, is_active, revoked_at";

/** RPC가 돌려주는 status 문자열을 도메인 유니온으로 좁힌다. 모르는 값은 안전하게 not_found 취급. */
function toInviteStatus(value: string | null | undefined): InviteStatus {
  switch (value) {
    case "valid":
    case "expired":
    case "revoked":
    case "exhausted":
      return value;
    default:
      return "not_found";
  }
}

const NOT_FOUND_PREVIEW: InvitePreview = {
  status: "not_found",
  groupId: null,
  groupName: null,
  groupDescription: null,
  groupType: null,
  memberCount: 0,
  isMember: false,
};

/**
 * 초대 코드 미리보기 (공개 라우트 `/invite/[code]` 전용).
 *
 * `woodong_group_invites`의 SELECT 정책이 총무 전용이라 테이블을 직접 읽을 수 없고,
 * `woodong_get_invite_preview()`(SECURITY DEFINER, anon 실행 허용)를 거쳐야 한다.
 * 비로그인 사용자도 호출하므로 세션이 없어도 정상 동작한다.
 */
export async function getInvitePreview(
  supabase: Client,
  code: string,
): Promise<InvitePreview> {
  const { data, error } = await supabase.rpc("woodong_get_invite_preview", {
    p_code: normalizeInviteCode(code),
  });

  if (error) {
    console.error("[queries/invites] getInvitePreview failed:", error);
    return NOT_FOUND_PREVIEW;
  }

  // `returns table (...)`이라 PostgREST는 항상 배열로 돌려준다(행은 0개 또는 1개).
  const row = data?.[0];
  if (!row) return NOT_FOUND_PREVIEW;

  return {
    status: toInviteStatus(row.status),
    groupId: row.group_id,
    groupName: row.group_name,
    groupDescription: row.group_description,
    groupType: row.group_type,
    memberCount: Number(row.member_count ?? 0),
    isMember: Boolean(row.is_member),
  };
}

/**
 * 모임의 초대 목록. 최근 발급 순.
 *
 * SELECT 정책이 `woodong_is_group_admin(group_id)`이라 **일반회원이 호출하면 빈 배열**이
 * 돌아온다(에러가 아니다). 호출부에서 총무 여부로 화면을 먼저 갈라 두는 것이 낫다.
 */
export async function listGroupInvites(
  supabase: Client,
  groupId: string,
): Promise<GroupInvite[]> {
  const { data, error } = await supabase
    .from("woodong_group_invites")
    .select(INVITE_COLUMNS)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries/invites] listGroupInvites failed:", error);
    return [];
  }

  return data ?? [];
}
