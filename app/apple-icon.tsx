import { ImageResponse } from "next/og";

// 브랜드 로고마크(components/logo.tsx)와 동일한 값을 그대로 사용한다.
const BACKGROUND = "#FCFAF8"; // --background 라이트(30 40% 98%)와 동일
const CORAL = "#EF6339";
const CORAL_DARK = "#D03D11";
const CORAL_TINT = "#FBE3DA";
const AMBER = "#F59F0A";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BACKGROUND,
      }}
    >
      <svg
        viewBox="0 0 48 48"
        width={120}
        height={120}
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
        <ellipse
          cx={24}
          cy={20}
          rx={13}
          ry={4}
          fill={CORAL_TINT}
          opacity={0.5}
        />
        <circle cx={14} cy={27} r={2.4} fill={AMBER} />
        <circle cx={24} cy={30} r={2.4} fill={AMBER} />
        <circle cx={34} cy={27} r={2.4} fill={AMBER} />
      </svg>
    </div>,
    { ...size },
  );
}
