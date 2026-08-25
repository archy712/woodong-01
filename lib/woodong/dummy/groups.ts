import type { AvatarKey } from "@/lib/woodong/avatars";
import type { Group, GroupMember } from "@/lib/woodong/groups";
import { GROUP_ID, userId } from "./ids";

/**
 * `woodong_group_members`(도메인 타입 `GroupMember`)에는 이름/아바타가 없다(실제 화면에서는
 * `profiles` 조인으로 채워짐). 더미 데이터에서는 이 보강 정보를 별도 타입으로 붙여
 * 멤버 목록 UI가 이름/아바타를 바로 그릴 수 있게 한다.
 */
export interface DummyMemberProfile {
  userId: string;
  name: string;
  avatarKey: AvatarKey;
  email: string;
}

export interface DummyGroupMember extends GroupMember {
  profile: DummyMemberProfile;
}

function member(
  n: number,
  name: string,
  avatarKey: AvatarKey,
  opts: {
    groupId: string;
    role?: GroupMember["role"];
    status?: GroupMember["status"];
    joinedAt: string;
  },
): DummyGroupMember {
  const id = userId(n);
  return {
    id: `${opts.groupId}:${id}`,
    group_id: opts.groupId,
    user_id: id,
    role: opts.role ?? "member",
    status: opts.status ?? "active",
    joined_at: opts.joinedAt,
    profile: {
      userId: id,
      name,
      avatarKey,
      email: `${id.slice(-6)}@example.com`,
    },
  };
}

export const RUNNING_MEMBERS: DummyGroupMember[] = [
  member(1, "김민준", "fox", {
    groupId: GROUP_ID.running,
    role: "admin",
    joinedAt: "2026-01-05T09:00:00+09:00",
  }),
  member(2, "이서연", "rabbit", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-01-06T09:00:00+09:00",
  }),
  member(3, "박도윤", "dog", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-01-10T09:00:00+09:00",
  }),
  member(4, "최지우", "cat", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-02-01T09:00:00+09:00",
  }),
  member(5, "정하윤", "penguin", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-02-14T09:00:00+09:00",
  }),
  member(6, "강은우", "koala", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-03-02T09:00:00+09:00",
  }),
  member(7, "조수아", "owl", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-04-11T09:00:00+09:00",
  }),
  member(8, "윤지호", "tiger", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-05-20T09:00:00+09:00",
  }),
  member(9, "임서준", "hamster", {
    groupId: GROUP_ID.running,
    joinedAt: "2026-07-01T09:00:00+09:00",
  }),
];

export const HIKING_MEMBERS: DummyGroupMember[] = [
  member(10, "한지민", "bear", {
    groupId: GROUP_ID.hiking,
    role: "admin",
    joinedAt: "2025-11-01T09:00:00+09:00",
  }),
  member(11, "오유진", "panda", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2025-11-03T09:00:00+09:00",
  }),
  member(12, "서준혁", "lion", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2025-11-10T09:00:00+09:00",
  }),
  member(13, "신다은", "cow", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2025-12-01T09:00:00+09:00",
  }),
  member(14, "권태양", "pig", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2025-12-15T09:00:00+09:00",
  }),
  member(15, "황유나", "frog", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-01-08T09:00:00+09:00",
  }),
  member(16, "문재현", "wolf", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-01-20T09:00:00+09:00",
  }),
  member(17, "배소율", "raccoon", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-02-05T09:00:00+09:00",
  }),
  member(18, "노경민", "hedgehog", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-03-12T09:00:00+09:00",
  }),
  member(19, "송하은", "chicken", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-04-18T09:00:00+09:00",
  }),
  member(20, "홍시우", "duck", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-05-09T09:00:00+09:00",
  }),
  member(21, "장예린", "butterfly", {
    groupId: GROUP_ID.hiking,
    status: "left",
    joinedAt: "2025-12-20T09:00:00+09:00",
  }),
  member(22, "안준서", "turtle", {
    groupId: GROUP_ID.hiking,
    joinedAt: "2026-06-30T09:00:00+09:00",
  }),
];

export const BOOK_CLUB_MEMBERS: DummyGroupMember[] = [
  member(23, "유나영", "unicorn", {
    groupId: GROUP_ID.bookClub,
    role: "admin",
    joinedAt: "2026-03-01T09:00:00+09:00",
  }),
  member(24, "백승민", "monkey", {
    groupId: GROUP_ID.bookClub,
    joinedAt: "2026-03-02T09:00:00+09:00",
  }),
  member(25, "남궁솔", "fox", {
    groupId: GROUP_ID.bookClub,
    joinedAt: "2026-03-15T09:00:00+09:00",
  }),
  member(26, "서지안", "rabbit", {
    groupId: GROUP_ID.bookClub,
    joinedAt: "2026-04-02T09:00:00+09:00",
  }),
  member(27, "이하람", "owl", {
    groupId: GROUP_ID.bookClub,
    joinedAt: "2026-05-19T09:00:00+09:00",
  }),
  member(28, "김도경", "cat", {
    groupId: GROUP_ID.bookClub,
    joinedAt: "2026-06-24T09:00:00+09:00",
  }),
];

export const DUMMY_GROUPS: Group[] = [
  {
    id: GROUP_ID.running,
    name: "노을 러닝크루",
    description: "매주 화·목 저녁 한강에서 함께 달려요. 초보자 대환영!",
    type: "동호회",
    cover_image_object_path: null,
    default_due_amount: 20000,
    created_by: RUNNING_MEMBERS[0].user_id,
    created_at: "2026-01-05T09:00:00+09:00",
  },
  {
    id: GROUP_ID.hiking,
    name: "주말 등산모임",
    description: "매달 둘째·넷째 주 토요일, 근교 명산으로 함께 떠나요.",
    type: "동호회",
    cover_image_object_path: null,
    default_due_amount: 30000,
    created_by: HIKING_MEMBERS[0].user_id,
    created_at: "2025-11-01T09:00:00+09:00",
  },
  {
    id: GROUP_ID.bookClub,
    name: "책모임 페이지터너",
    description: "한 달에 한 권, 격주 온라인으로 만나 책 이야기를 나눠요.",
    type: "스터디",
    cover_image_object_path: null,
    default_due_amount: 10000,
    created_by: BOOK_CLUB_MEMBERS[0].user_id,
    created_at: "2026-03-01T09:00:00+09:00",
  },
];

export const DUMMY_GROUP_MEMBERS: Record<string, DummyGroupMember[]> = {
  [GROUP_ID.running]: RUNNING_MEMBERS,
  [GROUP_ID.hiking]: HIKING_MEMBERS,
  [GROUP_ID.bookClub]: BOOK_CLUB_MEMBERS,
};

/** 화면 렌더링 편의를 위해 모든 모임의 멤버를 하나로 합친 조회용 인덱스. */
export const ALL_DUMMY_MEMBERS: DummyGroupMember[] = [
  ...RUNNING_MEMBERS,
  ...HIKING_MEMBERS,
  ...BOOK_CLUB_MEMBERS,
];

export function getDummyGroup(groupId: string): Group | undefined {
  return DUMMY_GROUPS.find((g) => g.id === groupId);
}

export function getDummyMembers(groupId: string): DummyGroupMember[] {
  return DUMMY_GROUP_MEMBERS[groupId] ?? [];
}

export function getDummyActiveMembers(groupId: string): DummyGroupMember[] {
  return getDummyMembers(groupId).filter((m) => m.status === "active");
}

export function findDummyMemberProfile(
  userIdValue: string,
): DummyMemberProfile | undefined {
  return ALL_DUMMY_MEMBERS.find((m) => m.user_id === userIdValue)?.profile;
}
