"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BellIcon,
  Loader2Icon,
  MegaphoneIcon,
  VoteIcon,
  WalletIcon,
} from "lucide-react";

import type { NotificationType } from "@/lib/woodong/notifications";
import { renderNotificationText } from "@/lib/woodong/notification-text";
import type { NotificationListItem } from "@/lib/woodong/queries/notifications";
import {
  markAllNotificationsReadAction,
  markNotificationClickedAction,
} from "@/lib/woodong/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  notice: MegaphoneIcon,
  due_reminder: WalletIcon,
  vote_start: VoteIcon,
  vote_close: VoteIcon,
  settlement_published: WalletIcon,
};

function resolveHref(notification: NotificationListItem): string {
  const base = `/protected/groups/${notification.group_id}`;
  switch (notification.related_type) {
    case "vote":
      return `${base}/votes/${notification.related_id}`;
    case "announcement":
      return `${base}/announcements`;
    case "due":
      return `${base}/dues`;
    case "settlement":
      return `${base}/dues/settlements/${notification.related_id}`;
    default:
      return base;
  }
}

/**
 * 사용자가 링크를 "이 탭에서 열려는" 클릭인지 판별한다.
 *
 * 새 탭/새 창(⌘·Ctrl·Shift·Alt, 휠 클릭)으로 여는 경우에는 가로채지 않고 브라우저에 맡긴다.
 * 그 경로에서는 클릭 기록이 남지 않지만, 이동을 가로채 막는 쪽이 사용자에게 더 나쁘다.
 */
function isPlainLeftClick(event: React.MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * 알림센터 목록 (Task 026에서 실데이터 연동).
 *
 * 목록은 로컬 state로 들지 않고 서버가 내려준 값을 그대로 그린다(공지 목록·회비 대시보드와
 * 같은 규약). 읽음/클릭 처리는 Server Action이 `read_at`/`clicked_at`을 갱신하고
 * `revalidatePath` + `router.refresh()`로 다시 받아온다.
 *
 * 클릭은 **Action을 await한 뒤에 이동**한다. 이동을 먼저 시작하면 브라우저가 진행 중인
 * 요청을 취소해 클릭 기록이 조용히 누락될 수 있는데, 그러면 KPI "알림 클릭률"이 실제보다
 * 낮게 잡힌다(PRD 10장). 기록이 실패하면 토스트만 띄우고 **이동은 그대로 진행한다** —
 * 지표 때문에 사용자가 알림을 못 여는 것이 더 나쁘다.
 */
export function NotificationsList({
  notifications,
  isFiltered = false,
  labels,
}: {
  notifications: NotificationListItem[];
  /**
   * 필터가 걸린 상태인지 (Task 040).
   *
   * 빈 목록의 의미가 달라진다 — "받은 알림이 없다"와 "조건에 맞는 알림이 없다"를 같은 문구로
   * 보여주면, 필터를 켜 둔 걸 잊은 사용자가 알림이 사라졌다고 생각한다.
   */
  isFiltered?: boolean;
  labels: Dictionary["notifications"];
}) {
  const router = useRouter();
  const [isMarkingAll, startMarkAll] = useTransition();
  const [openingId, setOpeningId] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  function handleMarkAllRead() {
    startMarkAll(async () => {
      const result = await markAllNotificationsReadAction();

      if (!result.success) {
        toast.error(result.formError ?? labels.markReadErrorToast);
        return;
      }

      toast.success(
        `${result.data.markedCount}${labels.markAllReadSuccessSuffix}`,
      );
      router.refresh();
    });
  }

  async function handleOpen(
    event: React.MouseEvent<HTMLAnchorElement>,
    notification: NotificationListItem,
  ) {
    if (!isPlainLeftClick(event)) {
      return;
    }

    event.preventDefault();
    const href = resolveHref(notification);
    setOpeningId(notification.id);

    const result = await markNotificationClickedAction(notification.id);

    if (!result.success) {
      toast.error(result.formError ?? labels.markReadErrorToast);
    }

    // 헤더의 미읽음 뱃지는 루트 레이아웃에 있어 클라이언트 내비게이션만으로는 다시 그려지지
    // 않는다. 이동 전에 서버 트리를 갱신해야 이동 직후 뱃지가 맞는 숫자를 보여준다.
    router.refresh();
    router.push(href);
    setOpeningId(null);
  }

  if (notifications.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BellIcon />
          </EmptyMedia>
          <EmptyTitle>
            {isFiltered ? labels.filters.emptyFiltered : labels.emptyState}
          </EmptyTitle>
          {isFiltered ? (
            <EmptyDescription>
              <Link
                href="/protected/notifications"
                className="underline underline-offset-4"
              >
                {labels.filters.resetButton}
              </Link>
            </EmptyDescription>
          ) : (
            <EmptyDescription>{labels.allReadMessage}</EmptyDescription>
          )}
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount}${labels.unreadCountSuffix}`
            : labels.allReadMessage}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || isMarkingAll}
        >
          {isMarkingAll && <Loader2Icon className="animate-spin" />}
          {labels.markAllReadButton}
        </Button>
      </div>

      <ItemGroup className="gap-1">
        {notifications.map((notification) => {
          const Icon = TYPE_ICON[notification.type];
          const isUnread = !notification.read_at;
          const isOpening = openingId === notification.id;
          // 저장된 문자열이 아니라 **읽는 사람의 사전**으로 조립한다(Task 040).
          // 배치가 만든 알림도 이 시점에 번역된다.
          const text = renderNotificationText(notification, labels);
          return (
            <Item key={notification.id} asChild variant="outline" size="sm">
              <Link
                href={resolveHref(notification)}
                onClick={(event) => handleOpen(event, notification)}
                aria-busy={isOpening}
                className={cn("min-h-11", isUnread && "bg-accent/40")}
              >
                <ItemMedia variant="icon">
                  {isOpening ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Icon />
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {text.title}
                    {isUnread && (
                      <Badge
                        variant="default"
                        aria-label={labels.unreadLabel}
                        className="h-2 w-2 rounded-full p-0"
                      />
                    )}
                  </ItemTitle>
                  <ItemDescription>{text.body}</ItemDescription>
                  {notification.group_name && (
                    <ItemDescription className="text-xs">
                      {notification.group_name}
                    </ItemDescription>
                  )}
                </ItemContent>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleDateString(
                    "ko-KR",
                  )}
                </span>
              </Link>
            </Item>
          );
        })}
      </ItemGroup>
    </div>
  );
}
