/**
 * 초대 코드 생성 (Task 020).
 *
 * 코드는 카카오톡 등으로 링크가 아니라 **코드만** 전달되는 경우가 있어 사람이 눈으로 읽고
 * 손으로 옮겨 적을 수 있어야 한다. 그래서 서로 헷갈리는 글자(`0`/`O`, `1`/`I`/`L`)를 빼고
 * 대문자 + 숫자로만 구성하고, 4글자씩 하이픈으로 끊어 `ABCD-EFGH` 형태로 만든다.
 *
 * 알파벳 길이를 **정확히 32**로 맞춘 것은 의도적이다. `crypto.getRandomValues()`가 주는
 * 0~255 바이트를 `% 32`로 접으면 256이 32의 배수라 모든 글자가 정확히 같은 확률로 나온다
 * (31이나 33이면 앞쪽 글자가 미세하게 더 자주 뽑히는 modulo bias가 생긴다).
 *
 * 경우의 수는 32^8 ≈ 1.1조로, 무작위 대입으로 유효한 코드를 찾아내는 건 현실적이지 않다.
 * (초대 코드 유출 자체에 대한 대응은 만료·최대 사용 횟수 필수화 + 재발급 시 기존 코드
 * 무효화다 — PRD 9장 "초대 코드 보안".)
 */
const INVITE_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
const INVITE_CODE_LENGTH = 8;

export function generateInviteCode(): string {
  const bytes = new Uint8Array(INVITE_CODE_LENGTH);
  crypto.getRandomValues(bytes);

  const chars = Array.from(
    bytes,
    (byte) => INVITE_CODE_ALPHABET[byte % INVITE_CODE_ALPHABET.length],
  );

  return `${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}

/**
 * 사용자가 입력하거나 붙여넣은 코드를 DB 조회용으로 정규화한다.
 *
 * 소문자로 바꿔 공유되거나 앞뒤에 공백이 붙는 경우가 흔해서 대문자 + trim으로 맞춘다.
 * (DB 쪽 `woodong_get_invite_preview()`/`woodong_redeem_group_invite()`도 같은 정규화를
 * 한 번 더 하므로, 이 함수를 거치지 않은 호출도 안전하다.)
 */
export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase();
}
