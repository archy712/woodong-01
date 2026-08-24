import type { Announcement } from "@/lib/woodong/announcements";
import { GROUP_ID, announcementId } from "./ids";
import { RUNNING_MEMBERS, HIKING_MEMBERS } from "./groups";

const runningAdmin = RUNNING_MEMBERS[0].user_id;
const hikingAdmin = HIKING_MEMBERS[0].user_id;

export const DUMMY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: announcementId(1),
    group_id: GROUP_ID.running,
    title: "8월 정기 러닝 안내",
    body: "이번 주 화요일(8/26) 저녁 7시, 여의도 한강공원 입구에서 모여요. 준비물은 편한 러닝화와 물 한 병이면 충분합니다!",
    created_by: runningAdmin,
    created_at: "2026-08-18T18:00:00+09:00",
    updated_at: "2026-08-18T18:00:00+09:00",
  },
  {
    id: announcementId(2),
    group_id: GROUP_ID.running,
    title: "우천 시 일정 변경 안내",
    body: "비 예보가 있는 날은 실내 러닝머신 모임으로 대체될 수 있어요. 당일 오전에 공지드릴게요.",
    created_by: runningAdmin,
    created_at: "2026-08-10T09:30:00+09:00",
    updated_at: "2026-08-10T10:15:00+09:00",
  },
  {
    id: announcementId(3),
    group_id: GROUP_ID.running,
    title: "신규 회원을 환영합니다!",
    body: "이번 달 새로 합류하신 임서준님, 환영합니다. 다음 모임 때 다같이 인사 나눠요.",
    created_by: runningAdmin,
    created_at: "2026-08-02T12:00:00+09:00",
    updated_at: "2026-08-02T12:00:00+09:00",
  },
  {
    id: announcementId(4),
    group_id: GROUP_ID.hiking,
    title: "9월 산행 일정 및 준비물 안내",
    body: "9월 산행은 설악산으로 결정됐어요! 등산화, 우비, 여유 간식을 꼭 챙겨주세요. 자세한 시간은 투표 마감 후 안내드립니다.",
    created_by: hikingAdmin,
    created_at: "2026-08-20T08:00:00+09:00",
    updated_at: "2026-08-20T08:00:00+09:00",
  },
  {
    id: announcementId(5),
    group_id: GROUP_ID.hiking,
    title: "지난 산행 후기 공유해주세요",
    body: "지리산 산행 사진과 후기를 단체 채팅방에 공유해주시면 다음 산행 계획에 반영할게요.",
    created_by: hikingAdmin,
    created_at: "2026-08-07T15:20:00+09:00",
    updated_at: "2026-08-07T15:20:00+09:00",
  },
];

export function getDummyAnnouncements(groupId: string): Announcement[] {
  return DUMMY_ANNOUNCEMENTS.filter((a) => a.group_id === groupId).sort(
    (a, b) => (a.created_at < b.created_at ? 1 : -1),
  );
}
