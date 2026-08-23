import { z } from "zod";
import type { Database, Tables } from "@/lib/supabase/database.types";
import { datetimeString } from "./common";

/** 투표 형식 — `udong_votes.vote_type` CHECK 제약(multiple_choice/yes_no, PRD 5.10) */
export type VoteType = "multiple_choice" | "yes_no";

/**
 * 투표 상태 — `udong_votes.status` CHECK 제약(open/closed, PRD 5.10).
 * 1차 MVP는 실시간 스케줄러 없이 조회 시점 lazy 마감으로 전환한다(ROADMAP Task 030).
 */
export type VoteStatus = "open" | "closed";

export type Vote = Omit<
  Pick<
    Tables<"udong_votes">,
    | "id"
    | "group_id"
    | "title"
    | "vote_type"
    | "allow_multiple"
    | "is_anonymous"
    | "closes_at"
    | "status"
    | "created_by"
    | "created_at"
  >,
  "vote_type" | "status"
> & { vote_type: VoteType; status: VoteStatus };

export type VoteOption = Pick<
  Tables<"udong_vote_options">,
  "id" | "vote_id" | "label" | "sort_order"
>;

/**
 * `udong_vote_responses`는 익명 투표에서도 중복 투표 방지를 위해 `user_id`를 저장하지만,
 * RLS로 본인 레코드만 직접 SELECT 가능하도록 제한된다(PRD 4.2/5.11). 결과 집계는 이 테이블을
 * 직접 조회하지 않고 아래 `udong_get_vote_results()` RPC를 통해서만 노출한다.
 */
export type VoteResponse = Pick<
  Tables<"udong_vote_responses">,
  "id" | "vote_id" | "option_id" | "user_id" | "responded_at"
>;

/**
 * `udong_get_vote_results(p_vote_id)` RPC 반환 타입(`SECURITY DEFINER`, ROADMAP Task 003).
 * 익명 투표는 `voter_names`가 빈 배열(응답자 식별 불가), 실명 투표는 투표자 이름 배열을 반환한다.
 * 생성된 DB 함수 타입에서 그대로 파생시켜 수동 복제를 피한다.
 */
export type VoteResult =
  Database["public"]["Functions"]["udong_get_vote_results"]["Returns"][number];

// ── zod 스키마 ────────────────────────────────────────────────────────────

const voteOptionInputSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "선택지 내용을 입력해주세요")
    .max(100, "선택지는 최대 100자까지 입력 가능합니다"),
});

/** 투표 생성 폼 (PRD 3.5 AC — 선택지 2개 이상, 마감일시는 미래여야 함) */
export const createVoteSchema = z
  .object({
    groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
    title: z
      .string()
      .trim()
      .min(1, "투표 제목을 입력해주세요")
      .max(150, "투표 제목은 최대 150자까지 입력 가능합니다"),
    voteType: z.enum(["multiple_choice", "yes_no"], {
      required_error: "투표 형식을 선택해주세요",
    }),
    options: z
      .array(voteOptionInputSchema)
      .min(2, "선택지는 2개 이상 입력해주세요")
      .max(20, "선택지는 최대 20개까지 입력 가능합니다"),
    allowMultiple: z.boolean().default(false),
    isAnonymous: z.boolean().default(false),
    closesAt: datetimeString("마감 일시를 입력해주세요"),
  })
  .refine((data) => new Date(data.closesAt).getTime() > Date.now(), {
    message: "마감 일시는 현재 이후여야 합니다",
    path: ["closesAt"],
  });
export type CreateVoteInput = z.infer<typeof createVoteSchema>;

/**
 * 투표 응답 폼. `allow_multiple`이 `false`인 투표에서 선택지를 2개 이상 보내는 것은
 * 정적 스키마만으로는 판별할 수 없으므로(투표별로 다름), UI에서 단일 선택으로 제한하고
 * 최종 방어는 DB의 `BEFORE INSERT` 트리거(ROADMAP Task 003)가 담당한다.
 */
export const submitVoteResponseSchema = z.object({
  voteId: z.string().uuid("올바른 투표 ID가 아닙니다"),
  optionIds: z
    .array(z.string().uuid("올바른 선택지 ID가 아닙니다"))
    .min(1, "선택지를 1개 이상 선택해주세요"),
});
export type SubmitVoteResponseInput = z.infer<typeof submitVoteResponseSchema>;
