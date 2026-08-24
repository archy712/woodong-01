import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * 우동 브랜드 로고마크: 그릇 + 면발. "우동"이라는 이름의 정체성(음식 펀네이밍)은 아이콘이
 * 담당하고, "우리 동호회"라는 뜻풀이는 옆의 워드마크/태그라인(Logo 컴포넌트)이 텍스트로
 * 전담한다 — 아이콘 하나로 의미까지 설명하려 하지 않는다. 김(steam)은 "뜨거운 음식"이라는
 * 신호가 가장 강해 오독을 유발하므로 넣지 않는다.
 * 테마와 무관하게 항상 같은 색으로 보여야 하는 브랜드 자산이므로 CSS 변수가 아니라
 * tailwind.config.ts의 brand.coral/brand.amber와 동일한 고정 HEX 값을 그대로 사용한다.
 * (두 곳의 값은 항상 함께 갱신할 것)
 */
const CORAL = "#EF6339";
const CORAL_DARK = "#D03D11";
const CORAL_TINT = "#FBE3DA";
const NOODLE = "#FDF1DC";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 20a18 6 0 0 0 36 0v3c0 9 -8 18 -18 18S6 32 6 23z"
        fill={CORAL_DARK}
      />
      <ellipse cx={24} cy={20} rx={18} ry={6} fill={CORAL} />
      <ellipse cx={24} cy={20} rx={13} ry={4} fill={CORAL_TINT} opacity={0.5} />
      {/* 면발 */}
      <path
        d="M12 19q2 -2.2 4 0t4 0t4 0t4 0t4 0t4 0"
        stroke={NOODLE}
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 22q2 2.2 4 0t4 0t4 0t4 0t4 0t3 0"
        stroke={NOODLE}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.85}
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  locale,
  taglineText,
}: {
  className?: string;
  markClassName?: string;
  /** locale이 "ko"이면 taglineText 대신 "우(리) 동(호회)" 강조 표기를 렌더링한다. */
  locale?: Locale;
  /** "우동"이 "우리 동호회"의 줄임말임을 드러내는 짧은 태그라인. 없으면 표시하지 않는다. */
  taglineText?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          우동
        </span>
        {taglineText ? (
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold text-muted-foreground">
              {locale === "ko" ? (
                <>
                  <span className="text-brand-coral">우</span>리
                  <span className="text-brand-coral">동</span>호회
                </>
              ) : (
                taglineText
              )}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground/70">
              Woodong
            </span>
          </span>
        ) : null}
      </span>
    </span>
  );
}
