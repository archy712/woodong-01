import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * 회비 리마인드 lazy 처리 (Task 028).
 *
 * 1차 MVP에는 스케줄러가 없다. 그래서 정해진 시각에 보내는 대신, 멤버가 **회비 대시보드나
 * 알림센터를 여는 시점**에 밀린 리마인드가 있는지 확인해 만든다(PRD 3.3/3.4-a AC).
 * ⚠️ 실시간 배치 발송(Supabase Cron/pg_cron)은 **2차 확장(Task 037)**이다.
 *
 * 이 모듈은 `queries/`가 아니라 별도 파일에 둔다 — 이름은 조회처럼 불리지만 실제로는
 * **렌더 도중 쓰기를 하는** 함수라서, 읽기 전용 규약을 지키는 `queries/*`와 섞이면 안 된다.
 * 같은 이유로 Server Action(`"use server"`)도 아니다: 렌더 중에는 `revalidatePath`를 호출할
 * 수 없고, 호출부가 같은 렌더에서 곧바로 다시 읽으므로 재검증도 필요 없다.
 */

type Client = SupabaseClient<Database>;

export type ProcessDueRemindersOptions = {
  /** 특정 모임으로 좁힐 때 지정. 생략하면 사용자가 속한 모든 모임의 미납 청구가 대상이다. */
  groupId?: string;
  /** 알림 제목에서 회비 항목 이름 뒤에 붙는 문구(i18n). 생략 시 RPC의 한국어 기본값. */
  titleSuffix?: string;
  /** 알림 본문(i18n). 생략 시 RPC의 한국어 기본값. */
  body?: string;
};

/**
 * 주기가 지난 미납 청구에 대해 리마인드 알림을 만든다. 만들어진 건수를 반환한다.
 *
 * 실패해도 절대 throw하지 않는다 — 리마인드는 화면의 부수적인 기능이고, 이것 때문에 회비
 * 대시보드나 알림센터 자체가 열리지 않으면 훨씬 나쁘다. 실패는 로그로만 남긴다.
 *
 * 중복 방지와 `in_app` 설정 확인은 전부 RPC 안에서 한 문장으로 처리된다(호출부가 같은 판단을
 * 중복해서 하면 두 곳의 규칙이 갈라진다).
 */
export async function processDueReminders(
  supabase: Client,
  options: ProcessDueRemindersOptions = {},
): Promise<number> {
  const { data, error } = await supabase.rpc("woodong_process_due_reminders", {
    ...(options.groupId ? { p_group_id: options.groupId } : {}),
    ...(options.titleSuffix ? { p_title_suffix: options.titleSuffix } : {}),
    ...(options.body ? { p_body: options.body } : {}),
  });

  if (error) {
    console.error("[due-reminders] processDueReminders failed:", error);
    return 0;
  }

  return data ?? 0;
}
