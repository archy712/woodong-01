import type { Tables } from "@/lib/supabase/database.types";

/**
 * 알림 유형 — `udong_notifications.type` CHECK 제약(PRD 5.13).
 * `settlement_published`는 정산 발행(3.4-b, Phase 8 2차 확장) 기능 자체는 아직 구현되지 않았지만,
 * 알림 타입 값으로는 PRD 스키마에 이미 정의되어 있어 함께 반영한다.
 */
export type NotificationType =
  | "notice"
  | "due_reminder"
  | "vote_start"
  | "vote_close"
  | "settlement_published";

/** 알림이 가리키는 리소스 종류(다형 참조) — `udong_notifications.related_type`(nullable, PRD 5.13) */
export type NotificationRelatedType =
  "announcement" | "vote" | "settlement" | "due";

/**
 * 알림 발송 채널 — `udong_notifications.channel` / `udong_notification_preferences.channel`
 * 공용 CHECK 제약(PRD 4.3, 5.13). 1차 MVP는 `in_app`만 실제 발송하고 나머지는 설정만 저장한다.
 */
export type NotificationChannel = "kakao" | "slack" | "email" | "in_app";

/** 알림 발송 상태 — `udong_notifications.status` CHECK 제약(PRD 4.4, 5.13) */
export type NotificationStatus =
  "pending" | "sent" | "failed" | "fallback_sent";

export type Notification = Omit<
  Pick<
    Tables<"udong_notifications">,
    | "id"
    | "group_id"
    | "user_id"
    | "type"
    | "related_type"
    | "related_id"
    | "channel"
    | "status"
    | "title"
    | "body"
    | "read_at"
    | "clicked_at"
    | "created_at"
  >,
  "type" | "related_type" | "channel" | "status"
> & {
  type: NotificationType;
  related_type: NotificationRelatedType | null;
  channel: NotificationChannel;
  status: NotificationStatus;
};

export type NotificationPreference = Omit<
  Pick<
    Tables<"udong_notification_preferences">,
    "id" | "user_id" | "channel" | "enabled" | "destination" | "updated_at"
  >,
  "channel"
> & { channel: NotificationChannel };
