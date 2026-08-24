// 우동(Woodong) 하드코딩 더미 데이터 배럴 export (Task 012).
//
// Phase 2(디자인 시스템/UI 완성) 동안 화면에 보여줄 모임/멤버/회비/공지/투표/알림 데이터는
// 전부 이 디렉토리의 더미 데이터를 사용한다. 실 Supabase 연동은 Phase 4~6(Task 019~030)에서
// 이 더미 조회 함수를 실제 쿼리로 하나씩 교체하는 방식으로 진행한다.

export * from "./ids";
export * from "./groups";
export * from "./dues";
export * from "./votes";
export * from "./announcements";
export * from "./notifications";

import { GROUP_ID } from "./ids";
import { getDummyGroup, getDummyActiveMembers } from "./groups";
import {
  getDummyDueCycles,
  getDummyDuesForCycle,
  calcDueCyclePaidRate,
} from "./dues";
import { getDummyVotesForGroup } from "./votes";
import { getDummyAnnouncements } from "./announcements";

export interface DummyGroupSummary {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  memberCount: number;
  latestDuePaidRate: number | null;
}

/** 모임 목록 카드에 필요한 요약 정보(멤버 수, 최신 회비 납부율)를 계산한다. */
export function getDummyGroupSummaries(): DummyGroupSummary[] {
  return Object.values(GROUP_ID).map((id) => {
    const group = getDummyGroup(id)!;
    const cycles = getDummyDueCycles(id);
    const latestCycle = cycles[0];
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      type: group.type,
      memberCount: getDummyActiveMembers(id).length,
      latestDuePaidRate: latestCycle
        ? calcDueCyclePaidRate(latestCycle.id)
        : null,
    };
  });
}

export interface DummyGroupDashboard {
  latestAnnouncements: ReturnType<typeof getDummyAnnouncements>;
  latestDueCycle: ReturnType<typeof getDummyDueCycles>[number] | undefined;
  latestDuePaidRate: number;
  unpaidMemberCount: number;
  totalMemberCount: number;
  openVoteCount: number;
  openVotes: ReturnType<typeof getDummyVotesForGroup>;
}

/** 모임 상세 홈 대시보드(공지 요약·납부율·진행 중 투표 요약)용 집계 데이터. */
export function getDummyGroupDashboard(groupId: string): DummyGroupDashboard {
  const announcements = getDummyAnnouncements(groupId).slice(0, 3);
  const cycles = getDummyDueCycles(groupId);
  const latestDueCycle = cycles[0];
  const dues = latestDueCycle ? getDummyDuesForCycle(latestDueCycle.id) : [];
  const votes = getDummyVotesForGroup(groupId);
  const openVotes = votes.filter((v) => v.vote.status === "open");

  return {
    latestAnnouncements: announcements,
    latestDueCycle,
    latestDuePaidRate: latestDueCycle
      ? calcDueCyclePaidRate(latestDueCycle.id)
      : 0,
    unpaidMemberCount: dues.filter((d) => d.status !== "paid").length,
    totalMemberCount: dues.length,
    openVoteCount: openVotes.length,
    openVotes: openVotes.slice(0, 2),
  };
}
