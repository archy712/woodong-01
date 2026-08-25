import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * 알림 유형 — `woodong_notifications.type` CHECK 제약(PRD 5.13).
 * `settlement_published`는 정산 발행(3.4-b, Phase 8 2차 확장) 기능 자체는 아직 구현되지 않았지만,
 * 알림 타입 값으로는 PRD 스키마에 이미 정의되어 있어 함께 반영한다.
 */
export type NotificationType =
  | "notice"
  | "due_reminder"
  | "vote_start"
  | "vote_close"
  | "settlement_published";

/** 알림이 가리키는 리소스 종류(다형 참조) — `woodong_notifications.related_type`(nullable, PRD 5.13) */
export type NotificationRelatedType =
  "announcement" | "vote" | "settlement" | "due";

/**
 * 알림 발송 채널 — `woodong_notifications.channel` / `woodong_notification_preferences.channel`
 * 공용 CHECK 제약(PRD 4.3, 5.13). 1차 MVP는 `in_app`만 실제 발송하고 `web_push`는 설정만 저장한다.
 *
 * v1.5에서 카카오톡 알림톡/Slack/이메일이 로드맵에서 제외되고 웹 푸시로 대체됐다. DB의 CHECK
 * 제약도 Task 027 마이그레이션(`update_woodong_notification_channel_check`)에서 함께 좁혔다.
 */
export type NotificationChannel = "web_push" | "in_app";

/**
 * 설정 행이 없을 때 채널이 켜진 것으로 볼지 여부.
 *
 * `in_app`은 **opt-out**이다 — 팬아웃 RPC(`woodong_create_announcement`)가
 * `coalesce(p.enabled, true)`로 판정하므로 여기 기본값도 반드시 `true`여야 화면과 실제 발송이
 * 어긋나지 않는다. 설정 행이 없는 사람(마이페이지에 한 번도 안 들어간 사람)이 아무 알림도
 * 못 받으면 알림 기능이 없는 것과 같다.
 *
 * `web_push`는 반대로 **opt-in**이다. 브라우저 권한 허용과 Push 구독(`destination`)이 있어야
 * 보낼 수 있어서, 켜진 것처럼 보여 주면 지킬 수 없는 약속이 된다.
 */
export const CHANNEL_DEFAULT_ENABLED: Record<NotificationChannel, boolean> = {
  in_app: true,
  web_push: false,
};

/** 알림 발송 상태 — `woodong_notifications.status` CHECK 제약(PRD 4.4, 5.13) */
export type NotificationStatus =
  "pending" | "sent" | "failed" | "fallback_sent";

export type Notification = Omit<
  Pick<
    Tables<"woodong_notifications">,
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
    Tables<"woodong_notification_preferences">,
    "id" | "user_id" | "channel" | "enabled" | "destination" | "updated_at"
  >,
  "channel"
> & { channel: NotificationChannel };

// ── zod 스키마 ────────────────────────────────────────────────────────────

/**
 * 마이페이지 채널 on/off (Task 027).
 *
 * `destination`은 이 스키마에 없다. 1차에서 저장할 수 있는 유일한 목적지는 `web_push`의 Push
 * 구독 정보인데, 그것은 사용자가 입력하는 값이 아니라 브라우저가 발급하는 것이라
 * 구독 등록을 구현하는 Task 038에서 함께 다룬다.
 */
export const updateChannelPreferenceSchema = z.object({
  channel: z.enum(["in_app", "web_push"], {
    errorMap: () => ({ message: "알 수 없는 알림 채널입니다" }),
  }),
  enabled: z.boolean(),
});
export type UpdateChannelPreferenceInput = z.infer<
  typeof updateChannelPreferenceSchema
>;
