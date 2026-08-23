"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { mapSupabaseError } from "@/lib/udong/errors";
import { createGroupSchema, type CreateGroupInput } from "@/lib/udong/groups";
import type { ActionResult } from "@/lib/udong/common";

/**
 * 모임 생성 Server Action.
 *
 * 1) `udong_groups`에 INSERT(`created_by` = 현재 로그인 사용자)
 * 2) 생성된 모임에 대해 `udong_group_members`에 본인을 `role: "admin"`으로 자기등록
 *
 * (2)가 가능한 이유: Task 003 마이그레이션에서 "자신이 만든 모임의 admin 자기등록"을
 * 허용하는 `udong_group_members_insert_bootstrap_admin` RLS 정책을 이미 만들어 뒀다
 * (`with_check`: `user_id = auth.uid() AND role = 'admin' AND group_id IN
 * (SELECT id FROM udong_groups WHERE created_by = auth.uid())`).
 * 두 INSERT 모두 `createClient()`(요청 쿠키의 사용자 세션)로 실행하므로 RLS의 `auth.uid()`가
 * 로그인한 사용자로 정상 평가된다 — service role 클라이언트를 쓰면 이 정책들이 무의미해지므로 절대 쓰지 않는다.
 *
 * ⚠️ `.insert().select()`(= PostgREST `Prefer: return=representation`)를 쓰지 않는 이유:
 * Postgres RLS는 `INSERT ... RETURNING`에 대해 INSERT의 `WITH CHECK`뿐 아니라 **SELECT 정책까지도**
 * 함께 평가한다. `udong_groups_select_member`는 `udong_is_group_member(id)`를 요구하는데,
 * 방금 만든 모임은 아직 (2)의 `udong_group_members` 자기등록 전이라 이 시점엔 멤버가 아니므로
 * SELECT 정책이 거부되고, 결과적으로 정상적인 `created_by = auth.uid()` INSERT조차
 * `42501`(row-level security policy violation)로 실패한다(실제로 재현·확인함 — curl로 동일 토큰을
 * 써서 `Prefer: return=representation` 유무에 따라 403/201이 갈리는 것까지 검증했다).
 * 이를 피하려고 `id`를 애플리케이션에서 미리 생성(`crypto.randomUUID()`)해 INSERT 페이로드에 실어
 * 보내고, 두 INSERT 모두 `.select()` 없이 `return=minimal`로만 수행한다.
 *
 * revalidate 규약: 이 프로젝트의 `/protected/groups`(목록)·`/protected/groups/[groupId]`(상세)는
 * 아직 `"use cache"`를 쓰지 않는 완전 동적 페이지라 엄밀히는 재검증이 필수는 아니지만, 뮤테이션 후
 * 갱신 규약을 지금부터 확립해 둔다: 목록에 영향을 주는 뮤테이션은 `revalidatePath("/protected/groups")`를
 * 호출해 Next.js 라우터 캐시(클라이언트 프리페치 캐시 포함)를 무효화한다. 이후 Task 012/019에서
 * 목록/상세 페이지에 `"use cache"` + `cacheTag()`가 도입되면, 해당 태그에 대한 `revalidateTag()` 호출을
 * `revalidatePath` 옆에 추가하는 방식으로 이 규약을 확장한다(교체가 아니라 추가).
 *
 * `redirect()`는 내부적으로 `NEXT_REDIRECT` 예외를 던져 처리되므로 반드시 `revalidatePath` 이후,
 * try/catch 밖에서 호출한다(감싸면 리다이렉트 신호를 삼켜버린다).
 */
export async function createGroupAction(
  input: CreateGroupInput,
): Promise<ActionResult<{ groupId: string }>> {
  const parsed = createGroupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { name, description, type, defaultDueAmount } = parsed.data;
  const groupId = crypto.randomUUID();

  const { error: groupError } = await supabase.from("udong_groups").insert({
    id: groupId,
    name,
    description: description || null,
    type: type || null,
    default_due_amount: defaultDueAmount ?? null,
    created_by: userId,
  });

  if (groupError) {
    console.error(
      "[createGroupAction] udong_groups insert failed:",
      groupError,
    );
    return { success: false, formError: mapSupabaseError(groupError) };
  }

  const { error: memberError } = await supabase
    .from("udong_group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
      role: "admin",
    });

  if (memberError) {
    // 모임 자체는 생성되었지만 admin 자기등록에 실패한 상태.
    // 이 상태를 자동 롤백/정리하는 로직은 이번 Task 범위 밖(전체 CRUD는 Task 019)이므로,
    // 우선 사용자에게 실패를 알리고 서버 로그를 남기는 데 그친다.
    console.error(
      "[createGroupAction] udong_group_members insert failed:",
      memberError,
    );
    return { success: false, formError: mapSupabaseError(memberError) };
  }

  revalidatePath("/protected/groups");
  redirect(`/protected/groups/${groupId}`);
}
