import { cn } from "@/lib/utils";

/**
 * 우동 브랜드 로고마크: 그릇(모임이 열리는 자리) + 그릇을 둘러싼 3개의 점(모여든 사람) + 김.
 * 테마와 무관하게 항상 같은 색으로 보여야 하는 브랜드 자산이므로 CSS 변수가 아니라
 * tailwind.config.ts의 brand.coral/brand.amber와 동일한 고정 HEX 값을 그대로 사용한다.
 * (두 곳의 값은 항상 함께 갱신할 것)
 */
const CORAL = "#EF6339";
const CORAL_DARK = "#D03D11";
const CORAL_TINT = "#FBE3DA";
const AMBER = "#F59F0A";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-6", className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12q1.5 -3 0 -6"
        stroke={AMBER}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M28 12q1.5 -3 0 -6"
        stroke={AMBER}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M6 20a18 6 0 0 0 36 0v3c0 9 -8 18 -18 18S6 32 6 23z"
        fill={CORAL_DARK}
      />
      <ellipse cx={24} cy={20} rx={18} ry={6} fill={CORAL} />
      <ellipse cx={24} cy={20} rx={13} ry={4} fill={CORAL_TINT} opacity={0.5} />
      <circle cx={14} cy={27} r={2.4} fill={AMBER} />
      <circle cx={24} cy={30} r={2.4} fill={AMBER} />
      <circle cx={34} cy={27} r={2.4} fill={AMBER} />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="text-lg font-bold tracking-tight text-foreground">
        우동
      </span>
    </span>
  );
}
