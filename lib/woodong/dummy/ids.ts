/**
 * 더미 데이터 전용 결정론적 UUID 생성기.
 *
 * `crypto.randomUUID()`는 매 렌더링/재빌드마다 값이 바뀌어 더미 데이터 간 참조(외래키 성격의
 * `group_id`/`due_cycle_id`/`vote_id` 등)를 안정적으로 맺을 수 없다. 대신 숫자 시드를
 * zod의 `.uuid()` 검증(버전 니블 1-5, variant 니블 8-9a-b)을 통과하는 고정 UUID로 변환해
 * 여러 더미 파일에서 같은 시드를 참조하면 항상 같은 ID를 얻도록 한다(실제 Supabase 테이블과는
 * 무관 — Task 012는 순수 더미 렌더링만 다룬다).
 */
function dummyUuid(section: number, n: number): string {
  const seg = ((section % 16) * 1_000_000 + n).toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${seg}`;
}

// 섹션 코드: 1=모임, 2=사용자, 3=초대, 4=회비항목, 5=회비청구, 6=납부이력,
// 7=공지, 8=투표, 9=투표선택지, 10=알림
export const GROUP_ID = {
  running: dummyUuid(1, 1),
  hiking: dummyUuid(1, 2),
  bookClub: dummyUuid(1, 3),
} as const;

export function userId(n: number): string {
  return dummyUuid(2, n);
}

export function inviteId(n: number): string {
  return dummyUuid(3, n);
}

export function dueCycleId(n: number): string {
  return dummyUuid(4, n);
}

export function dueId(n: number): string {
  return dummyUuid(5, n);
}

export function paymentId(n: number): string {
  return dummyUuid(6, n);
}

export function announcementId(n: number): string {
  return dummyUuid(7, n);
}

export function voteId(n: number): string {
  return dummyUuid(8, n);
}

export function voteOptionId(n: number): string {
  return dummyUuid(9, n);
}

export function notificationId(n: number): string {
  return dummyUuid(10, n);
}
