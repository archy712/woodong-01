import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon, apple-icon (app/icon.tsx, app/apple-icon.tsx가 생성하는 동적 파비콘 라우트,
     *   Task 010 — 로그인 여부와 무관하게 항상 응답해야 하므로 favicon.ico와 동일하게 제외)
     * - sw.js (Service Worker, Task 038 — 브라우저가 주기적으로 업데이트를 확인하는
     *   파일이라 세션 검사를 태울 이유가 없고, 로그인 페이지로 리다이렉트되면 등록이 깨진다)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon$|apple-icon$|sw\\.js$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
