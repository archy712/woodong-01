import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type { Vote, VoteOption, VoteResult } from "@/lib/woodong/votes";

/**
 * 투표 조회 헬퍼 (Task 029).
 *
 * 다른 `queries/*`와 같은 규약으로 **사용자 세션 클라이언트**를 받아 RLS 아래에서만 동작한다.
 * `woodong_votes`/`woodong_vote_options`의 SELECT 정책이 `woodong_is_group_member`라 비멤버는
 * 애초에 0행을 받는다.
 *
 * ⚠️ 집계는 `woodong_vote_responses`를 직접 세지 않는다 — 그 테이블은 **본인 응답만** SELECT할 수
 * 있어서(익명성 보장, PRD 4.2) 클라이언트가 셀 수 있는 숫자는 언제나 0 아니면 1이다. 총 응답 수와
 * 선택지별 집계는 Task 003의 `woodong_get_vote_results()` `SECURITY DEFINER` RPC만 알고 있다.
 */

type Client = SupabaseClient<Database>;

const VOTE_COLUMNS =
  "id, group_id, title, vote_type, allow_multiple, is_anonymous, closes_at, status, created_by, created_at";
const OPTION_COLUMNS = "id, vote_id, label, sort_order";

/** 목록 화면이 한 번에 읽는 최대 투표 수. 페이지네이션은 1차 범위 밖이라 최신 N건으로 자른다. */
export const VOTES_PAGE_SIZE = 50;

export type VoteListItem = {
  vote: Vote;
  /** 이 투표에 들어온 전체 응답 수(선택지별 합계). 복수 선택이면 인원수보다 클 수 있다. */
  totalResponses: number;
  /** 상세와 같은 기준의 "이미 마감됨" 판정. 아래 `isVoteClosed()` 주석 참고. */
  isClosed: boolean;
};

export type VoteDetail = {
  vote: Vote;
  options: VoteOption[];
  results: VoteResult[];
  /** 로그인 사용자가 이미 참여했는지. 본인 응답은 RLS로 직접 조회할 수 있다. */
  hasVoted: boolean;
  /** 더 이상 참여할 수 없는 상태인지. 아래 `isVoteClosed()` 주석 참고. */
  isClosed: boolean;
};

/**
 * 화면이 쓰는 유일한 마감 판정.
 *
 * `status`만 보면 안 된다 — `closed` 전환은 pg_cron 잡 `woodong_vote_closing`이 5분마다
 * 처리하므로(Task 037), 마감 시각이 지났는데도 `status`가 아직 `open`인 구간이 최대 5분
 * 존재한다. 그 구간에 배지는 "진행중", 본문은 "마감된 투표"라고 말하는 어긋남이 생기지
 * 않도록 목록·상세·홈 카드가 전부 이 함수를 거친다.
 * (Task 037 전에는 lazy 마감이 렌더 시점에 `status`를 맞춰 줘서 어긋남이 짧았다.)
 *
 * 계산을 컴포넌트가 아니라 여기서 하는 이유는 렌더 중 `Date.now()` 호출이 순수성 규칙에
 * 걸리기 때문이다.
 */
export function isVoteClosed(
  vote: Pick<Vote, "status" | "closes_at">,
): boolean {
  return (
    vote.status === "closed" || new Date(vote.closes_at).getTime() <= Date.now()
  );
}

/** 선택지별 집계(익명이면 이름 없이 카운트만) — Task 003의 DEFINER RPC 경유. */
async function getVoteResults(
  supabase: Client,
  voteId: string,
): Promise<VoteResult[]> {
  const { data, error } = await supabase.rpc("woodong_get_vote_results", {
    p_vote_id: voteId,
  });

  if (error) {
    console.error("[queries/votes] getVoteResults failed:", error);
    return [];
  }

  return data ?? [];
}

/**
 * 모임의 투표 목록. 최신 생성 순.
 *
 * 카드에 "N명 참여"를 보여주려면 투표마다 집계 RPC를 한 번씩 불러야 한다(위 주석의 이유로
 * 응답 테이블을 직접 셀 수 없다). 호출 수가 투표 수만큼 늘어나므로 `VOTES_PAGE_SIZE`로 상한을
 * 두고 병렬로 실행한다. 투표가 수백 개가 되는 모임이 나오면 집계 전용 RPC(투표 목록 → 카운트
 * 한 번에)로 바꾸는 편이 낫다.
 */
export async function listVotes(
  supabase: Client,
  groupId: string,
  limit = VOTES_PAGE_SIZE,
): Promise<VoteListItem[]> {
  const { data, error } = await supabase
    .from("woodong_votes")
    .select(VOTE_COLUMNS)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[queries/votes] listVotes failed:", error);
    return [];
  }

  const votes = (data ?? []) as Vote[];

  return Promise.all(
    votes.map(async (vote) => {
      const results = await getVoteResults(supabase, vote.id);
      return {
        vote,
        totalResponses: results.reduce((sum, r) => sum + r.response_count, 0),
        isClosed: isVoteClosed(vote),
      };
    }),
  );
}

/**
 * 모임 홈의 "진행 중인 투표" 카드용 — 아직 열려 있는 투표만 최신 N건.
 *
 * `status = 'open'`만으로 거르면 배치가 아직 닫지 않은 투표(최대 5분, Task 037)가 진행 중인
 * 것처럼 남는다. 마감 시각도 함께 걸러 `isVoteClosed()`와 같은 판정을 유지한다.
 * ⚠️ `limit`은 두 조건을 모두 적용한 뒤 잘리므로, 여기서 거른다고 카드가 비어 보이지 않는다.
 */
export async function listOpenVotes(
  supabase: Client,
  groupId: string,
  limit = 3,
): Promise<Vote[]> {
  const { data, error } = await supabase
    .from("woodong_votes")
    .select(VOTE_COLUMNS)
    .eq("group_id", groupId)
    .eq("status", "open")
    .gt("closes_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[queries/votes] listOpenVotes failed:", error);
    return [];
  }

  return (data ?? []) as Vote[];
}

/** 투표 상세(투표 + 선택지 + 집계 + 본인 참여 여부). 없거나 비멤버면 `null`. */
export async function getVoteDetail(
  supabase: Client,
  voteId: string,
  userId: string,
): Promise<VoteDetail | null> {
  const { data: vote, error } = await supabase
    .from("woodong_votes")
    .select(VOTE_COLUMNS)
    .eq("id", voteId)
    .maybeSingle();

  if (error) {
    console.error("[queries/votes] getVoteDetail failed:", error);
    return null;
  }

  if (!vote) {
    // 없는 투표와 비멤버(RLS 0행)를 구분하지 않는다 — 구분해서 알려 주면
    // "그 투표가 존재하는지"가 비멤버에게 새는 정보가 된다.
    return null;
  }

  const [optionsResult, results, ownResponses] = await Promise.all([
    supabase
      .from("woodong_vote_options")
      .select(OPTION_COLUMNS)
      .eq("vote_id", voteId)
      .order("sort_order", { ascending: true }),
    getVoteResults(supabase, voteId),
    supabase
      .from("woodong_vote_responses")
      .select("id", { count: "exact", head: true })
      .eq("vote_id", voteId)
      .eq("user_id", userId),
  ]);

  if (optionsResult.error) {
    console.error(
      "[queries/votes] getVoteDetail options failed:",
      optionsResult.error,
    );
  }

  const typedVote = vote as Vote;

  return {
    vote: typedVote,
    options: optionsResult.data ?? [],
    results,
    hasVoted: (ownResponses.count ?? 0) > 0,
    isClosed: isVoteClosed(typedVote),
  };
}
