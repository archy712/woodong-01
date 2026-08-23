import { Bell } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

/**
 * 로그인 사용자에게만 "내 모임" 링크와 알림 종 아이콘을 보여준다.
 * 안 읽은 알림 뱃지는 udong_notifications가 붙는 Task 026에서 이 컴포넌트에 추가한다.
 */
export async function HeaderAuthNav({
  groupsLabel,
  notificationsLabel,
}: {
  groupsLabel: string;
  notificationsLabel: string;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return null;
  }

  return (
    <>
      <Link
        href="/protected/groups"
        className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
      >
        {groupsLabel}
      </Link>
      <Button
        asChild
        variant="ghost"
        size="icon"
        aria-label={notificationsLabel}
      >
        <Link href="/protected/notifications">
          <Bell className="size-5 text-muted-foreground" />
        </Link>
      </Button>
    </>
  );
}
