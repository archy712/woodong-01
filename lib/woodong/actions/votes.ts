"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  createVoteSchema,
  submitVoteResponseSchema,
  type CreateVoteInput,
  type SubmitVoteResponseInput,
} from "@/lib/woodong/votes";
import { isRlsError, mapSupabaseError } from "@/lib/woodong/errors";
import type { ActionResult } from "@/lib/woodong/common";

const ADMIN_ONLY_ERROR = "투표는 총무만 만들 수 있어요.";
const CLOSE_ADMIN_ONLY_ERROR = "투표는 총무만 마감할 수 있어요.";
const CLOSED_VOTE_ERROR = "이미 마감된 투표예요.";
const DUPLICATE_VOTE_ERROR = "이미 이 투표에 참여했어요.";

/** 투표 화면과 모임 홈("진행 중인 투표" 카드)이 같은 데이터에 의존한다. */
function revalidateVotePaths(groupId: string, voteId?: string) {
  revalidatePath(`/protected/groups/${groupId}/votes`);
  revalidatePath(`/protected/groups/${groupId}`);
  if (voteId) {
    revalidatePath(`/protected/groups/${groupId}/votes/${voteId}`);
  }
  // 팬아웃으로 새 알림이 생겼을 수 있다.
  revalidatePath("/protected/notifications");
}

export type CreateVoteResult = {
  voteId: string;
  /** 이번 생성으로 실제 만들어진 앱 내 알림 건수(작성자 본인과 `in_app` 비활성 멤버는 제외). */
  notifiedCount: number;
};

/**
 * 투표 생성 + "새 투표 시작" 알림 팬아웃 Server Action (Task 029).
 *
 * 공지(Task 025)와 같은 이유로 `woodong_create_vote()` `SECURITY DEFINER` RPC 한 번으로
 * 처리한다: 알림 INSERT는 어떤 클라이언트에도 열려 있지 않고, 투표·선택지·알림이 한
 * 트랜잭션이어야 "선택지 없는 투표"나 "아무도 모르는 투표"가 남지 않는다.
 *
 * 알림 문구는 i18n 사전에서 넘긴다(RPC에도 한국어 기본값이 있다 — 2차 pg_cron 배치처럼
 * 사용자 로케일이 없는 호출자를 위해서다).
 */
export async function createVoteAction(
  input: CreateVoteInput & {
    notificationTitle?: string;
    notificationBody?: string;
  },
): Promise<ActionResult<CreateVoteResult>> {
  const parsed = createVoteSchema.safeParse(input);
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
    title,
    voteType,
    options,
    allowMultiple,
    isAnonymous,
    closesAt,
  } = parsed.data;

  const { data, error } = await supabase.rpc("woodong_create_vote", {
    p_group_id: groupId,
    p_title: title,
    p_vote_type: voteType,
    p_allow_multiple: allowMultiple,
    p_is_anonymous: isAnonymous,
    // `datetime-local` 값은 타임존이 없는 문자열이라 그대로 보내면 DB가 UTC로 읽는다.
    // 브라우저 기준 시각으로 해석한 뒤 ISO(오프셋 포함)로 변환해서 넘긴다.
    p_closes_at: new Date(closesAt).toISOString(),
    p_options: options.map((option) => option.label),
    ...(input.notificationTitle
      ? { p_notification_title: input.notificationTitle }
      : {}),
    ...(input.notificationBody
      ? { p_notification_body: input.notificationBody }
      : {}),
  });

  if (error) {
    console.error("[createVoteAction] rpc failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: ADMIN_ONLY_ERROR };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  const row = data?.[0];
  if (!row) {
    console.error("[createVoteAction] rpc returned no row");
    return { success: false, formError: mapSupabaseError(null) };
  }

  revalidateVotePaths(groupId, row.vote_id);

  return {
    success: true,
    data: { voteId: row.vote_id, notifiedCount: row.notified_count },
  };
}

/**
 * 투표 참여 Server Action (Task 029).
 *
 * 생성과 달리 **RPC를 쓰지 않는다** — 본인 응답 INSERT는 이미
 * `woodong_vote_responses_insert_own_member` 정책이 허용하는 정상 권한이고, 권한 상승이
 * 필요 없다. 규칙은 전부 DB 트리거가 지킨다:
 *   - 마감된 투표: `woodong_prevent_closed_vote_response`(Task 029) → `42501`
 *   - 중복 참여: `woodong_prevent_duplicate_vote_response`(Task 003) → `P0001`
 *     `allow_multiple`이 `false`면 "투표당 1행", `true`면 "선택지당 1행"으로 분기한다.
 *
 * 복수 선택은 **한 문장으로** 넣는다. 선택지마다 따로 넣으면 중간에 실패했을 때 일부만
 * 반영된 채로 남고, 사용자는 다시 시도할 수도 없다(이미 넣은 것 때문에 중복으로 막힌다).
 */
export async function submitVoteResponseAction(
  input: SubmitVoteResponseInput,
): Promise<ActionResult<{ voteId: string; recordedCount: number }>> {
  const parsed = submitVoteResponseSchema.safeParse(input);
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

  const { voteId, optionIds } = parsed.data;

  // 투표 자체를 못 읽으면 비멤버이거나 없는 투표다. 어느 쪽인지 구분해서 알려 주지 않는다.
  const { data: vote } = await supabase
    .from("woodong_votes")
    .select("id, group_id, allow_multiple")
    .eq("id", voteId)
    .maybeSingle();

  if (!vote) {
    return { success: false, formError: "투표를 찾을 수 없어요." };
  }

  // 단일 선택 투표에 2개 이상을 보내는 것은 스키마만으로는 판별할 수 없다(투표마다 다르다).
  // DB 트리거도 막지만, 여기서 먼저 걸러야 "이미 참여했다"는 엉뚱한 메시지가 나오지 않는다.
  const uniqueOptionIds = [...new Set(optionIds)];
  if (!vote.allow_multiple && uniqueOptionIds.length > 1) {
    return {
      success: false,
      fieldErrors: { optionIds: ["이 투표는 하나만 선택할 수 있어요"] },
    };
  }

  const { data, error } = await supabase
    .from("woodong_vote_responses")
    .insert(
      uniqueOptionIds.map((optionId) => ({
        vote_id: voteId,
        option_id: optionId,
        user_id: userId,
      })),
    )
    .select("id");

  if (error) {
    console.error("[submitVoteResponseAction] insert failed:", error);
    // 두 트리거 모두 '권한이 없습니다:'로 시작하는 한국어 메시지를 올리지만, DB 원문을
    // 그대로 노출하지 않고 코드/문구로 판별해 앱 문구로 바꾼다(`errors.ts`와 같은 규약).
    if (error.message.includes("마감된 투표")) {
      return { success: false, formError: CLOSED_VOTE_ERROR };
    }
    if (error.message.includes("이미")) {
      return { success: false, formError: DUPLICATE_VOTE_ERROR };
    }
    if (isRlsError(error)) {
      return { success: false, formError: "이 투표에 참여할 수 없어요." };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidateVotePaths(vote.group_id, voteId);

  return {
    success: true,
    data: { voteId, recordedCount: data?.length ?? 0 },
  };
}

export type CloseVoteResult = {
  /** 이번 마감으로 실제 만들어진 결과 알림 건수(마감을 누른 총무 본인은 제외). */
  notifiedCount: number;
  /** 이미 다른 경로(다른 총무의 마감, 마감 시각 경과에 따른 lazy 마감)로 닫혀 있었는지. */
  alreadyClosed: boolean;
};

/**
 * 총무의 투표 수동 조기마감 Server Action (Task 030).
 *
 * `woodong_close_vote_now()` `SECURITY DEFINER` RPC 한 번으로 처리한다. 마감(UPDATE)과 결과
 * 알림 팬아웃(INSERT)이 **한 트랜잭션**이어야 "닫혔는데 아무도 모르는 투표"가 남지 않고,
 * 알림 INSERT는 어떤 클라이언트에도 열려 있지 않다(생성 RPC와 같은 이유).
 *
 * 중복 마감은 RPC의 UPDATE 선점이 막는다 — 이미 닫힌 투표에서는 0행이라 결과 알림이 다시
 * 가지 않는다. 그때 `notifiedCount`가 0으로 돌아오므로 화면에는 "이미 마감된 투표"라고
 * 알려 준다(실패가 아니라, 원하던 상태에 이미 도달해 있는 것이다).
 */
export async function closeVoteNowAction(input: {
  voteId: string;
  groupId: string;
  notificationTitle?: string;
  notificationBody?: string;
}): Promise<ActionResult<CloseVoteResult>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  // 마감 전 상태를 먼저 읽어 둔다. RPC는 "이번에 만든 알림 수"만 돌려주는데, 알림 대상이
  // 총무 혼자인 모임에서는 정상 마감도 0이라 "이미 마감돼 있었다"와 구분되지 않는다.
  const { data: before } = await supabase
    .from("woodong_votes")
    .select("status")
    .eq("id", input.voteId)
    .maybeSingle();

  const { data, error } = await supabase.rpc("woodong_close_vote_now", {
    p_vote_id: input.voteId,
    ...(input.notificationTitle ? { p_title: input.notificationTitle } : {}),
    ...(input.notificationBody ? { p_body: input.notificationBody } : {}),
  });

  if (error) {
    console.error("[closeVoteNowAction] rpc failed:", error);
    if (isRlsError(error)) {
      return { success: false, formError: CLOSE_ADMIN_ONLY_ERROR };
    }
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidateVotePaths(input.groupId, input.voteId);

  return {
    success: true,
    data: {
      notifiedCount: data ?? 0,
      alreadyClosed: before?.status === "closed",
    },
  };
}
