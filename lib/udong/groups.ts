import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";
import { datetimeString, wonAmount } from "./common";

/**
 * 모임 유형 — `udong_groups.type`은 CHECK 제약이 없는 **자유 값**이다
 * (PRD 4.3 "확장성", ROADMAP Task 002 "udong_groups.type(자유 값)").
 * 따라서 리터럴 유니온으로 좁히지 않고, UI 선택지 힌트용 상수만 제공한다.
 */
export const GROUP_TYPE_SUGGESTIONS = [
  "동호회",
  "계모임",
  "스터디",
  "취미모임",
] as const;

export type Group = Pick<
  Tables<"udong_groups">,
  | "id"
  | "name"
  | "description"
  | "type"
  | "cover_image_object_path"
  | "default_due_amount"
  | "created_by"
  | "created_at"
>;

/** 모임 멤버 역할 — `udong_group_members.role` CHECK 제약(PRD 5.3, ROADMAP Task 002/003) */
export type GroupMemberRole = "admin" | "member";

/** 모임 멤버 상태 — `udong_group_members.status` CHECK 제약(PRD 5.3, ROADMAP Task 002/003) */
export type GroupMemberStatus = "active" | "left";

export type GroupMember = Omit<
  Pick<
    Tables<"udong_group_members">,
    "id" | "group_id" | "user_id" | "role" | "status" | "joined_at"
  >,
  "role" | "status"
> & {
  role: GroupMemberRole;
  status: GroupMemberStatus;
};

export type GroupInvite = Pick<
  Tables<"udong_group_invites">,
  | "id"
  | "group_id"
  | "code"
  | "created_by"
  | "expires_at"
  | "max_uses"
  | "used_count"
  | "is_active"
  | "revoked_at"
>;

// ── zod 스키마 ────────────────────────────────────────────────────────────

/** 모임 생성 폼 (PRD 3.2 AC — 이름 필수, 설명/유형/기본 회비는 선택) */
export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "모임 이름을 입력해주세요")
    .max(100, "모임 이름은 최대 100자까지 입력 가능합니다"),
  description: z
    .string()
    .trim()
    .max(1000, "모임 소개는 최대 1000자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
  type: z
    .string()
    .trim()
    .max(50, "모임 유형은 최대 50자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
  defaultDueAmount: wonAmount({ min: 0 }).optional(),
});
export type CreateGroupInput = z.infer<typeof createGroupSchema>;

/**
 * 초대 코드 발급 폼.
 *
 * `udong_group_invites.expires_at`/`max_uses`는 DB 컬럼 자체는 nullable(무제한 허용)이지만,
 * PRD 9장 "초대 코드 보안" 리스크 대응으로 **애플리케이션(폼) 레벨에서는 필수값으로 강제**한다
 * (Task 007 지침 3번 및 ROADMAP Task 020 "만료 기간 및 최대 사용 횟수 설정 필수화").
 */
export const issueGroupInviteSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  expiresAt: datetimeString("만료 일시를 입력해주세요").refine(
    (value) => new Date(value).getTime() > Date.now(),
    "만료 일시는 현재 이후여야 합니다",
  ),
  maxUses: z.coerce
    .number()
    .int("최대 사용 횟수는 정수로 입력해주세요")
    .min(1, "최대 사용 횟수는 1회 이상이어야 합니다")
    .max(10_000, "최대 사용 횟수가 너무 큽니다"),
});
export type IssueGroupInviteInput = z.infer<typeof issueGroupInviteSchema>;
