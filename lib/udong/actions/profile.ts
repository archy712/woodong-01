"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { mapSupabaseError } from "@/lib/udong/errors";
import { AVATAR_KEYS } from "@/lib/udong/avatars";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/udong/profile";
import type { ActionResult } from "@/lib/udong/common";

const updateAvatarSchema = z.object({
  avatarKey: z.enum(AVATAR_KEYS),
});

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;

/**
 * 아바타 선택 Server Action.
 *
 * `profiles.avatar_key`는 다른 앱 소유라 절대 쓰지 않고(PRD 5.0/5.1),
 * 우동 전용 테이블 `udong_profiles`에 upsert한다. `user_id`에 UNIQUE 제약이 있어
 * `onConflict: "user_id"`로 최초 선택(INSERT)과 재선택(UPDATE)을 하나의 쿼리로 처리한다.
 * `udong_profiles_insert_own`/`udong_profiles_update_own` 정책이 모두
 * `user_id = auth.uid()`라 upsert의 두 분기 모두 통과한다.
 */
export async function updateAvatarAction(
  input: UpdateAvatarInput,
): Promise<ActionResult<{ avatarKey: string }>> {
  const parsed = updateAvatarSchema.safeParse(input);
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

  const { avatarKey } = parsed.data;

  const { error } = await supabase
    .from("udong_profiles")
    .upsert(
      { user_id: userId, avatar_key: avatarKey },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("[updateAvatarAction] udong_profiles upsert failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidatePath("/protected/profile");
  return { success: true, data: { avatarKey } };
}

/**
 * 프로필 수정 Server Action.
 *
 * `name`/`phone_number`/`bio`는 `avatar_key`/`role`/`notify_on_*`와 달리 다른 앱의
 * 트리거·비즈니스 로직에 결합돼 있지 않은 범용 신원 정보라, 이미 존재하는
 * `profiles_update_own_or_admin` RLS 정책(`id = auth.uid()`)으로 본인 행 UPDATE가
 * 가능하다(스키마 변경이 아니라 데이터 UPDATE라 "기존 테이블 ALTER/DROP/TRUNCATE 금지"
 * 원칙과도 무관 — PRD 5.0). 세 컬럼 모두 nullable이라 빈 문자열은 null로 변환해 저장한다.
 */
export async function updateProfileAction(input: UpdateProfileInput): Promise<
  ActionResult<{
    name: string | null;
    phoneNumber: string | null;
    bio: string | null;
  }>
> {
  const parsed = updateProfileSchema.safeParse(input);
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

  const name = parsed.data.name || null;
  const phoneNumber = parsed.data.phoneNumber || null;
  const bio = parsed.data.bio || null;

  const { error } = await supabase
    .from("profiles")
    .update({ name, phone_number: phoneNumber, bio })
    .eq("id", userId);

  if (error) {
    console.error("[updateProfileAction] profiles update failed:", error);
    return { success: false, formError: mapSupabaseError(error) };
  }

  revalidatePath("/protected/profile");
  return { success: true, data: { name, phoneNumber, bio } };
}
