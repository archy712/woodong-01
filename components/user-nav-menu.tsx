"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 헤더 우측의 아바타+이메일 드롭다운. profiles.avatar_key는 다른 앱 전용이라
 * 재사용하지 않으므로(PRD 5.1) 아바타는 이메일 첫 글자로만 표시한다.
 */
export function UserNavMenu({
  email,
  profileLabel,
  logoutLabel,
}: {
  email: string;
  profileLabel: string;
  logoutLabel: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    // 로그아웃 클릭 시점에만 Supabase 브라우저 클라이언트를 받는다 — 이 메뉴는 루트
    // 레이아웃의 헤더에 있어서, 최상단 import는 **모든 페이지**의 초기 번들에 클라이언트를
    // 얹는다(Task 031). 클릭은 이미 사용자를 기다리게 하는 동작이라 이때 받아도 늦지 않다.
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    // 헤더(AuthButton/HeaderAuthNav)는 루트 레이아웃의 서버 컴포넌트라
    // Router Cache에 담겨 있다. refresh() 없이 이동하면 캐시된 "로그인 상태"
    // 헤더가 그대로 재사용되어, 세션은 끊겼는데 이메일 메뉴가 남는다.
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 px-2 has-[>svg]:px-2"
        >
          <Avatar size="sm">
            <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-sm font-medium sm:inline-block">
            {email}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/protected/profile">{profileLabel}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
