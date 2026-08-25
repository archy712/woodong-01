import type { Notification } from "@/lib/woodong/notifications";
import { GROUP_ID, notificationId, userId } from "./ids";
import { RUNNING_DUE_CYCLE_AUG, HIKING_DUE_CYCLE_SEORAK } from "./dues";
import { DUMMY_ANNOUNCEMENTS } from "./announcements";
import { DUMMY_VOTE_BUNDLES } from "./votes";

/** 알림센터 데모를 보여주는 가상 로그인 사용자(러닝크루 총무 김민준). */
export const NOTIFICATION_VIEWER_ID = userId(1);

const [runningCourseVote, runningDuesVote, hikingDateVote] =
  DUMMY_VOTE_BUNDLES.map((b) => b.vote);
const [runningAnnouncement1, runningAnnouncement2, , hikingAnnouncement1] =
  DUMMY_ANNOUNCEMENTS;

export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: notificationId(1),
    group_id: GROUP_ID.hiking,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "notice",
    related_type: "announcement",
    related_id: hikingAnnouncement1.id,
    channel: "in_app",
    status: "sent",
    title: "9월 산행 일정 및 준비물 안내",
    body: "9월 산행은 설악산으로 결정됐어요! 등산화, 우비, 여유 간식을 챙겨주세요.",
    read_at: null,
    clicked_at: null,
    created_at: "2026-08-20T08:05:00+09:00",
  },
  {
    id: notificationId(2),
    group_id: GROUP_ID.hiking,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "due_reminder",
    related_type: "due",
    related_id: HIKING_DUE_CYCLE_SEORAK.id,
    channel: "in_app",
    status: "sent",
    title: "설악산 산행 교통비 납부가 지연되고 있어요",
    body: "아직 회비 납부 전이시네요. 우동이 살짝 알려드릴게요!",
    read_at: null,
    clicked_at: null,
    created_at: "2026-08-12T09:00:00+09:00",
  },
  {
    id: notificationId(3),
    group_id: GROUP_ID.running,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "vote_start",
    related_type: "vote",
    related_id: runningCourseVote.id,
    channel: "in_app",
    status: "sent",
    title: "새 투표가 시작됐어요: 다음 러닝 코스 투표",
    body: "8월 30일까지 투표에 참여해주세요.",
    read_at: null,
    clicked_at: null,
    created_at: "2026-08-15T10:05:00+09:00",
  },
  {
    id: notificationId(4),
    group_id: GROUP_ID.running,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "due_reminder",
    related_type: "due",
    related_id: RUNNING_DUE_CYCLE_AUG.id,
    channel: "in_app",
    status: "sent",
    title: "8월 정기회비 납부 리마인드",
    body: "아직 회비 납부 전이시네요. 우동이 살짝 알려드릴게요!",
    read_at: "2026-08-21T21:00:00+09:00",
    clicked_at: "2026-08-21T21:00:00+09:00",
    created_at: "2026-08-21T09:00:00+09:00",
  },
  {
    id: notificationId(5),
    group_id: GROUP_ID.hiking,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "vote_start",
    related_type: "vote",
    related_id: hikingDateVote.id,
    channel: "in_app",
    status: "sent",
    title: "새 투표가 시작됐어요: 9월 산행 날짜 투표",
    body: "복수 선택이 가능해요. 참여 가능한 날짜를 모두 골라주세요.",
    read_at: "2026-08-19T22:00:00+09:00",
    clicked_at: "2026-08-19T22:00:00+09:00",
    created_at: "2026-08-18T10:05:00+09:00",
  },
  {
    id: notificationId(6),
    group_id: GROUP_ID.running,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "vote_close",
    related_type: "vote",
    related_id: runningDuesVote.id,
    channel: "in_app",
    status: "sent",
    title: "투표가 마감됐어요: 회비 인상 찬반 투표",
    body: "찬성 6표, 반대 3표로 마감됐어요.",
    read_at: "2026-08-11T08:00:00+09:00",
    clicked_at: null,
    created_at: "2026-08-10T21:05:00+09:00",
  },
  {
    id: notificationId(7),
    group_id: GROUP_ID.running,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "notice",
    related_type: "announcement",
    related_id: runningAnnouncement2.id,
    channel: "in_app",
    status: "sent",
    title: "우천 시 일정 변경 안내",
    body: "비 예보가 있는 날은 실내 러닝머신 모임으로 대체될 수 있어요.",
    read_at: "2026-08-10T12:00:00+09:00",
    clicked_at: "2026-08-10T12:00:00+09:00",
    created_at: "2026-08-10T09:35:00+09:00",
  },
  {
    id: notificationId(8),
    group_id: GROUP_ID.running,
    user_id: NOTIFICATION_VIEWER_ID,
    type: "notice",
    related_type: "announcement",
    related_id: runningAnnouncement1.id,
    channel: "in_app",
    status: "sent",
    title: "8월 정기 러닝 안내",
    body: "이번 주 화요일(8/26) 저녁 7시, 여의도 한강공원 입구에서 모여요.",
    read_at: "2026-08-18T19:00:00+09:00",
    clicked_at: "2026-08-18T19:00:00+09:00",
    created_at: "2026-08-18T18:05:00+09:00",
  },
];

// DUMMY_NOTIFICATION_PREFERENCES는 Task 027에서 마이페이지가 실데이터
// (`listMyChannelPreferences`)로 전환되면서 삭제했다. 채널 목록도 v1.6에서
// web_push/in_app으로 좁혀져 더미의 kakao/slack/email 행은 CHECK 제약에도 맞지 않는다.

export function getDummyNotifications(): Notification[] {
  return [...DUMMY_NOTIFICATIONS].sort((a, b) =>
    a.created_at < b.created_at ? 1 : -1,
  );
}

export function countUnreadDummyNotifications(): number {
  return DUMMY_NOTIFICATIONS.filter((n) => !n.read_at).length;
}
