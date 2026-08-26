import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  getSignedStorageUrl,
  WOODONG_COVERS_BUCKET,
} from "@/lib/supabase/storage";
import { isTransientJwtError } from "@/lib/woodong/errors";
import type { Group, GroupMemberRole } from "@/lib/woodong/groups";

/**
 * 모임 조회 헬퍼 (Task 019).
 *
 * 뮤테이션은 `lib/woodong/actions/`, 읽기는 이 디렉토리로 나눈다. 모든 함수는 호출부에서
 * 만든 **사용자 세션 클라이언트**를 받아 RLS 아래에서 동작한다(service role 사용 금지).
 * 비멤버는 `woodong_groups_select_member` 정책 때문에 애초에 0행을 받으므로,
 * "권한 없음"과 "존재하지 않음"이 화면에서 동일하게 처리된다(존재 여부 노출 방지).
 */

export type MyGroupSummary = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  memberCount: number;
  role: GroupMemberRole;
};

/**
 * `listMyGroups()`의 반환값.
 *
 * **"조회 실패"와 "결과 0건"을 반드시 구분해야 한다.** 예전에는 실패 시 빈 배열을 돌려줬는데,
 * 화면에서는 그게 "아직 속한 모임이 없어요" 빈 상태와 완전히 같아 보였다. 모임이 있는
 * 사용자에게 없다고 말하는 셈이라, 타입 차원에서 두 경우가 섞이지 않게 막는다.
 */
export type MyGroupsResult =
  { ok: true; groups: MyGroupSummary[] } | { ok: false };

export type GroupDetail = {
  group: Group;
  /** 현재 사용자의 역할. 멤버가 아니면 이 함수 자체가 null을 반환한다. */
  role: GroupMemberRole;
  memberCount: number;
  /** 대표 이미지 서명 URL(비공개 버킷이라 매 요청 발급). 없으면 null. */
  coverUrl: string | null;
};

export type GroupMemberRow = {
  id: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: string | null;
  isMe: boolean;
  /** `profiles.name`. 아직 프로필에 이름을 채우지 않은 사용자는 null. */
  name: string | null;
  /** 총무 또는 본인에게만 채워진다(RPC에서 분기). 그 외에는 null. */
  email: string | null;
  /** 총무 또는 본인에게만 채워진다(RPC에서 분기). 그 외에는 null. */
  phoneNumber: string | null;
  /** `woodong_profiles.avatar_key`. 미설정이면 null(호출부에서 기본 아바타로 폴백). */
  avatarKey: string | null;
};

type Client = SupabaseClient<Database>;

/** 활성 멤버 수를 모임별로 집계한다. */
async function countActiveMembers(
  supabase: Client,
  groupIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (groupIds.length === 0) return counts;

  const { data, error } = await supabase
    .from("woodong_group_members")
    .select("group_id")
    .in("group_id", groupIds)
    .eq("status", "active");

  if (error) {
    console.error("[queries/groups] member count failed:", error);
    return counts;
  }

  for (const row of data ?? []) {
    counts.set(row.group_id, (counts.get(row.group_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * 로그인 직후의 시계 스큐(`PGRST303`)를 넘기기 위한 재시도 간격(ms).
 *
 * `iat`가 미래로 보이는 차이는 보통 1초 미만이라 두 번이면 충분하고, 지연은 **실패한
 * 경우에만** 붙는다. 여기서 더 길게 기다리면 정상 경로가 아니라 장애 상황의 체감만 나빠진다.
 */
const TRANSIENT_RETRY_DELAYS_MS = [250, 600];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 내가 활성 멤버로 속한 모임 목록. 최근 가입 순. */
export async function listMyGroups(
  supabase: Client,
  userId: string,
): Promise<MyGroupsResult> {
  // 멤버십에서 출발해야 "내 모임"만 정확히 걸러진다(모임에서 출발하면 RLS가 걸러주긴 하지만
  // 내 역할을 함께 얻으려면 어차피 멤버십 행이 필요하다).
  const runQuery = () =>
    supabase
      .from("woodong_group_members")
      .select(
        "role, joined_at, group:woodong_groups(id, name, description, type)",
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .order("joined_at", { ascending: false });

  let { data, error } = await runQuery();

  // 로그인 직후 첫 조회는 시계 스큐로 한 번 튕길 수 있다. 이 경우에만 짧게 재시도한다
  // (RLS 위반이나 스키마 오류처럼 다시 해도 같은 결과인 실패까지 재시도하면 응답만 느려진다).
  for (const delay of TRANSIENT_RETRY_DELAYS_MS) {
    if (!error || !isTransientJwtError(error)) break;
    console.warn(
      `[queries/groups] listMyGroups transient failure, retrying in ${delay}ms:`,
      error.code,
    );
    await sleep(delay);
    ({ data, error } = await runQuery());
  }

  if (error) {
    console.error("[queries/groups] listMyGroups failed:", error);
    return { ok: false };
  }

  const rows = (data ?? []).filter(
    (row): row is typeof row & { group: NonNullable<typeof row.group> } =>
      row.group !== null,
  );
  const counts = await countActiveMembers(
    supabase,
    rows.map((row) => row.group.id),
  );

  return {
    ok: true,
    groups: rows.map((row) => ({
      id: row.group.id,
      name: row.group.name,
      description: row.group.description,
      type: row.group.type,
      memberCount: counts.get(row.group.id) ?? 0,
      role: row.role as GroupMemberRole,
    })),
  };
}

/**
 * 모임 상세. 비멤버이거나 없는 모임이면 null.
 *
 * ⚠️ **조회 실패는 null이 아니라 throw다**(Task 033). null은 "없음/비멤버"라는 뜻이고
 * 화면은 그걸 "모임을 찾을 수 없거나 접근 권한이 없어요"로 그린다 — 두 경우를 같이 처리하는
 * 건 존재 여부를 숨기려는 의도된 설계지만, **조회가 실패한 것까지 여기 섞으면 멀쩡한 멤버가
 * 자기가 쫓겨난 줄 알게 된다**(같은 우려가 `app/invite/[code]/page.tsx`에도 적혀 있다).
 * throw하면 `app/error.tsx`가 "일시적인 오류 + 다시 시도"로 받아 준다.
 */
export async function getGroupDetail(
  supabase: Client,
  groupId: string,
  userId: string,
): Promise<GroupDetail | null> {
  // 셋 다 `groupId`/`userId`만 있으면 되고 서로의 결과를 쓰지 않는다. 예전에는 줄줄이
  // await해서 왕복 3회가 순차로 쌓였는데, 이 화면의 LCP는 사실상 왕복 횟수에 비례한다
  // (Task 033 프로덕션 실측: 모임 홈 LCP 4.7s, TTFB는 0.23s이고 스트리밍 완료가 2.3s).
  //
  // 모임이 없거나 비멤버여도 나머지 쿼리가 헛돌 뿐 결과는 같다 — 그 경우는 어차피 null을
  // 돌려주고 끝이라, 흔한 성공 경로를 빠르게 만드는 쪽이 이득이다.
  const [groupResult, membershipResult, counts] = await Promise.all([
    supabase
      .from("woodong_groups")
      .select(
        "id, name, description, type, cover_image_object_path, default_due_amount, created_by, created_at",
      )
      .eq("id", groupId)
      .maybeSingle(),
    supabase
      .from("woodong_group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle(),
    countActiveMembers(supabase, [groupId]),
  ]);

  const { data: group, error } = groupResult;
  if (error) {
    console.error("[queries/groups] getGroupDetail failed:", error);
    throw error;
  }
  if (!group) return null;

  // 위와 같은 이유로 여기서도 실패를 삼키지 않는다 — 에러를 버리면 `membership`이 null이 되어
  // "비멤버"와 구별되지 않는다.
  const { data: membership, error: membershipError } = membershipResult;
  if (membershipError) {
    console.error(
      "[queries/groups] getGroupDetail membership lookup failed:",
      membershipError,
    );
    throw membershipError;
  }
  if (!membership) return null;

  // 서명 URL만은 `group.cover_image_object_path`를 알아야 해서 위 묶음에 넣을 수 없다.
  // 대표 이미지가 없는 모임(대부분)은 이 왕복 자체가 생기지 않는다.
  const coverUrl = group.cover_image_object_path
    ? await getSignedStorageUrl(
        supabase,
        WOODONG_COVERS_BUCKET,
        group.cover_image_object_path,
      )
    : null;

  return {
    group,
    role: membership.role as GroupMemberRole,
    memberCount: counts.get(groupId) ?? 0,
    coverUrl,
  };
}

/**
 * 모임의 활성 멤버 목록 (Task 021).
 *
 * 이름/연락처는 공유 `profiles`에 있는데, 그 테이블의 SELECT 정책이 **본인 행 또는 앱 관리자**로
 * 제한돼 있어 총무라도 다른 멤버의 이름을 읽을 수 없다(Task 019에서 확인). 공유 테이블의 정책은
 * 다른 앱과 함께 쓰므로 건드리지 않고, 우동 전용 `SECURITY DEFINER` RPC
 * `woodong_list_group_members()`로 필요한 최소 필드만 가져온다.
 *
 * 이메일/전화번호는 RPC가 **총무 또는 본인에게만** 채워 주고 그 외에는 null로 내려준다
 * (일반회원끼리 서로의 연락처를 볼 이유가 없다). 비멤버 호출은 빈 배열이다.
 */
export async function listGroupMembers(
  supabase: Client,
  groupId: string,
  userId: string,
): Promise<GroupMemberRow[]> {
  const { data, error } = await supabase.rpc("woodong_list_group_members", {
    p_group_id: groupId,
  });

  if (error) {
    console.error("[queries/groups] listGroupMembers failed:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.membership_id,
    userId: row.member_user_id,
    role: row.member_role as GroupMemberRole,
    joinedAt: row.member_joined_at,
    isMe: row.member_user_id === userId,
    name: row.member_name,
    email: row.member_email,
    phoneNumber: row.member_phone,
    avatarKey: row.member_avatar_key,
  }));
}
