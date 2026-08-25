import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";

export type Announcement = Pick<
  Tables<"woodong_announcements">,
  | "id"
  | "group_id"
  | "title"
  | "body"
  | "created_by"
  | "created_at"
  | "updated_at"
>;

// ── zod 스키마 ────────────────────────────────────────────────────────────

/**
 * 공지 작성 폼 (PRD 3.3 AC). 발송 시 각 멤버의 `woodong_notification_preferences`에서
 * `in_app`이 활성화된 대상 기준으로 `woodong_notifications`가 팬아웃 생성된다(1차 MVP는 `in_app`만).
 */
export const createAnnouncementSchema = z.object({
  groupId: z.string().uuid("올바른 모임 ID가 아닙니다"),
  title: z
    .string()
    .trim()
    .min(1, "공지 제목을 입력해주세요")
    .max(150, "공지 제목은 최대 150자까지 입력 가능합니다"),
  body: z
    .string()
    .trim()
    .min(1, "공지 내용을 입력해주세요")
    .max(5000, "공지 내용은 최대 5000자까지 입력 가능합니다"),
});
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

/**
 * 공지 수정 폼 (Task 025).
 *
 * 수정은 **알림을 다시 보내지 않는다**. 오탈자 하나 고칠 때마다 멤버 전원에게 알림이 다시 가면
 * 알림이 신뢰를 잃고, 이미 읽은 사람에게 같은 공지가 안 읽음으로 되살아난다. 내용이 크게 바뀌어
 * 다시 알려야 한다면 새 공지를 쓰는 편이 받는 사람에게도 분명하다.
 *
 * `groupId`는 바꿀 수 없다 — 공지를 다른 모임으로 옮기면 이미 발송된 알림의 `related_id`가
 * 그 모임 비멤버를 가리키게 된다.
 */
export const updateAnnouncementSchema = createAnnouncementSchema
  .omit({ groupId: true })
  .extend({
    announcementId: z.string().uuid("올바른 공지 ID가 아닙니다"),
  });
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
