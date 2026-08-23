import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";

export type Announcement = Pick<
  Tables<"udong_announcements">,
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
 * 공지 작성 폼 (PRD 3.3 AC). 발송 시 각 멤버의 `udong_notification_preferences`에서
 * `in_app`이 활성화된 대상 기준으로 `udong_notifications`가 팬아웃 생성된다(1차 MVP는 `in_app`만).
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
