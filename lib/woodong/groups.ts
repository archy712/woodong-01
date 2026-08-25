import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";
import { datetimeString, wonAmount } from "./common";

/**
 * 모임 유형 — `woodong_groups.type`은 CHECK 제약이 없는 **자유 값**이다
 * (PRD 4.3 "확장성", ROADMAP Task 002 "woodong_groups.type(자유 값)").
 * 따라서 리터럴 유니온으로 좁히지 않고, UI 선택지 힌트용 상수만 제공한다.
 */
export const GROUP_TYPE_SUGGESTIONS = [
  "동호회",
  "계모임",
  "스터디",
  "취미모임",
] as const;

export type Group = Pick<
  Tables<"woodong_groups">,
  | "id"
  | "name"
  | "description"
  | "type"
  | "cover_image_object_path"
  | "default_due_amount"
  | "created_by"
  | "created_at"
>;

/** 모임 멤버 역할 — `woodong_group_members.role` CHECK 제약(PRD 5.3, ROADMAP Task 002/003) */
export type GroupMemberRole = "admin" | "member";

/** 모임 멤버 상태 — `woodong_group_members.status` CHECK 제약(PRD 5.3, ROADMAP Task 002/003) */
export type GroupMemberStatus = "active" | "left";

export type GroupMember = Omit<
  Pick<
    Tables<"woodong_group_members">,
    "id" | "group_id" | "user_id" | "role" | "status" | "joined_at"
  >,
  "role" | "status"
> & {
  role: GroupMemberRole;
  status: GroupMemberStatus;
};

export type GroupInvite = Pick<
  Tables<"woodong_group_invites">,
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
 * 모임 정보 수정 폼 (Task 019).
 *
 * 생성 폼과 같은 필드에 대상 모임 id와 대표 이미지 경로가 추가된다.
 * 대표 이미지는 비공개 버킷의 **오브젝트 경로**만 저장하고(공개 URL 미사용, Task 004),
 * 업로드 자체는 브라우저에서 끝낸 뒤 그 경로를 이 액션으로 넘긴다.
 * `null`은 "대표 이미지 제거", `undefined`는 "변경 없음"을 뜻한다.
 */
export const updateGroupSchema = createGroupSchema.extend({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  coverImageObjectPath: z
    .string()
    .trim()
    .max(500, "이미지 경로가 너무 깁니다")
    .nullable()
    .optional(),
});
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

/** 모임 삭제 (Task 019) — 확인 다이얼로그를 거친 뒤 호출한다. */
export const deleteGroupSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
});
export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;

/**
 * 초대 코드 발급 폼.
 *
 * `woodong_group_invites.expires_at`/`max_uses`는 DB 컬럼 자체는 nullable(무제한 허용)이지만,
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
