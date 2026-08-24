import type { Due, DueCycle, DuesStatus, Payment } from "@/lib/woodong/dues";
import { GROUP_ID, dueCycleId, dueId, paymentId } from "./ids";
import {
  getDummyActiveMembers,
  HIKING_MEMBERS,
  RUNNING_MEMBERS,
  BOOK_CLUB_MEMBERS,
} from "./groups";

interface DueSeed {
  userId: string;
  status: DuesStatus;
  /** 부분납부일 때만 사용하는 실제 납부 누계액(전액보다 작아야 함). */
  paidAmount?: number;
}

let dueSeq = 0;
let paymentSeq = 0;

function buildDueCycle(n: number, input: Omit<DueCycle, "id">): DueCycle {
  return { id: dueCycleId(n), ...input };
}

function buildDuesAndPayments(
  cycle: DueCycle,
  seeds: DueSeed[],
  recordedBy: string,
  paidAtBase: string,
): { dues: Due[]; payments: Payment[] } {
  const dues: Due[] = [];
  const payments: Payment[] = [];

  for (const seed of seeds) {
    dueSeq += 1;
    const due: Due = {
      id: dueId(dueSeq),
      due_cycle_id: cycle.id,
      group_id: cycle.group_id,
      user_id: seed.userId,
      amount: cycle.amount,
      status: seed.status,
      last_reminded_at: null,
    };
    dues.push(due);

    if (seed.status === "paid" || seed.status === "partial") {
      paymentSeq += 1;
      payments.push({
        id: paymentId(paymentSeq),
        due_id: due.id,
        group_id: cycle.group_id,
        amount: seed.status === "paid" ? cycle.amount : (seed.paidAmount ?? 0),
        paid_at: paidAtBase,
        recorded_by: recordedBy,
        memo: seed.status === "partial" ? "우선 절반만 입금했어요" : null,
      });
    }
  }

  return { dues, payments };
}

// ── 러닝크루 ─────────────────────────────────────────────────────────────
const runningAdmin = RUNNING_MEMBERS[0].user_id;

export const RUNNING_DUE_CYCLE_AUG: DueCycle = buildDueCycle(1, {
  group_id: GROUP_ID.running,
  title: "2026년 8월 정기회비",
  period: "2026-08",
  amount: 20000,
  due_type: "regular",
  due_date: "2026-08-31",
  reminder_interval_days: 7,
  created_by: runningAdmin,
  created_at: "2026-08-01T09:00:00+09:00",
});

export const RUNNING_DUE_CYCLE_JUL: DueCycle = buildDueCycle(2, {
  group_id: GROUP_ID.running,
  title: "2026년 7월 정기회비",
  period: "2026-07",
  amount: 20000,
  due_type: "regular",
  due_date: "2026-07-31",
  reminder_interval_days: 7,
  created_by: runningAdmin,
  created_at: "2026-07-01T09:00:00+09:00",
});

const runningAugResult = buildDuesAndPayments(
  RUNNING_DUE_CYCLE_AUG,
  [
    { userId: RUNNING_MEMBERS[0].user_id, status: "paid" },
    { userId: RUNNING_MEMBERS[1].user_id, status: "paid" },
    { userId: RUNNING_MEMBERS[2].user_id, status: "paid" },
    { userId: RUNNING_MEMBERS[3].user_id, status: "paid" },
    { userId: RUNNING_MEMBERS[4].user_id, status: "paid" },
    {
      userId: RUNNING_MEMBERS[5].user_id,
      status: "partial",
      paidAmount: 10000,
    },
    { userId: RUNNING_MEMBERS[6].user_id, status: "unpaid" },
    { userId: RUNNING_MEMBERS[7].user_id, status: "unpaid" },
    { userId: RUNNING_MEMBERS[8].user_id, status: "unpaid" },
  ],
  runningAdmin,
  "2026-08-10T20:00:00+09:00",
);

const runningJulResult = buildDuesAndPayments(
  RUNNING_DUE_CYCLE_JUL,
  RUNNING_MEMBERS.map((m) => ({ userId: m.user_id, status: "paid" as const })),
  runningAdmin,
  "2026-07-15T20:00:00+09:00",
);

// ── 등산모임 ─────────────────────────────────────────────────────────────
const hikingAdmin = HIKING_MEMBERS[0].user_id;
const hikingActive = getDummyActiveMembers(GROUP_ID.hiking);

export const HIKING_DUE_CYCLE_AUG: DueCycle = buildDueCycle(3, {
  group_id: GROUP_ID.hiking,
  title: "2026년 8월 정기회비",
  period: "2026-08",
  amount: 30000,
  due_type: "regular",
  due_date: "2026-08-31",
  reminder_interval_days: 7,
  created_by: hikingAdmin,
  created_at: "2026-08-01T09:00:00+09:00",
});

export const HIKING_DUE_CYCLE_SEORAK: DueCycle = buildDueCycle(4, {
  group_id: GROUP_ID.hiking,
  title: "설악산 산행 교통비",
  period: "2026-08 번개산행",
  amount: 15000,
  due_type: "extra",
  due_date: "2026-08-05",
  reminder_interval_days: 3,
  created_by: hikingAdmin,
  created_at: "2026-07-25T09:00:00+09:00",
});

const hikingAugResult = buildDuesAndPayments(
  HIKING_DUE_CYCLE_AUG,
  hikingActive.map((m, index) => ({
    userId: m.user_id,
    status: (index < 7
      ? "paid"
      : index < 9
        ? "partial"
        : "unpaid") as DuesStatus,
    paidAmount: index >= 7 && index < 9 ? 15000 : undefined,
  })),
  hikingAdmin,
  "2026-08-05T19:00:00+09:00",
);

const hikingSeorakResult = buildDuesAndPayments(
  HIKING_DUE_CYCLE_SEORAK,
  hikingActive.map((m, index) => ({
    userId: m.user_id,
    status: (index < 9 ? "paid" : "unpaid") as DuesStatus,
  })),
  hikingAdmin,
  "2026-07-30T19:00:00+09:00",
);

// ── 책모임 ───────────────────────────────────────────────────────────────
const bookClubAdmin = BOOK_CLUB_MEMBERS[0].user_id;

export const BOOK_CLUB_DUE_CYCLE_AUG: DueCycle = buildDueCycle(5, {
  group_id: GROUP_ID.bookClub,
  title: "8월 책 구매비",
  period: "2026-08",
  amount: 10000,
  due_type: "regular",
  due_date: "2026-08-28",
  reminder_interval_days: 7,
  created_by: bookClubAdmin,
  created_at: "2026-08-05T09:00:00+09:00",
});

const bookClubAugResult = buildDuesAndPayments(
  BOOK_CLUB_DUE_CYCLE_AUG,
  [
    { userId: BOOK_CLUB_MEMBERS[0].user_id, status: "paid" },
    { userId: BOOK_CLUB_MEMBERS[1].user_id, status: "paid" },
    { userId: BOOK_CLUB_MEMBERS[2].user_id, status: "paid" },
    { userId: BOOK_CLUB_MEMBERS[3].user_id, status: "unpaid" },
    { userId: BOOK_CLUB_MEMBERS[4].user_id, status: "unpaid" },
    { userId: BOOK_CLUB_MEMBERS[5].user_id, status: "unpaid" },
  ],
  bookClubAdmin,
  "2026-08-10T20:00:00+09:00",
);

export const DUMMY_DUE_CYCLES: Record<string, DueCycle[]> = {
  [GROUP_ID.running]: [RUNNING_DUE_CYCLE_AUG, RUNNING_DUE_CYCLE_JUL],
  [GROUP_ID.hiking]: [HIKING_DUE_CYCLE_AUG, HIKING_DUE_CYCLE_SEORAK],
  [GROUP_ID.bookClub]: [BOOK_CLUB_DUE_CYCLE_AUG],
};

export const DUMMY_DUES_BY_CYCLE: Record<string, Due[]> = {
  [RUNNING_DUE_CYCLE_AUG.id]: runningAugResult.dues,
  [RUNNING_DUE_CYCLE_JUL.id]: runningJulResult.dues,
  [HIKING_DUE_CYCLE_AUG.id]: hikingAugResult.dues,
  [HIKING_DUE_CYCLE_SEORAK.id]: hikingSeorakResult.dues,
  [BOOK_CLUB_DUE_CYCLE_AUG.id]: bookClubAugResult.dues,
};

export const DUMMY_PAYMENTS_BY_CYCLE: Record<string, Payment[]> = {
  [RUNNING_DUE_CYCLE_AUG.id]: runningAugResult.payments,
  [RUNNING_DUE_CYCLE_JUL.id]: runningJulResult.payments,
  [HIKING_DUE_CYCLE_AUG.id]: hikingAugResult.payments,
  [HIKING_DUE_CYCLE_SEORAK.id]: hikingSeorakResult.payments,
  [BOOK_CLUB_DUE_CYCLE_AUG.id]: bookClubAugResult.payments,
};

export function getDummyDueCycles(groupId: string): DueCycle[] {
  return DUMMY_DUE_CYCLES[groupId] ?? [];
}

export function getDummyDuesForCycle(cycleId: string): Due[] {
  return DUMMY_DUES_BY_CYCLE[cycleId] ?? [];
}

export function getDummyPaymentForDue(dueId_: string): Payment | undefined {
  return Object.values(DUMMY_PAYMENTS_BY_CYCLE)
    .flat()
    .find((p) => p.due_id === dueId_);
}

/** 특정 청구(Due)의 실제 누계 납부액을 계산한다(paid=전액, partial=이력 합계, unpaid=0). */
export function calcDuePaidAmount(due: Due): number {
  if (due.status === "paid") return due.amount;
  if (due.status === "unpaid") return 0;
  const payment = getDummyPaymentForDue(due.id);
  return payment?.amount ?? 0;
}

/** 회비 항목의 전체 납부율(0~100, 정수 반올림)을 계산한다. */
export function calcDueCyclePaidRate(cycleId: string): number {
  const dues = getDummyDuesForCycle(cycleId);
  if (dues.length === 0) return 0;
  const paid = dues.filter((d) => d.status === "paid").length;
  return Math.round((paid / dues.length) * 100);
}
