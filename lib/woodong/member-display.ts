import {
  AVATAR_EMOJI,
  DEFAULT_AVATAR_KEY,
  type AvatarKey,
} from "@/lib/woodong/avatars";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";

/**
 * 멤버 표시 공통 헬퍼 (Task 022).
 *
 * 멤버 목록(Task 021)과 회비 대시보드(Task 022)가 같은 `woodong_list_group_members()` 결과를
 * 서로 다른 화면에서 그리므로, "이름이 비어 있을 때 무엇을 보여줄지"와 "아바타 폴백" 규칙이
 * 두 곳에서 어긋나지 않도록 한 군데로 모았다.
 */

/** `woodong_profiles.avatar_key` → 이모지. 미설정/알 수 없는 키는 기본 아바타로 폴백한다. */
export function memberAvatarEmoji(avatarKey: string | null): string {
  if (avatarKey && avatarKey in AVATAR_EMOJI) {
    return AVATAR_EMOJI[avatarKey as AvatarKey];
  }
  return AVATAR_EMOJI[DEFAULT_AVATAR_KEY];
}

/**
 * 화면에 보여줄 이름.
 *
 * `profiles.name`이 비어 있는 사용자가 흔해서(가입 시 이름을 받지 않는다) 이메일을 폴백으로 쓰되,
 * 이메일은 RPC가 총무·본인에게만 내려주므로 일반회원 화면에서는 자연히 "이름 미확인 멤버"가 된다.
 */
export function memberDisplayName(
  member: Pick<GroupMemberRow, "name" | "email">,
  unnamedLabel: string,
): string {
  if (member.name) return member.name;
  if (member.email) return member.email;
  return unnamedLabel;
}
