"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import { generateInviteCode } from "@/lib/woodong/invite-code";
import {
  issueGroupInviteSchema,
  redeemGroupInviteSchema,
  revokeGroupInviteSchema,
  type GroupInvite,
  type IssueGroupInviteInput,
  type RedeemGroupInviteInput,
  type RedeemInviteStatus,
  type RevokeGroupInviteInput,
} from "@/lib/woodong/groups";
import type { ActionResult } from "@/lib/woodong/common";

const INVITE_COLUMNS =
  "id, group_id, code, created_by, created_at, expires_at, max_uses, used_count, is_active, revoked_at";

/** 코드가 이미 존재해 `UNIQUE(code)`에 걸렸을 때 다시 뽑아 볼 횟수. */
const MAX_CODE_ATTEMPTS = 5;

const UNIQUE_VIOLATION = "23505";

/** 초대 관련 화면 3곳이 모두 초대 목록에 영향을 받으므로 함께 재검증한다. */
function revalidateInvitePaths(groupId: string) {
  revalidatePath(`/protected/groups/${groupId}/settings`);
  revalidatePath(`/protected/groups/${groupId}`);
}

/**
 * 초대 링크 발급 Server Action (Task 020).
 *
 * **재발급 시 기존 코드 무효화**(PRD 3.2 AC, 9장 "초대 코드 보안"): 새 초대를 만들면 같은 모임의
 * 다른 활성 초대를 전부 `is_active = false` + `revoked_at`으로 내린다. 결과적으로 모임당 살아 있는
 * 초대 링크는 항상 최대 1개이며, 유출된 옛 링크가 계속 살아 있는 상황이 생기지 않는다.
 *
 * ⚠️ 순서가 중요하다: **새 초대를 먼저 INSERT하고 그 다음에 옛 초대를 내린다.** 반대로 하면
 * INSERT가 실패했을 때 "쓸 수 있는 링크가 하나도 없는" 상태로 남는다.
 *
 * `createGroupAction`과 달리 여기서는 `.insert().select()`(PostgREST `Prefer: return=representation`)를
 * 그대로 쓴다. RLS가 `INSERT ... RETURNING`에서 SELECT 정책까지 평가하는 건 동일하지만,
 * `woodong_group_invites`의 SELECT 정책도 INSERT 정책과 똑같이 `woodong_is_group_admin(group_id)`라
 * 삽입에 성공한 사용자는 반드시 조회에도 성공하기 때문이다(모임 생성 때는 아직 멤버가 아니어서
 * SELECT 정책이 거부됐던 것).
 */
export async function issueGroupInviteAction(
  input: IssueGroupInviteInput,
): Promise<ActionResult<GroupInvite>> {
  const parsed = issueGroupInviteSchema.safeParse(input);
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

  const { groupId, expiresAt, maxUses } = parsed.data;

  // `datetime-local` 값("2026-09-01T12:00")은 타임존이 없어 브라우저 로컬 시각으로 해석된다.
  // DB의 timestamptz와 맞추려면 여기서 한 번 ISO(UTC)로 변환해 둬야 한다.
  const expiresAtIso = new Date(expiresAt).toISOString();

  let created: GroupInvite | null = null;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const { data, error } = await supabase
      .from("woodong_group_invites")
      .insert({
        group_id: groupId,
        code: generateInviteCode(),
        created_by: userId,
        expires_at: expiresAtIso,
        max_uses: maxUses,
      })
      .select(INVITE_COLUMNS)
      .single();

    if (!error) {
      created = data;
      break;
    }

    lastError = error;

    // 코드 충돌(1.1조분의 1)만 재시도한다. 권한 오류 등은 재시도해도 결과가 같다.
    if (error.code !== UNIQUE_VIOLATION) break;
  }

  if (!created) {
    console.error("[issueGroupInviteAction] insert failed:", lastError);
    if (isRlsError(lastError)) {
      return {
        success: false,
        formError: "초대 링크는 총무만 발급할 수 있어요.",
      };
    }
    return { success: false, formError: mapSupabaseError(lastError) };
  }

  const { error: revokeError } = await supabase
    .from("woodong_group_invites")
    .update({ is_active: false, revoked_at: new Date().toISOString() })
    .eq("group_id", groupId)
    .eq("is_active", true)
    .neq("id", created.id);

  if (revokeError) {
    // 새 링크는 이미 만들어졌으므로 발급 자체는 성공으로 처리하고, 옛 링크가 남았다는 사실만
    // 서버 로그로 남긴다(총무가 목록에서 직접 무효화할 수 있다).
    console.error(
      "[issueGroupInviteAction] revoking previous invites failed:",
      revokeError,
    );
  }

  revalidateInvitePaths(groupId);
  return { success: true, data: created };
}

/**
 * 초대 링크 무효화 Server Action (Task 020).
 *
 * 총무 판정은 `woodong_group_invites_update_admin` RLS 정책이 강제한다. 일반회원이 호출하면
 * UPDATE 대상이 0행이 되는데 PostgREST는 이를 에러가 아니라 "0행 갱신"으로 돌려주므로,
 * `count: "exact"`로 확인해 권한 오류로 되돌린다(조용히 성공한 것처럼 보이면 안 된다 —
 * `updateGroupAction`과 같은 패턴).
 *
 * 이미 무효화된 초대를 다시 무효화해도 0행이라 권한 오류처럼 보이므로, `is_active = true`
 * 조건은 걸지 않고 `revoked_at`만 덮어쓴다(멱등).
 */
export async function revokeGroupInviteAction(
  input: RevokeGroupInviteInput,
): Promise<ActionResult<undefined>> {
  const parsed = revokeGroupInviteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, inviteId } = parsed.data;

  const { error, count } = await supabase
    .from("woodong_group_invites")
    .update(
      { is_active: false, revoked_at: new Date().toISOString() },
      { count: "exact" },
    )
    .eq("id", inviteId)
    .eq("group_id", groupId);

  if (error) {
    console.error("[revokeGroupInviteAction] update failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return {
      success: false,
      formError: "초대 링크는 총무만 무효화할 수 있어요.",
    };
  }

  revalidateInvitePaths(groupId);
  return { success: true, data: undefined };
}

/** 참여 실패 사유별 사용자 문구. 성공(joined/already_member)은 화면에서 처리한다. */
const REDEEM_FAILURE_MESSAGES: Record<
  Exclude<RedeemInviteStatus, "joined" | "already_member">,
  string
> = {
  unauthenticated: "로그인이 필요합니다.",
  not_found: "유효하지 않은 초대 코드예요.",
  expired: "이 초대 링크는 만료됐어요. 총무에게 새 링크를 요청해주세요.",
  revoked: "이 초대 링크는 무효화됐어요. 총무에게 새 링크를 요청해주세요.",
  exhausted:
    "이 초대 링크는 사용 가능 횟수를 모두 채웠어요. 총무에게 새 링크를 요청해주세요.",
};

/**
 * 초대 코드로 모임 참여 Server Action (Task 020).
 *
 * 실제 검증·카운트 증가·멤버십 등록은 전부 `woodong_redeem_group_invite()` RPC 안에서
 * **한 트랜잭션**으로 처리된다. 애플리케이션에서 나눠 하면 (a) 초대 SELECT가 총무 전용이라
 * 조건 검증 자체가 불가능하고, (b) `woodong_group_members` INSERT 정책이 "자기 모임 admin
 * 자기등록"만 허용해 member 행을 넣을 수 없으며, (c) 나눠 하더라도 "카운트만 늘고 가입은 실패"
 * 같은 부분 실패가 생긴다.
 *
 * 이미 멤버인 사용자의 재접속은 **에러가 아니다**. `UNIQUE(group_id, user_id)` 위반을
 * `mapSupabaseError()`가 "이미 존재하는 데이터입니다"로 바꿔 보여주면 안 되므로,
 * RPC가 아예 INSERT를 시도하지 않고 `already_member` 상태로 돌려준다(PRD 3.2 AC).
 */
export async function redeemGroupInviteAction(
  input: RedeemGroupInviteInput,
): Promise<
  ActionResult<{ status: "joined" | "already_member"; groupId: string }>
> {
  const parsed = redeemGroupInviteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("woodong_redeem_group_invite", {
    p_code: parsed.data.code,
  });

  if (error) {
    console.error("[redeemGroupInviteAction] rpc failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  const status = (row?.status ?? "not_found") as RedeemInviteStatus;

  if (status === "joined" || status === "already_member") {
    if (!row?.group_id) {
      console.error(
        "[redeemGroupInviteAction] missing group_id for status:",
        status,
      );
      return { success: false, formError: REDEEM_FAILURE_MESSAGES.not_found };
    }

    // 참여로 "내 모임" 목록과 모임 상세(멤버 수)가 모두 바뀐다.
    revalidatePath("/protected/groups");
    revalidateInvitePaths(row.group_id);

    return { success: true, data: { status, groupId: row.group_id } };
  }

  return {
    success: false,
    formError:
      REDEEM_FAILURE_MESSAGES[status] ?? REDEEM_FAILURE_MESSAGES.not_found,
  };
}
