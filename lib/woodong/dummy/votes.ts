import type { Vote, VoteOption, VoteResult } from "@/lib/woodong/votes";
import { GROUP_ID, voteId, voteOptionId } from "./ids";
import { RUNNING_MEMBERS, HIKING_MEMBERS } from "./groups";

/**
 * 더미 투표 하나를 화면에서 바로 쓸 수 있도록 vote + options + results를 묶은 번들.
 * `hasCurrentUserVoted`는 실제 `woodong_vote_responses`의 본인 레코드 존재 여부에 대응하는
 * 더미 전용 플래그로, 상세 화면의 "투표하기" 버튼 활성/비활성 데모에 사용한다.
 */
export interface DummyVoteBundle {
  vote: Vote;
  options: VoteOption[];
  results: VoteResult[];
  hasCurrentUserVoted: boolean;
}

const runningAdmin = RUNNING_MEMBERS[0].user_id;
const hikingAdmin = HIKING_MEMBERS[0].user_id;

// ── 러닝크루: 진행중 · 실명 · 단일선택 · 아직 투표 안 함 ─────────────────────
const runningCourseVote: Vote = {
  id: voteId(1),
  group_id: GROUP_ID.running,
  title: "다음 러닝 코스 투표",
  vote_type: "multiple_choice",
  allow_multiple: false,
  is_anonymous: false,
  closes_at: "2026-08-30T21:00:00+09:00",
  status: "open",
  created_by: runningAdmin,
  created_at: "2026-08-15T10:00:00+09:00",
};

const runningCourseOptions: VoteOption[] = [
  {
    id: voteOptionId(1),
    vote_id: runningCourseVote.id,
    label: "한강공원 코스",
    sort_order: 0,
  },
  {
    id: voteOptionId(2),
    vote_id: runningCourseVote.id,
    label: "남산 코스",
    sort_order: 1,
  },
  {
    id: voteOptionId(3),
    vote_id: runningCourseVote.id,
    label: "여의도 코스",
    sort_order: 2,
  },
];

const runningCourseResults: VoteResult[] = [
  {
    option_id: runningCourseOptions[0].id,
    label: runningCourseOptions[0].label,
    sort_order: 0,
    response_count: 4,
    voter_names: ["이서연", "박도윤", "최지우", "정하윤"],
  },
  {
    option_id: runningCourseOptions[1].id,
    label: runningCourseOptions[1].label,
    sort_order: 1,
    response_count: 2,
    voter_names: ["강은우", "조수아"],
  },
  {
    option_id: runningCourseOptions[2].id,
    label: runningCourseOptions[2].label,
    sort_order: 2,
    response_count: 1,
    voter_names: ["윤지호"],
  },
];

// ── 러닝크루: 마감 · 익명 · 찬반 ────────────────────────────────────────────
const runningDuesVote: Vote = {
  id: voteId(2),
  group_id: GROUP_ID.running,
  title: "회비 인상 찬반 투표",
  vote_type: "yes_no",
  allow_multiple: false,
  is_anonymous: true,
  closes_at: "2026-08-10T21:00:00+09:00",
  status: "closed",
  created_by: runningAdmin,
  created_at: "2026-07-25T10:00:00+09:00",
};

const runningDuesOptions: VoteOption[] = [
  {
    id: voteOptionId(4),
    vote_id: runningDuesVote.id,
    label: "찬성",
    sort_order: 0,
  },
  {
    id: voteOptionId(5),
    vote_id: runningDuesVote.id,
    label: "반대",
    sort_order: 1,
  },
];

const runningDuesResults: VoteResult[] = [
  {
    option_id: runningDuesOptions[0].id,
    label: runningDuesOptions[0].label,
    sort_order: 0,
    response_count: 6,
    voter_names: [],
  },
  {
    option_id: runningDuesOptions[1].id,
    label: runningDuesOptions[1].label,
    sort_order: 1,
    response_count: 3,
    voter_names: [],
  },
];

// ── 등산모임: 진행중 · 실명 · 복수선택 · 이미 투표함 ─────────────────────────
const hikingDateVote: Vote = {
  id: voteId(3),
  group_id: GROUP_ID.hiking,
  title: "9월 산행 날짜 투표 (복수 선택 가능)",
  vote_type: "multiple_choice",
  allow_multiple: true,
  is_anonymous: false,
  closes_at: "2026-09-05T21:00:00+09:00",
  status: "open",
  created_by: hikingAdmin,
  created_at: "2026-08-18T10:00:00+09:00",
};

const hikingDateOptions: VoteOption[] = [
  {
    id: voteOptionId(6),
    vote_id: hikingDateVote.id,
    label: "9/6(토)",
    sort_order: 0,
  },
  {
    id: voteOptionId(7),
    vote_id: hikingDateVote.id,
    label: "9/13(토)",
    sort_order: 1,
  },
  {
    id: voteOptionId(8),
    vote_id: hikingDateVote.id,
    label: "9/20(토)",
    sort_order: 2,
  },
];

const hikingDateResults: VoteResult[] = [
  {
    option_id: hikingDateOptions[0].id,
    label: hikingDateOptions[0].label,
    sort_order: 0,
    response_count: 8,
    voter_names: [
      "한지민",
      "오유진",
      "서준혁",
      "신다은",
      "권태양",
      "황유나",
      "문재현",
      "배소율",
    ],
  },
  {
    option_id: hikingDateOptions[1].id,
    label: hikingDateOptions[1].label,
    sort_order: 1,
    response_count: 5,
    voter_names: ["한지민", "오유진", "노경민", "송하은", "홍시우"],
  },
  {
    option_id: hikingDateOptions[2].id,
    label: hikingDateOptions[2].label,
    sort_order: 2,
    response_count: 3,
    voter_names: ["안준서", "노경민", "송하은"],
  },
];

export const DUMMY_VOTE_BUNDLES: DummyVoteBundle[] = [
  {
    vote: runningCourseVote,
    options: runningCourseOptions,
    results: runningCourseResults,
    hasCurrentUserVoted: false,
  },
  {
    vote: runningDuesVote,
    options: runningDuesOptions,
    results: runningDuesResults,
    hasCurrentUserVoted: true,
  },
  {
    vote: hikingDateVote,
    options: hikingDateOptions,
    results: hikingDateResults,
    hasCurrentUserVoted: true,
  },
];

export function getDummyVotesForGroup(groupId: string): DummyVoteBundle[] {
  return DUMMY_VOTE_BUNDLES.filter((b) => b.vote.group_id === groupId);
}

export function getDummyVoteById(id: string): DummyVoteBundle | undefined {
  return DUMMY_VOTE_BUNDLES.find((b) => b.vote.id === id);
}
