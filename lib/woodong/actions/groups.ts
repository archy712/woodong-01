"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { WOODONG_COVERS_BUCKET } from "@/lib/supabase/storage";
import { mapSupabaseError } from "@/lib/woodong/errors";
import {
  createGroupSchema,
  deleteGroupSchema,
  updateGroupSchema,
  type CreateGroupInput,
  type DeleteGroupInput,
  type UpdateGroupInput,
} from "@/lib/woodong/groups";
import type { ActionResult } from "@/lib/woodong/common";

/**
 * 모임 생성 Server Action.
 *
 * 1) `woodong_groups`에 INSERT(`created_by` = 현재 로그인 사용자)
 * 2) 생성된 모임에 대해 `woodong_group_members`에 본인을 `role: "admin"`으로 자기등록
 *
 * (2)가 가능한 이유: Task 003 마이그레이션에서 "자신이 만든 모임의 admin 자기등록"을
 * 허용하는 `woodong_group_members_insert_bootstrap_admin` RLS 정책을 이미 만들어 뒀다
 * (`with_check`: `user_id = auth.uid() AND role = 'admin' AND group_id IN
 * (SELECT id FROM woodong_groups WHERE created_by = auth.uid())`).
 * 두 INSERT 모두 `createClient()`(요청 쿠키의 사용자 세션)로 실행하므로 RLS의 `auth.uid()`가
 * 로그인한 사용자로 정상 평가된다 — service role 클라이언트를 쓰면 이 정책들이 무의미해지므로 절대 쓰지 않는다.
 *
 * ⚠️ `.insert().select()`(= PostgREST `Prefer: return=representation`)를 쓰지 않는 이유:
 * Postgres RLS는 `INSERT ... RETURNING`에 대해 INSERT의 `WITH CHECK`뿐 아니라 **SELECT 정책까지도**
 * 함께 평가한다. `woodong_groups_select_member`는 `woodong_is_group_member(id)`를 요구하는데,
 * 방금 만든 모임은 아직 (2)의 `woodong_group_members` 자기등록 전이라 이 시점엔 멤버가 아니므로
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

  const { error: groupError } = await supabase.from("woodong_groups").insert({
    id: groupId,
    name,
    description: description || null,
    type: type || null,
    default_due_amount: defaultDueAmount ?? null,
    created_by: userId,
  });

  if (groupError) {
    console.error(
      "[createGroupAction] woodong_groups insert failed:",
      groupError,
    );
    return { success: false, formError: mapSupabaseError(groupError) };
  }

  const { error: memberError } = await supabase
    .from("woodong_group_members")
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
      "[createGroupAction] woodong_group_members insert failed:",
      memberError,
    );
    return { success: false, formError: mapSupabaseError(memberError) };
  }

  revalidatePath("/protected/groups");
  redirect(`/protected/groups/${groupId}`);
}

/**
 * 모임 정보 수정 Server Action (Task 019).
 *
 * 총무만 수정할 수 있다는 규칙은 `woodong_groups_update_admin`(`woodong_is_group_admin(id)`)
 * RLS 정책이 강제한다. 일반회원이 호출하면 UPDATE 대상 행이 0건이 되는데, PostgREST는 이를
 * 에러가 아니라 "0행 갱신"으로 돌려주므로 `count: "exact"`로 확인해 권한 오류로 되돌린다
 * (조용히 성공한 것처럼 보이면 안 된다).
 *
 * 대표 이미지는 브라우저에서 리사이즈·업로드까지 끝낸 뒤 **오브젝트 경로만** 전달받는다
 * (Task 004의 비공개 버킷 + 서명 URL 원칙). 경로를 다른 모임 폴더로 위조하지 못하도록
 * `{groupId}/` 접두어를 서버에서 다시 검증한다.
 */
export async function updateGroupAction(
  input: UpdateGroupInput,
): Promise<ActionResult<{ groupId: string }>> {
  const parsed = updateGroupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId, name, description, type, defaultDueAmount } = parsed.data;
  const coverPath = parsed.data.coverImageObjectPath;

  if (coverPath && !coverPath.startsWith(`${groupId}/`)) {
    return { success: false, formError: "잘못된 이미지 경로입니다." };
  }

  const { error, count } = await supabase
    .from("woodong_groups")
    .update(
      {
        name,
        description: description || null,
        type: type || null,
        default_due_amount: defaultDueAmount ?? null,
        // undefined면 이 키 자체를 넣지 않아 기존 값을 유지한다.
        ...(coverPath !== undefined
          ? { cover_image_object_path: coverPath }
          : {}),
      },
      { count: "exact" },
    )
    .eq("id", groupId);

  if (error) {
    console.error("[updateGroupAction] update failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return {
      success: false,
      formError: "모임 정보를 수정할 권한이 없어요. 총무에게 요청해주세요.",
    };
  }

  revalidatePath("/protected/groups");
  revalidatePath(`/protected/groups/${groupId}`);
  revalidatePath(`/protected/groups/${groupId}/settings`);
  return { success: true, data: { groupId } };
}

/**
 * 모임 삭제 Server Action (Task 019).
 *
 * **하드 삭제**를 택했다. `woodong_*` 자식 테이블(멤버/초대/회비/청구/납부/공지/투표/알림)의
 * FK가 전부 `ON DELETE CASCADE`라 모임 행 하나만 지우면 연관 데이터가 함께 정리되고,
 * 소프트 삭제를 도입하면 모든 조회·RLS 정책에 "삭제되지 않은 모임" 조건을 추가해야 해
 * 1차 MVP 범위에서는 얻는 것보다 비용이 크다(복구 요구사항도 PRD에 없다).
 *
 * ⚠️ 순서가 중요하다: Storage 오브젝트 삭제 정책이 `woodong_is_group_admin(...)`을 요구하므로
 * 모임 행을 먼저 지우면 그 순간부터 관리자 판정이 실패해 대표 이미지가 영구히 남는다.
 * 따라서 **커버 이미지를 먼저 지우고 모임 행을 나중에** 지운다.
 */
export async function deleteGroupAction(
  input: DeleteGroupInput,
): Promise<ActionResult<undefined>> {
  const parsed = deleteGroupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { success: false, formError: "로그인이 필요합니다." };
  }

  const { groupId } = parsed.data;

  const { data: objects, error: listError } = await supabase.storage
    .from(WOODONG_COVERS_BUCKET)
    .list(groupId);

  if (listError) {
    console.error("[deleteGroupAction] cover list failed:", listError);
  } else if (objects && objects.length > 0) {
    const { error: removeError } = await supabase.storage
      .from(WOODONG_COVERS_BUCKET)
      .remove(objects.map((object) => `${groupId}/${object.name}`));
    if (removeError) {
      // 이미지가 남는 건 데이터 정합성 문제가 아니라 저장 공간 문제라, 삭제 자체는 계속 진행한다.
      console.error("[deleteGroupAction] cover remove failed:", removeError);
    }
  }

  const { error, count } = await supabase
    .from("woodong_groups")
    .delete({ count: "exact" })
    .eq("id", groupId);

  if (error) {
    console.error("[deleteGroupAction] delete failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  if (!count) {
    return {
      success: false,
      formError: "모임을 삭제할 권한이 없어요. 총무만 삭제할 수 있어요.",
    };
  }

  revalidatePath("/protected/groups");
  return { success: true, data: undefined };
}
