import Link from "next/link";

import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "@/lib/woodong/notifications";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** 알림 유형 → 사전 키. 유형 값과 문구 키의 이름이 달라서(예: `notice` → `announcement`) 표로 둔다. */
const TYPE_LABEL_KEY: Record<
  NotificationType,
  keyof Dictionary["notifications"]["types"]
> = {
  notice: "announcement",
  due_reminder: "dueReminder",
  vote_start: "voteStart",
  vote_close: "voteClose",
  settlement_published: "settlementReport",
};

/** 현재 필터 상태에서 한 축만 바꾼 URL. 다른 축은 그대로 유지된다. */
export function buildNotificationFilterHref({
  type,
  unreadOnly,
}: {
  type?: NotificationType;
  unreadOnly?: boolean;
}): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (unreadOnly) params.set("unread", "1");
  const query = params.toString();
  return query
    ? `/protected/notifications?${query}`
    : "/protected/notifications";
}

/**
 * 알림센터 필터 줄 (Task 040).
 *
 * **클라이언트 컴포넌트가 아니다.** 필터 상태는 URL이 전부이고 각 칩은 평범한 링크라
 * `useState`도 `useSearchParams`도 필요 없다. 덕분에 상태가 하나뿐이라 뒤로 가기·새로고침·
 * 링크 공유가 전부 자연스럽게 맞고, 읽음 처리 후 `router.refresh()`를 해도 필터가 유지된다.
 *
 * 조건은 서버 쿼리에 실린다(`listMyNotifications`). 이유는 그쪽 주석 참고 — 목록이 최신
 * 50건으로 잘리기 때문에 화면에서 거르면 필터 결과가 실제보다 적게 나온다.
 */
export function NotificationFilters({
  activeType,
  unreadOnly,
  labels,
}: {
  activeType?: NotificationType;
  unreadOnly: boolean;
  labels: Dictionary["notifications"];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label={labels.filters.typeGroupLabel}
      >
        <Button
          asChild
          size="sm"
          variant={activeType ? "outline" : "default"}
          aria-current={activeType ? undefined : "true"}
        >
          <Link href={buildNotificationFilterHref({ unreadOnly })}>
            {labels.filters.allTypes}
          </Link>
        </Button>
        {NOTIFICATION_TYPES.map((type) => {
          const isActive = activeType === type;
          return (
            <Button
              key={type}
              asChild
              size="sm"
              variant={isActive ? "default" : "outline"}
              aria-current={isActive ? "true" : undefined}
            >
              <Link
                // 같은 칩을 다시 누르면 해제된다. 토글이 아니면 "전체"로 돌아가려고
                // 매번 맨 앞 칩까지 시선을 옮겨야 한다.
                href={buildNotificationFilterHref({
                  type: isActive ? undefined : type,
                  unreadOnly,
                })}
              >
                {labels.types[TYPE_LABEL_KEY[type]]}
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="flex">
        <Button
          asChild
          size="sm"
          variant={unreadOnly ? "default" : "outline"}
          aria-pressed={unreadOnly}
        >
          <Link
            href={buildNotificationFilterHref({
              type: activeType,
              unreadOnly: !unreadOnly,
            })}
          >
            {labels.filters.unreadOnly}
          </Link>
        </Button>
      </div>
    </div>
  );
}
