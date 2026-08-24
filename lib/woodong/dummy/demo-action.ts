import type { ActionResult } from "@/lib/woodong/common";

/**
 * Task 012 전용 데모 액션 팩토리.
 *
 * 회비/투표/공지/모임 설정 폼의 실제 Server Action(Supabase INSERT/UPDATE)은 각각
 * Phase 4~6(Task 019~030)에서 구현될 예정이라, 이번 Task에서는 `useServerActionForm`이
 * 기대하는 `(input) => Promise<ActionResult<TData>>` 시그니처만 흉내 내는 클라이언트 전용
 * 더미 액션을 사용한다. 실제 네트워크 왕복 느낌을 주기 위해 짧은 지연 후 항상 성공을 반환한다.
 * `"use server"`가 아니므로 Client Component에서 직접 정의/호출해도 번들에 서버 코드가
 * 섞이지 않는다.
 */
export function createDemoAction<TInput, TData = TInput>(
  transform?: (input: TInput) => TData,
): (input: TInput) => Promise<ActionResult<TData>> {
  return async (input: TInput) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const data = transform ? transform(input) : (input as unknown as TData);
    return { success: true, data };
  };
}
