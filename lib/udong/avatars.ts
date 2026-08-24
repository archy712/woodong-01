/**
 * 우동 전용 아바타 프리셋.
 *
 * `public.profiles.avatar_key`(다른 앱의 컬럼, `fox`/`bear`/`cat`/`panda`/`rabbit`/`owl`/
 * `penguin`/`tiger`/`dog`/`lion`/`koala`/`cow`/`pig`/`frog`/`monkey`/`unicorn`/`wolf`/
 * `raccoon`/`hamster`/`hedgehog`/`chicken`/`duck`/`butterfly`/`turtle` 24종 CHECK 제약)와
 * 동일한 프리셋 키 집합을 그대로 재사용하되, 저장은 우동 전용 테이블
 * `public.udong_profiles.avatar_key`에 한다(PRD 5.0 — 공유 테이블 컬럼은 재정의하지 않음).
 */
export const AVATAR_KEYS = [
  "fox",
  "bear",
  "cat",
  "panda",
  "rabbit",
  "owl",
  "penguin",
  "tiger",
  "dog",
  "lion",
  "koala",
  "cow",
  "pig",
  "frog",
  "monkey",
  "unicorn",
  "wolf",
  "raccoon",
  "hamster",
  "hedgehog",
  "chicken",
  "duck",
  "butterfly",
  "turtle",
] as const;

export type AvatarKey = (typeof AVATAR_KEYS)[number];

export const DEFAULT_AVATAR_KEY: AvatarKey = "fox";

export const AVATAR_EMOJI: Record<AvatarKey, string> = {
  fox: "🦊",
  bear: "🐻",
  cat: "🐱",
  panda: "🐼",
  rabbit: "🐰",
  owl: "🦉",
  penguin: "🐧",
  tiger: "🐯",
  dog: "🐶",
  lion: "🦁",
  koala: "🐨",
  cow: "🐮",
  pig: "🐷",
  frog: "🐸",
  monkey: "🐵",
  unicorn: "🦄",
  wolf: "🐺",
  raccoon: "🦝",
  hamster: "🐹",
  hedgehog: "🦔",
  chicken: "🐔",
  duck: "🦆",
  butterfly: "🦋",
  turtle: "🐢",
};

export function isAvatarKey(value: string): value is AvatarKey {
  return (AVATAR_KEYS as readonly string[]).includes(value);
}
