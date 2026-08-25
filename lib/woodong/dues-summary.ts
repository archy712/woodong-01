import type { Due, DuesStatus } from "./dues";

/**
 * 회비 집계 계산 (Task 024).
 *
 * 회비 납부율은 **모임 홈의 요약 카드**와 **회비 대시보드** 두 곳에서 따로 그려진다. 각자 계산하면
 * 같은 모임인데 홈은 60%, 대시보드는 50%처럼 어긋날 수 있어(반올림 기준 하나만 달라도 그렇다)
 * 계산은 전부 이 파일의 순수 함수로 모은다. 서버/클라이언트 어디서든 쓸 수 있도록 의존성을 두지 않는다.
 *
 * 여기서 다루는 값은 전부 **수입(청구·납부)뿐**이다. 지출 데이터(`woodong_expenses`)는 2차 확장
 * 대상이라 존재하지 않으므로 "잔액" 개념은 계산하지도, 노출하지도 않는다(PRD 3.4-a).
 */

export type DueCycleSummary = {
  /** 이 회비 항목의 청구 건수(= 생성 시점 활성 멤버 수). */
  totalCount: number;
  countByStatus: Record<DuesStatus, number>;
  /** 인원 기준 납부율 — 완납 인원 / 전체 청구 인원(%). 0~100. */
  paidRate: number;
  /** 총 청구액(원). */
  chargedAmount: number;
  /** 실제 수납액(원). 초과 납부가 있으면 청구액보다 클 수 있다. */
  collectedAmount: number;
  /**
   * 금액 기준 수납률(%). 진행률 바/게이지에 그대로 쓸 수 있도록 0~100으로 clamp한다.
   * 초과 납부분은 100%로 잘리지만, 화면에는 금액을 함께 표시하므로 실제 값이 가려지지 않는다.
   */
  collectedRate: number;
};

export const EMPTY_DUE_CYCLE_SUMMARY: DueCycleSummary = {
  totalCount: 0,
  countByStatus: { paid: 0, partial: 0, unpaid: 0 },
  paidRate: 0,
  chargedAmount: 0,
  collectedAmount: 0,
  collectedRate: 0,
};

/** 0~100 사이 정수 퍼센트로 정규화. `NaN`/`Infinity`(0으로 나눈 경우)는 0으로 떨어뜨린다. */
function toPercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  const value = Math.round((numerator / denominator) * 100);
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** 청구 하나의 납부 진행률(%). 초과 납부는 100%로 표시한다. */
export function dueProgressPercent(
  dueAmount: number,
  paidAmount: number,
): number {
  return toPercent(paidAmount, dueAmount);
}

/** 청구 하나의 남은 금액(원). 초과 납부여도 음수로 내려가지 않는다. */
export function dueRemainingAmount(
  dueAmount: number,
  paidAmount: number,
): number {
  return Math.max(dueAmount - paidAmount, 0);
}

/**
 * 회비 항목 하나의 집계.
 *
 * `paidAmounts`는 청구 id → 납부 이력 합계(`getDuesOverview`가 만들어 준다). 키가 없으면 0원이다.
 * 상태(`due.status`)는 애플리케이션이 다시 판정하지 않고 DB 트리거가 계산해 둔 값을 그대로 센다
 * (Task 003/023 — 화면이 자체 판정하면 트리거 결과와 어긋날 수 있다).
 */
export function summarizeDueCycle(
  dues: Due[],
  paidAmounts: Record<string, number>,
): DueCycleSummary {
  if (dues.length === 0) return EMPTY_DUE_CYCLE_SUMMARY;

  const countByStatus: Record<DuesStatus, number> = {
    paid: 0,
    partial: 0,
    unpaid: 0,
  };
  let chargedAmount = 0;
  let collectedAmount = 0;

  for (const due of dues) {
    countByStatus[due.status] += 1;
    chargedAmount += due.amount;
    collectedAmount += paidAmounts[due.id] ?? 0;
  }

  return {
    totalCount: dues.length,
    countByStatus,
    paidRate: toPercent(countByStatus.paid, dues.length),
    chargedAmount,
    collectedAmount,
    collectedRate: toPercent(collectedAmount, chargedAmount),
  };
}

/** 원 단위 금액 표시(`30,000원`). 화면 전반에서 같은 표기를 쓰기 위해 여기로 모았다. */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}
