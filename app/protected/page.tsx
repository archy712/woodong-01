import { redirect } from "next/navigation";

import { DEFAULT_AFTER_LOGIN_PATH } from "@/lib/auth/next-path";

/**
 * `/protected`는 스타터킷이 남긴 튜토리얼 화면이었고 우동에는 대응하는 콘텐츠가 없다(Task 032).
 * 다만 세그먼트를 통째로 지우면 북마크·구 링크가 404가 되므로, 보호 영역의 실제 진입점인
 * 모임 목록으로 넘긴다(로그인 직후 기본 경로와 동일한 상수를 쓴다).
 */
export default function ProtectedPage() {
  redirect(DEFAULT_AFTER_LOGIN_PATH);
}
