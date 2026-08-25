import { Bell } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { countUnreadNotifications } from "@/lib/woodong/queries/notifications";

/** 뱃지에 그대로 적는 최대 숫자. 이보다 많으면 "99+"로 줄인다(폭이 종 아이콘을 밀어내지 않게). */
const MAX_BADGE_COUNT = 99;

/**
 * 로그인 사용자에게만 "내 모임" 링크와 알림 종 아이콘을 보여준다.
 *
 * 미읽음 뱃지(Task 026)는 개수만 세는 `head` 요청이라 페이로드가 0이다. 이 컴포넌트는
 * 모든 라우트의 헤더에서 매 요청 실행되므로, 실패해도 0으로 폴백해 뱃지만 사라지고
 * 페이지는 정상 렌더링된다(`countUnreadNotifications` 참고).
 */
export async function HeaderAuthNav({
  groupsLabel,
  notificationsLabel,
  unreadBadgeLabel,
}: {
  groupsLabel: string;
  notificationsLabel: string;
  unreadBadgeLabel: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return null;
  }

  const unreadCount = await countUnreadNotifications(supabase);

  return (
    <>
      <Link
        href="/protected/groups"
        className="hidden min-h-11 min-w-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
      >
        {groupsLabel}
      </Link>
      <Button
        asChild
        variant="ghost"
        size="icon"
        aria-label={
          unreadCount > 0
            ? `${notificationsLabel} (${unreadBadgeLabel} ${unreadCount})`
            : notificationsLabel
        }
      >
        <Link href="/protected/notifications" className="relative">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-foreground"
            >
              {unreadCount > MAX_BADGE_COUNT
                ? `${MAX_BADGE_COUNT}+`
                : unreadCount}
            </span>
          )}
        </Link>
      </Button>
    </>
  );
}
