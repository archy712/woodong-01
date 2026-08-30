import type { CsvValue } from "@/lib/woodong/csv";
import type { Due, DueCycle, Payment } from "@/lib/woodong/dues";
import { isoToDateOnly } from "@/lib/woodong/dues";
import { dueRemainingAmount } from "@/lib/woodong/dues-summary";
import type { Expense } from "@/lib/woodong/expenses";
import { memberDisplayName } from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import type { DuesOverview } from "@/lib/woodong/queries/dues";
import {
  settlementCategoryLabel,
  type SettlementDetail,
} from "@/lib/woodong/settlements";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * CSV 내보내기 데이터셋 (Task 040, PRD 9장 "정산 데이터 이관 부재").
 *
 * 총무가 바뀔 때 인수인계할 것은 정산 리포트만이 아니다. 리포트는 기간을 잘라 굳힌 **요약**이라,
 * 그것만 넘기면 다음 총무가 "이 금액이 어디서 나왔는지"를 되짚을 수 없다. 그래서 원장 3종
 * (청구 현황 / 납부 이력 / 지출)과 리포트 스냅샷을 각각 내보낸다.
 *
 * 한 파일에 다 담지 않는 이유: 세 원장은 행의 의미(1행 = 청구 / 납부 / 지출)가 서로 달라서
 * 한 시트에 합치면 어느 열이 어느 행에 유효한지 알 수 없는 표가 된다.
 */
export const EXPORT_DATASETS = [
  "dues",
  "payments",
  "expenses",
  "settlements",
] as const;

export type ExportDataset = (typeof EXPORT_DATASETS)[number];

export function isExportDataset(value: string): value is ExportDataset {
  return (EXPORT_DATASETS as readonly string[]).includes(value);
}

/** 직렬화 직전 상태. 파일명에는 확장자를 붙이지 않는다(`csvContentDisposition()`이 붙인다). */
export type CsvTable = {
  filename: string;
  headers: string[];
  rows: CsvValue[][];
};

type ExportLabels = Dictionary["exports"];

/**
 * 이름 조회표.
 *
 * 멤버 목록을 매 행 `find()`로 훑으면 (멤버 수 × 행 수)가 된다. 회비 청구는 멤버 수만큼
 * 곱해져 생기는 데이터라 이 곱이 가장 빨리 커지는 곳이다.
 */
function buildNameMap(
  members: GroupMemberRow[],
  unnamedMemberLabel: string,
): Map<string, string> {
  return new Map(
    members.map((member) => [
      member.userId,
      memberDisplayName(member, unnamedMemberLabel),
    ]),
  );
}

/**
 * 탈퇴한 멤버의 이름은 조회표에 없다.
 *
 * 빈칸으로 두면 "누구 청구인지 알 수 없는 줄"이 되므로 안내 문구를 넣고, 식별은 함께 실어 보내는
 * 사용자 id 열로 한다.
 */
function nameOf(
  nameMap: Map<string, string>,
  userId: string | null,
  formerMemberLabel: string,
): string {
  if (!userId) return "";
  return nameMap.get(userId) ?? formerMemberLabel;
}

/** 회비 항목의 기간 표기. `period`는 자유 문자열이라(예: `2026-08`) 그대로 싣는다. */
function cycleTitleOf(cycle: DueCycle | undefined): string {
  return cycle?.title ?? "";
}

/**
 * ① 청구 현황 — 1행 = 멤버 1명의 회비 1건.
 *
 * 화면의 회비 대시보드와 같은 값을 담되, 납부액은 **납부 이력 합계**(`paidAmounts`)를 쓴다.
 * `woodong_dues.status`와 같은 기준으로 계산된 값이라 두 열이 서로 어긋나지 않는다(Task 023).
 */
export function buildDuesTable({
  overview,
  members,
  labels,
  statusLabels,
  dueTypeLabels,
  unnamedMemberLabel,
  groupName,
}: {
  overview: DuesOverview;
  members: GroupMemberRow[];
  labels: ExportLabels;
  statusLabels: Dictionary["dues"]["status"];
  dueTypeLabels: Dictionary["dues"]["type"];
  unnamedMemberLabel: string;
  groupName: string;
}): CsvTable {
  const nameMap = buildNameMap(members, unnamedMemberLabel);
  const columns = labels.columns.dues;
  const rows: CsvValue[][] = [];

  for (const cycle of overview.cycles) {
    const dues: Due[] = overview.duesByCycle[cycle.id] ?? [];
    for (const due of dues) {
      const paid = overview.paidAmounts[due.id] ?? 0;
      rows.push([
        cycle.title,
        cycle.period,
        dueTypeLabels[cycle.due_type],
        cycle.due_date,
        nameOf(nameMap, due.user_id, labels.formerMemberLabel),
        due.amount,
        paid,
        dueRemainingAmount(due.amount, paid),
        statusLabels[due.status],
        due.user_id,
        due.id,
      ]);
    }
  }

  return {
    filename: `${groupName}_${labels.filename.dues}`,
    headers: [
      columns.cycleTitle,
      columns.period,
      columns.dueType,
      columns.dueDate,
      columns.memberName,
      columns.chargedAmount,
      columns.paidAmount,
      columns.remainingAmount,
      columns.status,
      columns.userId,
      columns.dueId,
    ],
    rows,
  };
}

/**
 * ② 납부 이력 — 1행 = 납부 1건.
 *
 * 부분 납부가 여러 번 쌓이는 구조라(Task 023) 청구 1건에 여러 행이 붙을 수 있다. 이 파일이
 * "언제 누가 얼마를 냈는지"의 원본이고, ①의 납부액 열은 여기 합계다.
 */
export function buildPaymentsTable({
  overview,
  members,
  labels,
  unnamedMemberLabel,
  groupName,
}: {
  overview: DuesOverview;
  members: GroupMemberRow[];
  labels: ExportLabels;
  unnamedMemberLabel: string;
  groupName: string;
}): CsvTable {
  const nameMap = buildNameMap(members, unnamedMemberLabel);
  const columns = labels.columns.payments;

  // 청구 id → 회비 항목/납부자를 되짚기 위한 역인덱스. 납부 행에는 `due_id`만 있다.
  const dueIndex = new Map<string, { cycle: DueCycle | undefined; due: Due }>();
  for (const cycle of overview.cycles) {
    for (const due of overview.duesByCycle[cycle.id] ?? []) {
      dueIndex.set(due.id, { cycle, due });
    }
  }

  const rows: CsvValue[][] = [];
  for (const payments of Object.values(overview.paymentsByDue)) {
    for (const payment of payments as Payment[]) {
      const linked = dueIndex.get(payment.due_id);
      rows.push([
        isoToDateOnly(payment.paid_at),
        cycleTitleOf(linked?.cycle),
        nameOf(nameMap, linked?.due.user_id ?? null, labels.formerMemberLabel),
        payment.amount,
        payment.memo ?? "",
        nameOf(nameMap, payment.recorded_by, labels.formerMemberLabel),
        payment.due_id,
        payment.id,
      ]);
    }
  }

  // 납부일 역순(같은 날이면 id 순)으로 고정한다. `paymentsByDue`를 순회하면 청구별로 묶여 나와
  // 파일을 열었을 때 시간 흐름이 보이지 않는다.
  rows.sort((a, b) => String(b[0]).localeCompare(String(a[0])));

  return {
    filename: `${groupName}_${labels.filename.payments}`,
    headers: [
      columns.paidAt,
      columns.cycleTitle,
      columns.memberName,
      columns.amount,
      columns.memo,
      columns.recordedBy,
      columns.dueId,
      columns.paymentId,
    ],
    rows,
  };
}

/** ③ 지출 — 1행 = 지출 1건. 영수증은 만료되는 서명 URL 대신 오브젝트 경로를 싣는다. */
export function buildExpensesTable({
  expenses,
  members,
  labels,
  categoryLabels,
  unnamedMemberLabel,
  groupName,
}: {
  expenses: Expense[];
  members: GroupMemberRow[];
  labels: ExportLabels;
  categoryLabels: Dictionary["expenses"]["category"];
  unnamedMemberLabel: string;
  groupName: string;
}): CsvTable {
  const nameMap = buildNameMap(members, unnamedMemberLabel);
  const columns = labels.columns.expenses;

  const rows: CsvValue[][] = expenses.map((expense) => [
    expense.spent_at,
    categoryLabels[expense.category] ?? expense.category,
    expense.amount,
    nameOf(nameMap, expense.paid_by, labels.formerMemberLabel),
    expense.memo ?? "",
    expense.receipt_object_path ?? "",
    isoToDateOnly(expense.created_at),
    expense.id,
  ]);

  return {
    filename: `${groupName}_${labels.filename.expenses}`,
    headers: [
      columns.spentAt,
      columns.category,
      columns.amount,
      columns.paidBy,
      columns.memo,
      columns.receiptPath,
      columns.createdAt,
      columns.expenseId,
    ],
    rows,
  };
}

/**
 * ④ 정산 리포트 — 1행 = 리포트 항목 1개.
 *
 * 리포트 헤더(기간·상태·합계)를 항목마다 반복해 싣는다. 헤더와 항목을 두 파일로 나누면 받는
 * 쪽이 직접 조인해야 하고, 한 파일 안에서 서로 다른 모양의 블록을 섞으면 표로 읽히지 않는다.
 * 중복은 스프레드시트의 피벗·필터가 흡수해 준다.
 */
export function buildSettlementsTable({
  details,
  labels,
  statusLabels,
  categoryLabels,
  groupName,
}: {
  details: SettlementDetail[];
  labels: ExportLabels;
  statusLabels: { draft: string; published: string };
  categoryLabels: {
    dueType: Record<string, string>;
    expense: Record<string, string>;
  };
  groupName: string;
}): CsvTable {
  const columns = labels.columns.settlements;
  const rows: CsvValue[][] = [];

  for (const { settlement, items } of details) {
    const shared: CsvValue[] = [
      settlement.period_start,
      settlement.period_end,
      settlement.status === "published"
        ? statusLabels.published
        : statusLabels.draft,
      settlement.published_at ? isoToDateOnly(settlement.published_at) : "",
      settlement.total_income,
      settlement.total_expense,
      settlement.balance,
    ];

    if (items.length === 0) {
      // 항목이 하나도 없는 리포트도 한 줄은 남긴다. 빼 버리면 "그 기간에 정산을 안 했다"와
      // "정산했는데 수입·지출이 0이었다"가 구분되지 않는다.
      rows.push([...shared, "", "", "", "", "", settlement.id]);
      continue;
    }

    for (const item of items) {
      rows.push([
        ...shared,
        item.item_type === "income"
          ? labels.itemTypeIncome
          : labels.itemTypeExpense,
        settlementCategoryLabel(item.category, categoryLabels, item.item_type),
        item.description ?? "",
        item.amount,
        item.entry_count,
        settlement.id,
      ]);
    }
  }

  return {
    filename: `${groupName}_${labels.filename.settlements}`,
    headers: [
      columns.periodStart,
      columns.periodEnd,
      columns.status,
      columns.publishedAt,
      columns.totalIncome,
      columns.totalExpense,
      columns.balance,
      columns.itemType,
      columns.category,
      columns.description,
      columns.amount,
      columns.entryCount,
      columns.settlementId,
    ],
    rows,
  };
}
