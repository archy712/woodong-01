import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeNextPath } from "../auth/next-path";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // 로그인 없이 열람 가능한 경로. 새 공개 페이지를 추가하면 여기에도 등록해야 한다.
  // Task 032에서 실제 라우트와 대조해 정리했다: `/about`은 스타터킷 소개 페이지라 삭제했고,
  // `/login`은 이 앱에 존재한 적 없는 스타터킷 잔재였다(로그인은 `/auth/login`).
  const PUBLIC_PATH_PREFIXES = [
    "/auth", // 로그인·회원가입·비밀번호 재설정·이메일 확인
    "/invite", // 초대 코드 진입(로그인 유도는 페이지 안에서 처리)
    "/gallery", // 이하 개발자/QA용 데모 페이지 (PRD 3.8)
    "/icons",
    "/avatars",
    "/charts",
    "/tech-stack",
    "/privacy", // 이하 법적 고지 (Task 034) — 가입 전에 읽을 수 있어야 하므로 공개
    "/terms",
    // 이하 PWA 자원 (Task 038). 모든 페이지가 참조하고 브라우저가 로그인 상태와 무관하게
    // 가져간다 — 로그인 페이지로 리다이렉트되면 매니페스트/아이콘이 깨진다.
    // (`/sw.js`는 아예 proxy 매처에서 빠져 있다. Service Worker 업데이트 확인은 세션과
    //  무관해야 하고, 여기서 Supabase 왕복을 한 번 더 하게 만들 이유가 없다.)
    "/manifest.webmanifest",
    "/pwa-icon",
  ];

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !PUBLIC_PATH_PREFIXES.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix),
    )
  ) {
    // no user, potentially respond by redirecting the user to the login page
    // 로그인 후 원래 보려던 경로로 복귀시키기 위해 현재 경로를 `next`로 넘긴다(Task 017).
    // 값은 로그인/콜백 쪽에서 `sanitizeNextPath()`로 다시 검증한다.
    const url = request.nextUrl.clone();
    const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = "/auth/login";
    url.search = "";
    const nextPath = sanitizeNextPath(requestedPath);
    if (nextPath) {
      url.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
