import {
  NOTIFICATION_TEMPLATE_KEYS,
  type Notification,
  type NotificationTemplateKey,
} from "@/lib/woodong/notifications";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 알림 문구 조립 (Task 040).
 *
 * 저장된 `title`/`body`를 그대로 쓰지 않고 **읽는 시점에** 읽는 사람의 사전으로 만든다.
 * 그 이유는 `NOTIFICATION_TEMPLATE_KEYS` 주석에 있다 — 저장된 문자열은 만든 사람의 언어이거나
 * (배치가 만든 것이면) 무조건 한국어다.
 *
 * 폴백이 반드시 필요하다:
 * - 공지(`notice`)처럼 애초에 템플릿이 아닌 알림 → 저장된 문자열이 곧 내용이다
 * - Task 040 이전에 만들어진 알림 → `template_key`가 null이다
 * - 앱이 모르는 새 키(서버가 먼저 배포된 순간) → 빈 화면 대신 한국어라도 보여준다
 */

/** `{cycleTitle}` 자리를 파라미터로 채운다. 값이 없으면 자리표시자를 지워 빈칸으로 둔다. */
function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function isTemplateKey(value: string | null): value is NotificationTemplateKey {
  return (
    value !== null &&
    (NOTIFICATION_TEMPLATE_KEYS as readonly string[]).includes(value)
  );
}

/**
 * `params` jsonb에서 문자열 값만 뽑아 온다.
 *
 * jsonb라 무엇이든 들어올 수 있는데, 자리표시자에 객체나 배열이 그대로 박히면
 * `[object Object]`가 화면에 남는다. 문자열·숫자만 받고 나머지는 없는 값으로 취급한다.
 */
function toStringParams(
  params: Notification["params"],
): Record<string, string> {
  if (!params || typeof params !== "object" || Array.isArray(params)) return {};

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") result[key] = value;
    else if (typeof value === "number") result[key] = String(value);
  }
  return result;
}

/** 템플릿 키 → 사전 키. DB 값은 snake_case, 사전은 camelCase라 표로 잇는다. */
const TEMPLATE_DICT_KEY: Record<
  NotificationTemplateKey,
  keyof Dictionary["notifications"]["templates"]
> = {
  due_reminder: "dueReminder",
  vote_start: "voteStart",
  vote_close: "voteClose",
  settlement_published: "settlementPublished",
};

/** 알림 하나의 화면 문구. 목록·상세가 같은 규칙을 쓰도록 여기 하나만 둔다. */
export function renderNotificationText(
  notification: Pick<
    Notification,
    "title" | "body" | "template_key" | "params"
  >,
  labels: Dictionary["notifications"],
): { title: string; body: string } {
  if (!isTemplateKey(notification.template_key)) {
    return { title: notification.title, body: notification.body };
  }

  const template =
    labels.templates[TEMPLATE_DICT_KEY[notification.template_key]];
  const values = toStringParams(notification.params);

  return {
    title: fillTemplate(template.title, values),
    body: fillTemplate(template.body, values),
  };
}
