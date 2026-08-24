import { z } from "zod";

import type { Tables } from "@/lib/supabase/database.types";

/**
 * `profiles`는 다른 앱과 공유하는 테이블이지만(PRD 5.0/5.1), `id`/`email`/`name`/
 * `phone_number`/`bio`는 다른 앱의 트리거·비즈니스 로직에 결합돼 있지 않은 범용 신원
 * 정보라 RLS(`profiles_update_own_or_admin`, `id = auth.uid()`)도 이미 본인 행 UPDATE를
 * 허용한다. `avatar_key`/`role`/`notify_on_*`만 다른 앱 로직에 결합돼 있어 재사용 금지다
 * (그건 그대로 `udong_profiles`/`udong_notification_preferences`로 분리 유지).
 */
export type Profile = Pick<
  Tables<"profiles">,
  "id" | "email" | "name" | "phone_number" | "bio"
>;

const PHONE_NUMBER_PATTERN = /^\d{3}-\d{4}-\d{4}$/;

/**
 * 프로필 수정 폼 — `profiles`의 기존 CHECK 제약과 동일한 규칙을 클라이언트에서도 그대로
 * 적용한다(`name` 1~50자, `phone_number` `010-1234-5678` 형식, `bio` 500자 이하).
 * 세 컬럼 모두 nullable이라 빈 입력을 허용하고, Server Action에서 빈 문자열을 null로
 * 변환해 저장한다(빈 문자열 그대로 저장하면 `name`의 "1자 이상" CHECK를 위반한다).
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .max(50, "이름은 최대 50자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || PHONE_NUMBER_PATTERN.test(value), {
      message: "전화번호는 010-1234-5678 형식으로 입력해주세요",
    }),
  bio: z
    .string()
    .trim()
    .max(500, "자기소개는 최대 500자까지 입력 가능합니다")
    .optional()
    .or(z.literal("")),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
