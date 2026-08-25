import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

/** 방금 로그인으로 생성된 identity인지 판정할 때 허용하는 시간 오차. */
const RECENT_IDENTITY_WINDOW_MS = 60_000;
/** 계정 생성과 identity 생성이 같은 최초 가입 흐름이었는지 구분하는 최소 간격. */
const SAME_SIGNUP_WINDOW_MS = 5_000;

/**
 * Supabase Auth는 verified 이메일이 일치하면 기존 계정에 새 provider identity를 자동으로
 * 붙인다(플랫폼 기본 동작). 우동은 이 동작을 그대로 수용하되 사용자에게 사후 고지해야 하므로
 * (PRD 3.6.2), "계정은 예전에 만들어졌는데 identity는 방금 생겼다"는 조합으로 자동 연결을 판별한다.
 */
function wasLinkedToExistingAccount(user: User): boolean {
  const identities = user.identities ?? [];
  if (identities.length < 2) return false;

  const newestCreatedAt = identities.reduce<number | null>(
    (latest, identity) => {
      if (!identity.created_at) return latest;
      const createdAt = new Date(identity.created_at).getTime();
      return latest === null || createdAt > latest ? createdAt : latest;
    },
    null,
  );
  if (newestCreatedAt === null) return false;

  const userCreatedAt = new Date(user.created_at).getTime();
  return (
    Date.now() - newestCreatedAt < RECENT_IDENTITY_WINDOW_MS &&
    newestCreatedAt - userCreatedAt > SAME_SIGNUP_WINDOW_MS
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 오픈 리다이렉트 방지: 내부 경로만 허용한다(전체 검증 규칙은 Task 017에서 확장).
  const requestedNext = searchParams.get("next");
  const next =
    requestedNext && requestedNext.startsWith("/")
      ? requestedNext
      : "/protected";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent("No code provided")}`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
    );
  }

  const redirectUrl = new URL(next, origin);
  const user = data.user;

  if (user) {
    if (wasLinkedToExistingAccount(user)) {
      redirectUrl.searchParams.set("linked", "1");
    }
    // Kakao 비즈 앱 미등록 계정은 account_email을 내려주지 않아 이메일 없이 가입된다.
    // 이 경우 마이페이지 수동 연동 안내를 띄운다(PRD 3.6.2).
    if (!user.email) {
      redirectUrl.searchParams.set("no_email", "1");
    }
  }

  return NextResponse.redirect(redirectUrl);
}
