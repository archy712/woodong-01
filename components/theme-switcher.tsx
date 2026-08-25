"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

const emptySubscribe = () => () => {};

// The server always renders the initial (pre-hydration) UI, so we defer to
// the client-only value here instead of setting state from an effect.
const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

/**
 * 테마 전환 드롭다운.
 *
 * 트리거는 아이콘 하나뿐이라 **접근 가능한 이름이 없으면 스크린리더에 그냥 "버튼"으로
 * 읽힌다**(Task 031에서 Lighthouse `button-name` 실패로 잡힘). 아이콘은 `aria-hidden`으로
 * 빼고 `sr-only` 텍스트로 이름을 준다 — `aria-label`만 쓰면 번역 문구가 접근성 트리에만
 * 존재해 자동 번역·사용자 스타일 도구에서 놓치기 쉽다.
 */
const ThemeSwitcher = ({ labels }: { labels: Dictionary["nav"]["theme"] }) => {
  const isClient = useIsClient();
  const { theme, setTheme } = useTheme();

  if (!isClient) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">{labels.label}</span>
          {theme === "light" ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              aria-hidden
              className={"text-muted-foreground"}
            />
          ) : theme === "dark" ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              aria-hidden
              className={"text-muted-foreground"}
            />
          ) : (
            <Laptop
              key="system"
              size={ICON_SIZE}
              aria-hidden
              className={"text-muted-foreground"}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{labels.light}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{labels.dark}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{labels.system}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
