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
  | "created_at"
  | "expires_at"
  | "max_uses"
  | "used_count"
  | "is_active"
  | "revoked_at"
>;

/**
 * 초대 코드 상태 — `woodong_get_invite_preview()`가 돌려주는 `status` 값 (Task 020).
 *
 * PRD 5.4의 참여 가능 조건(`is_active AND revoked_at IS NULL AND expires_at > now()
 * AND (max_uses IS NULL OR used_count < max_uses)`)을 하나의 boolean으로 뭉개지 않고
 * 실패 사유별로 쪼갠 값이다. 화면에서 "만료됐어요"와 "무효화됐어요", "사용 횟수를 다 썼어요"를
 * 구분해 안내해야 사용자가 다음 행동(총무에게 새 링크 요청)을 알 수 있다.
 */
export type InviteStatus =
  "valid" | "not_found" | "expired" | "revoked" | "exhausted";

/** 초대 참여 결과 — `woodong_redeem_group_invite()`가 돌려주는 `status` 값 (Task 020). */
export type RedeemInviteStatus =
  | "joined"
  | "already_member"
  | "unauthenticated"
  | Exclude<InviteStatus, "valid">;

/**
 * 공개 초대 화면(`/invite/[code]`)이 보여줄 최소 정보 (Task 020).
 *
 * `woodong_group_invites`의 SELECT 정책이 총무 전용이라 이 데이터는 `SECURITY DEFINER`
 * RPC를 통해서만 얻을 수 있다. 모임 이름/설명/유형/멤버 수까지만 담고 회비·투표·멤버 명단 등
 * 모임 내부 데이터는 절대 싣지 않는다(코드만 알면 비로그인 상태로도 볼 수 있는 값이다).
 */
export type InvitePreview = {
  status: InviteStatus;
  groupId: string | null;
  groupName: string | null;
  groupDescription: string | null;
  groupType: string | null;
  memberCount: number;
  /** 현재 로그인 사용자가 이미 이 모임의 활성 멤버인지. 비로그인이면 항상 false. */
  isMember: boolean;
};

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
 * 멤버 역할 변경 (Task 021).
 *
 * 대상은 `user_id`가 아니라 **멤버십 행 id**로 지정한다. `(group_id, user_id)`로도 특정되지만,
 * 행 id 하나로 좁히면 "다른 모임의 같은 사용자"를 건드릴 여지가 아예 없다.
 * `groupId`는 RLS가 쓰는 값이 아니라 UPDATE 대상 한정과 재검증 경로 생성에 쓴다.
 */
export const updateMemberRoleSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  memberId: z.string().uuid("올바른 멤버 ID가 아닙니다"),
  role: z.enum(["admin", "member"], {
    errorMap: () => ({ message: "올바른 역할이 아닙니다" }),
  }),
});
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

/**
 * 멤버 제외 / 모임 나가기 (Task 021).
 *
 * 물리 삭제가 아니라 `status = 'left'` 전환이다. 회비 청구·납부·투표 응답이 멤버십이 아니라
 * `user_id`를 참조하므로 행을 지우면 과거 기록의 주체를 잃고, 재참여 시에도
 * `UNIQUE(group_id, user_id)` 위에서 되살리는 편이 이력이 남는다(Task 020의 재참여 경로 참고).
 */
export const removeGroupMemberSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  memberId: z.string().uuid("올바른 멤버 ID가 아닙니다"),
});
export type RemoveGroupMemberInput = z.infer<typeof removeGroupMemberSchema>;

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

/**
 * 초대 코드 무효화 (Task 020).
 *
 * `groupId`는 무효화 대상 판별에 꼭 필요하지는 않지만(초대 id만으로 특정된다),
 * 뮤테이션 후 재검증할 경로(`/protected/groups/{groupId}/settings`)를 만들려면 필요하다.
 */
export const revokeGroupInviteSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  inviteId: z.string().uuid("올바른 초대 ID가 아닙니다"),
});
export type RevokeGroupInviteInput = z.infer<typeof revokeGroupInviteSchema>;

/**
 * 초대 코드로 모임 참여 (Task 020).
 *
 * 코드 형식(`ABCD-EFGH`)을 정규식으로 못박지 않는다. 형식 검증에서 걸러 버리면 "유효하지 않은
 * 초대 코드"와 "형식이 틀린 문자열"을 다른 화면으로 처리해야 하는데, 사용자 입장에서는 둘 다
 * "이 링크는 못 쓴다"로 같기 때문이다. 존재 여부 판정은 DB(RPC)에 일임한다.
 */
export const redeemGroupInviteSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "초대 코드를 입력해주세요")
    .max(64, "초대 코드가 너무 깁니다"),
});
export type RedeemGroupInviteInput = z.infer<typeof redeemGroupInviteSchema>;
