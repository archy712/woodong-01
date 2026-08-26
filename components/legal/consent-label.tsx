import Link from "next/link";

import type { Dictionary } from "@/lib/i18n/dictionaries";

/** `{terms}`/`{privacy}` 토큰과 그 사이의 일반 텍스트로 잘라낸다. */
const TOKEN_PATTERN = /(\{terms\}|\{privacy\})/g;

/**
 * 회원가입 필수 동의 문구(Task 034).
 *
 * 동의 문구의 어순은 언어마다 다르다(한국어 "{terms} 및 {privacy}에 동의합니다",
 * 영어 "I agree to the {terms} and the {privacy}"). 그래서 문장을 조각내 이어 붙이지
 * 않고 사전에 토큰이 박힌 문장 하나를 두고 여기서 링크로 치환한다.
 */
export function ConsentLabel({ legal }: { legal: Dictionary["legal"] }) {
  const linkClassName =
    "font-medium text-foreground underline underline-offset-4";

  return (
    <>
      {legal.consent.label.split(TOKEN_PATTERN).map((part, index) => {
        if (part !== "{terms}" && part !== "{privacy}") {
          return <span key={index}>{part}</span>;
        }

        const isTerms = part === "{terms}";
        return (
          <Link
            key={index}
            href={isTerms ? "/terms" : "/privacy"}
            // 이 문구는 <Label htmlFor>로 감싸여 있어서, 링크 클릭이 그대로 라벨까지
            // 올라가면 "약관을 읽으려고 눌렀을 뿐인데 동의 체크가 켜지는" 일이 생긴다.
            // 전파를 끊어 링크는 링크로만 동작하게 한다.
            onClick={(event) => event.stopPropagation()}
            // 새 탭으로 여는 이유: 가입 폼은 이메일·비밀번호를 React state로만 들고
            // 있어서 같은 탭에서 이동했다 돌아오면 입력값이 전부 날아간다.
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {isTerms
              ? legal.consent.termsLinkText
              : legal.consent.privacyLinkText}
          </Link>
        );
      })}
    </>
  );
}
