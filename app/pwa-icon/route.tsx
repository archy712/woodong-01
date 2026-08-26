import { ImageResponse } from "next/og";

/**
 * PWA 매니페스트·웹 푸시 알림이 쓰는 512×512 아이콘 (Task 038).
 *
 * `app/icon.tsx`(32×32)·`app/apple-icon.tsx`(180×180)와 같은 로고를 그리지만 별도 라우트로
 * 둔다. 그 둘은 Next.js가 파일명 해시가 붙은 URL로 서빙해서(`/icon?65f39837…`) 매니페스트나
 * Service Worker처럼 **URL을 문자열로 적어야 하는 곳**에서 가리킬 수 없다.
 *
 * 로고 색은 `components/logo.tsx`와 동일하다.
 */
const BACKGROUND = "#FCFAF8"; // --background 라이트(30 40% 98%)와 동일
const CORAL = "#EF6339";
const CORAL_DARK = "#D03D11";
const CORAL_TINT = "#FBE3DA";
const AMBER = "#F59F0A";

export const contentType = "image/png";

export function GET() {
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
      {/*
          maskable 아이콘은 가장자리 20%가 잘릴 수 있다. 로고를 512의 60%인 307px로 그려
          안전 영역(중앙 80% 원) 안에 들어오게 한다.
        */}
      <svg
        viewBox="0 0 48 48"
        width={307}
        height={307}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 20a18 6 0 0 0 36 0v3c0 9 -8 18 -18 18S6 32 6 23z"
          fill={CORAL_DARK}
        />
        <ellipse cx={24} cy={20} rx={18} ry={6} fill={CORAL} />
        <ellipse cx={24} cy={20} rx={12} ry={3.6} fill={CORAL_TINT} />
        <circle cx={17} cy={19} r={2.4} fill={AMBER} />
        <circle cx={30} cy={21} r={2} fill={AMBER} />
      </svg>
    </div>,
    { width: 512, height: 512 },
  );
}
