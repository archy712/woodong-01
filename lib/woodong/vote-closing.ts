import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * 투표 lazy 마감 (Task 030).
 *
 * 1차 MVP에는 스케줄러가 없다. 그래서 마감 시각에 맞춰 닫는 대신, 멤버가 **투표 목록이나
 * 상세를 여는 시점**에 마감 시각이 지난 투표를 닫고 결과 알림을 만든다(PRD 3.5 AC).
 * ⚠️ 실시간 배치 마감(Supabase Cron/pg_cron)은 **2차 확장(Task 037)**이다.
 *
 * 회비 리마인드(`due-reminders.ts`)와 같은 이유로 `queries/`가 아니라 별도 파일에 둔다 —
 * 이름은 조회처럼 불리지만 실제로는 **렌더 도중 쓰기를 하는** 함수라서, 읽기 전용 규약을
 * 지키는 `queries/*`와 섞이면 안 된다. 같은 이유로 Server Action(`"use server"`)도 아니다:
 * 렌더 중에는 `revalidatePath`를 호출할 수 없고, 호출부가 같은 렌더에서 곧바로 다시 읽으므로
 * 재검증도 필요 없다.
 */

type Client = SupabaseClient<Database>;

export type ProcessExpiredVotesOptions = {
  /** 특정 모임으로 좁힐 때 지정. 생략하면 사용자가 속한 모든 모임의 만료 투표가 대상이다. */
  groupId?: string;
  /** 결과 알림 제목(i18n). 뒤에 투표 제목이 붙는다. 생략 시 RPC의 한국어 기본값. */
  title?: string;
  /** 결과 알림 본문(i18n). 생략 시 RPC의 한국어 기본값. */
  body?: string;
};

/**
 * 마감 시각이 지난 투표를 `closed`로 전환하고, 이번에 마감된 투표 수를 반환한다.
 *
 * 실패해도 절대 throw하지 않는다 — 마감 전환은 화면의 부수적인 처리이고, 이것 때문에 투표
 * 목록이나 상세 자체가 열리지 않으면 훨씬 나쁘다. 실패는 로그로만 남긴다. 화면은 그동안에도
 * `closes_at`을 직접 보고 참여 위젯을 감추므로(쿼리 계층의 `isClosed`), 상태 전환이 늦어져도
 * 마감된 투표에 참여할 수는 없다.
 *
 * "한 번만 마감 → 알림도 한 번만"은 전부 RPC 안에서 한 문장(UPDATE 선점)으로 보장된다.
 * 호출부가 같은 판단을 중복해서 하면 두 곳의 규칙이 갈라진다.
 */
export async function processExpiredVotes(
  supabase: Client,
  options: ProcessExpiredVotesOptions = {},
): Promise<number> {
  const { data, error } = await supabase.rpc("woodong_close_expired_votes", {
    ...(options.groupId ? { p_group_id: options.groupId } : {}),
    ...(options.title ? { p_title: options.title } : {}),
    ...(options.body ? { p_body: options.body } : {}),
  });

  if (error) {
    console.error("[vote-closing] processExpiredVotes failed:", error);
    return 0;
  }

  return data ?? 0;
}
