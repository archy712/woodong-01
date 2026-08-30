import { z } from "zod";
import type { Tables } from "@/lib/supabase/database.types";

/**
 * 알림 유형 — `woodong_notifications.type` CHECK 제약(PRD 5.13).
 * `settlement_published`는 정산 발행(3.4-b, Phase 8 2차 확장) 기능 자체는 아직 구현되지 않았지만,
 * 알림 타입 값으로는 PRD 스키마에 이미 정의되어 있어 함께 반영한다.
 */
export const NOTIFICATION_TYPES = [
  "notice",
  "due_reminder",
  "vote_start",
  "vote_close",
  "settlement_published",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** 알림센터 필터가 받은 쿼리스트링 값을 유형으로 좁힌다. 모르는 값은 "전체"(undefined)로 떨어진다. */
export function parseNotificationType(
  value: string | undefined,
): NotificationType | undefined {
  if (!value) return undefined;
  return (NOTIFICATION_TYPES as readonly string[]).includes(value)
    ? (value as NotificationType)
    : undefined;
}

/** 알림이 가리키는 리소스 종류(다형 참조) — `woodong_notifications.related_type`(nullable, PRD 5.13) */
export type NotificationRelatedType =
  "announcement" | "vote" | "settlement" | "due";

/**
 * 알림 발송 채널 — `woodong_notifications.channel` / `woodong_notification_preferences.channel`
 * 공용 CHECK 제약(PRD 4.3, 5.13). Task 038부터 두 채널 모두 실제로 발송된다.
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
 * 보낼 수 있어서, 켜진 것처럼 보여 주면 지킬 수 없는 약속이 된다. 이 판정은 SQL 쪽
 * `woodong_notification_channels()`와 **같은 규칙**이어야 한다(Task 038).
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

/**
 * 브라우저가 발급한 Push 구독 (Task 038).
 *
 * 사용자가 입력하는 값이 아니라 `PushManager.subscribe()`가 돌려준 객체를 그대로 보낸다.
 * 그래도 검증하는 이유는 이 Server Action이 REST로 직접 호출될 수 있고, 형태가 깨진 JSON이
 * `destination`에 저장되면 **디스패처가 매분 집었다가 영구 실패로 버리는 행**이 되기 때문이다.
 *
 * `endpoint`는 푸시 서비스(FCM/Mozilla/Apple)의 URL이고, `keys`는 페이로드 암호화용
 * 공개 키(p256dh)와 인증 시크릿(auth)이다. 셋 다 없으면 보낼 수 없다.
 */
export const webPushSubscriptionSchema = z.object({
  endpoint: z.string().url({ message: "구독 endpoint가 올바르지 않습니다" }),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});
export type WebPushSubscription = z.infer<typeof webPushSubscriptionSchema>;

/**
 * 웹 푸시 켜기/끄기 (Task 038).
 *
 * 켤 때는 구독 정보가 **반드시** 함께 와야 한다. 구독 없이 `enabled = true`만 저장하면
 * 마이페이지에는 켜져 있는데 보낼 곳이 없는 상태가 되고, 그건 지킬 수 없는 약속이다
 * (`CHANNEL_DEFAULT_ENABLED.web_push`가 opt-in인 것과 같은 이유).
 */
export const updateWebPushSubscriptionSchema = z
  .object({
    enabled: z.boolean(),
    subscription: webPushSubscriptionSchema.nullable(),
  })
  .refine((value) => !value.enabled || value.subscription !== null, {
    message: "브라우저 알림 구독 정보가 없습니다",
    path: ["subscription"],
  });
export type UpdateWebPushSubscriptionInput = z.infer<
  typeof updateWebPushSubscriptionSchema
>;
