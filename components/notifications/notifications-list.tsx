"use client";

import { useState } from "react";
import Link from "next/link";
import { BellIcon, MegaphoneIcon, VoteIcon, WalletIcon } from "lucide-react";

import type {
  Notification,
  NotificationType,
} from "@/lib/woodong/notifications";
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

function resolveHref(notification: Notification): string {
  const base = `/protected/groups/${notification.group_id}`;
  switch (notification.related_type) {
    case "vote":
      return `${base}/votes/${notification.related_id}`;
    case "announcement":
      return `${base}/announcements`;
    case "due":
      return `${base}/dues`;
    default:
      return base;
  }
}

/**
 * 알림센터 목록. 실제 `read_at`/`clicked_at` 갱신(RLS 컬럼 보호 트리거 대상)은 Task 026 몫이라,
 * 이번 Task에서는 클릭/모두 읽음 처리를 로컬 state로만 반영한다(새로고침하면 초기 더미 상태로 복귀).
 */
export function NotificationsList({
  initialNotifications,
  labels,
}: {
  initialNotifications: Notification[];
  labels: Dictionary["notifications"];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  function markAllRead() {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now })),
    );
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n,
      ),
    );
  }

  if (notifications.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BellIcon />
          </EmptyMedia>
          <EmptyTitle>{labels.emptyState}</EmptyTitle>
          <EmptyDescription>{labels.pageTitle}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount}${labels.unreadLabel}`
            : labels.readLabel}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          {labels.markAllReadButton}
        </Button>
      </div>

      <ItemGroup className="gap-1">
        {notifications.map((notification) => {
          const Icon = TYPE_ICON[notification.type];
          const isUnread = !notification.read_at;
          return (
            <Item key={notification.id} asChild variant="outline" size="sm">
              <Link
                href={resolveHref(notification)}
                onClick={() => markRead(notification.id)}
                className={cn(isUnread && "bg-accent/40")}
              >
                <ItemMedia variant="icon">
                  <Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {notification.title}
                    {isUnread && (
                      <Badge
                        variant="default"
                        className="h-2 w-2 rounded-full p-0"
                      />
                    )}
                  </ItemTitle>
                  <ItemDescription>{notification.body}</ItemDescription>
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
