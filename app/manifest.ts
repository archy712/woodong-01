import type { MetadataRoute } from "next";

/**
 * PWA 매니페스트 (Task 038).
 *
 * 웹 푸시 자체는 매니페스트 없이도 동작하지만, **iOS Safari는 홈 화면에 추가(PWA 설치)한
 * 경우에만** 푸시를 허용한다(PRD 9장). 설치가 가능하려면 `display: "standalone"`인
 * 매니페스트가 필요하다. iOS 사용자를 위한 안내 UI는 마이페이지의 알림 설정에 있다.
 *
 * ⚠️ 로그인 전에도 읽혀야 한다(모든 페이지가 `<link rel="manifest">`로 참조한다).
 * `lib/supabase/proxy.ts`의 `PUBLIC_PATH_PREFIXES`에 `/manifest.webmanifest`가 들어 있다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "우동 (Woodong) — 우리동호회",
    short_name: "우동",
    description: "동호회 운영·회비 정산·투표를 한 곳에서.",
    start_url: "/protected/groups",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // `app/globals.css`의 라이트 테마 `--background`(30 40% 98%)와 같은 값.
    background_color: "#FCFAF8",
    // 브랜드 코럴(components/logo.tsx).
    theme_color: "#EF6339",
    lang: "ko",
    // 같은 이미지를 `any`와 `maskable` 두 항목으로 준다(Next.js의 Manifest 타입은
    // `"any maskable"` 같은 공백 결합 값을 받지 않는다). 안드로이드 런처가 아이콘을
    // 원형/스쿼클로 잘라도 로고가 잘리지 않도록 아이콘 라우트가 여백을 넉넉히 두고 그린다.
    icons: [
      { src: "/pwa-icon", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/pwa-icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
