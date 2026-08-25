/**
 * 소셜 로그인 provider 브랜드 아이콘.
 *
 * 로그인/회원가입 버튼(`components/social-auth-buttons.tsx`)과 마이페이지 연동 계정 목록
 * (`components/me/linked-accounts.tsx`)이 같은 마크를 써야 해서 한 곳으로 모았다.
 * lucide-react에는 브랜드 로고가 없어 이 두 개만 인라인 SVG로 둔다(아이콘 규칙 예외).
 */

export function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.54-5.17 3.54-8.8z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09C3.27 21.3 7.31 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.31 14.33c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.68H1.3A11.98 11.98 0 0 0 0 12.05c0 1.94.46 3.77 1.3 5.37l4.01-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.68l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function KakaoIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3C6.99 3 3 6.2 3 10.14c0 2.5 1.68 4.7 4.21 5.96l-.86 3.16c-.08.28.23.5.47.34l3.79-2.5c.45.05.92.08 1.39.08 5.01 0 9-3.2 9-7.14S17.01 3 12 3z"
        fill="#191600"
      />
    </svg>
  );
}
