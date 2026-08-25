/**
 * 로그인 후 원래 보려던 경로로 되돌려 보내는 `next` 파라미터 공통 유틸 (Task 017).
 *
 * `next`는 URL로 들어오는 외부 입력이라 그대로 `redirect()`에 넘기면 오픈 리다이렉트가 된다.
 * 반드시 이 파일의 `sanitizeNextPath()`를 거친 값만 사용한다. 프록시(Edge)·서버 컴포넌트·
 * 클라이언트 컴포넌트 어디서나 쓰이므로 런타임 의존성이 없는 순수 함수로 유지한다.
 */

/** 복귀 경로가 없거나 신뢰할 수 없을 때의 기본 목적지(PRD 6장 IA, Task 017). */
export const DEFAULT_AFTER_LOGIN_PATH = "/protected/groups";

/**
 * 로그인 후 되돌아가면 안 되는 경로.
 * 인증 화면으로 복귀시키면 로그인 → 로그인 루프가 생긴다.
 */
const BLOCKED_PREFIXES = ["/auth"];

/** URL 파싱용 더미 오리진. 상대 경로가 절대 URL로 탈출했는지 판별하는 데만 쓴다. */
const PARSE_BASE = "http://woodong.invalid";

/**
 * 외부에서 들어온 `next` 값을 "같은 오리진의 내부 경로"로만 좁힌다.
 * 통과하지 못하면 `null`을 반환하고, 호출부는 기본 경로로 폴백한다.
 */
export function sanitizeNextPath(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  // `//evil.com`(프로토콜 상대 URL)과 브라우저가 `/`로 정규화해버리는 역슬래시를 먼저 거른다.
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("\\")) return null;
  // 제어문자/공백이 섞인 값은 파서마다 해석이 달라 오픈 리다이렉트 우회 수단이 된다.
  if (/\s/.test(value)) return null;
  const hasControlChar = [...value].some((char) => {
    const code = char.codePointAt(0) ?? 0;
    return code < 0x20 || code === 0x7f;
  });
  if (hasControlChar) return null;

  let parsed: URL;
  try {
    parsed = new URL(value, PARSE_BASE);
  } catch {
    return null;
  }

  // base가 그대로 남아 있어야 = 절대 URL이 아니었어야 내부 경로다.
  if (parsed.origin !== PARSE_BASE) return null;

  const isBlocked = BLOCKED_PREFIXES.some(
    (prefix) =>
      parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`),
  );
  if (isBlocked) return null;

  // 해시는 애초에 서버로 전달되지 않으므로 경로 + 쿼리만 복원한다.
  return `${parsed.pathname}${parsed.search}`;
}

/** `next` 값을 검증하고, 쓸 수 없으면 기본 목적지로 폴백한다. */
export function resolveNextPath(value: string | null | undefined): string {
  return sanitizeNextPath(value) ?? DEFAULT_AFTER_LOGIN_PATH;
}

/**
 * 로그인 화면으로 유도하는 링크를 만든다.
 * 검증에 실패한 경로는 아예 붙이지 않아 잘못된 `next`가 URL에 남지 않게 한다.
 */
export function buildLoginPath(next: string | null | undefined): string {
  const sanitized = sanitizeNextPath(next);
  return sanitized
    ? `/auth/login?next=${encodeURIComponent(sanitized)}`
    : "/auth/login";
}
