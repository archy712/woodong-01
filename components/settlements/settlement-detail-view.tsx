"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  Loader2Icon,
  PrinterIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteSettlementAction,
  publishSettlementAction,
} from "@/lib/woodong/actions/settlements";
import { formatWon } from "@/lib/woodong/dues-summary";
import { isoToDateOnly } from "@/lib/woodong/dues";
import { memberDisplayName } from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import {
  filterSettlementItems,
  formatSettlementPeriod,
  settlementCategoryLabel,
  type SettlementDetail,
  type SettlementItem,
  type SettlementItemType,
} from "@/lib/woodong/settlements";
import { RecalculateSettlementDialog } from "@/components/settlements/settlement-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** 수입/지출 한 덩어리. 항목이 없는 쪽은 아예 그리지 않고 상위에서 안내 문구를 낸다. */
function ItemTable({
  title,
  items,
  itemType,
  labels,
  categoryLabels,
}: {
  title: string;
  items: SettlementItem[];
  itemType: SettlementItemType;
  labels: Dictionary["settlements"];
  categoryLabels: {
    dueType: Record<string, string>;
    expense: Record<string, string>;
  };
}) {
  if (items.length === 0) return null;

  return (
    <section className="print-avoid-break flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 border-b py-2 last:border-b-0"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">
                {settlementCategoryLabel(
                  item.category,
                  categoryLabels,
                  itemType,
                )}
              </span>
              {item.description && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="text-sm font-semibold tabular-nums">
                {formatWon(item.amount)}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {item.entry_count}
                {labels.detail.entryCountSuffix}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 발행 버튼 + 확인 다이얼로그. 성공 시 알림 건수를 토스트에 함께 알린다. */
function PublishButton({
  groupId,
  settlementId,
  labels,
  commonLabels,
  onPublished,
}: {
  groupId: string;
  settlementId: string;
  labels: Dictionary["settlements"];
  commonLabels: Dictionary["common"];
  onPublished: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePublish() {
    startTransition(async () => {
      const result = await publishSettlementAction({
        groupId,
        settlementId,
        // 알림 문구는 사용자의 로케일 사전에서 온다. 팬아웃 대상 각자의 언어가 아니라
        // **발행한 총무의 언어**로 기록되는데, 이는 공지 알림(Task 025)과 같은 한계다.
        title: labels.publish.notificationTitle,
        body: labels.publish.notificationBody,
      });
      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }
      toast.success(
        `${labels.publish.successToast} ${result.data.notifiedCount}${labels.publish.notifiedToastSuffix}`,
      );
      onPublished();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" size="sm" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
          {labels.publish.triggerButton}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.publish.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.publish.confirmMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{commonLabels.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handlePublish}>
            {labels.publish.confirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** 삭제 버튼 + 확인 다이얼로그. 삭제 후에는 목록으로 돌아간다(이 화면이 사라졌으므로). */
function DeleteButton({
  groupId,
  settlementId,
  labels,
  commonLabels,
  onDeleted,
}: {
  groupId: string;
  settlementId: string;
  labels: Dictionary["settlements"];
  commonLabels: Dictionary["common"];
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSettlementAction({ groupId, settlementId });
      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }
      toast.success(labels.delete.successToast);
      onDeleted();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Trash2Icon />
          )}
          {labels.delete.triggerButton}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.delete.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.delete.confirmMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{commonLabels.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {commonLabels.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * 정산 리포트 상세 + 인쇄본 (Task 036, PRD 3.4-b).
 *
 * 화면에 보이는 숫자는 전부 `woodong_settlement_items` 스냅샷에서 온다. 원본(회비 납부·지출)을
 * 다시 집계하지 않는다 — 그러면 발행 이후 원본이 바뀔 때마다 "이미 공유한 리포트"의 숫자가
 * 조용히 달라진다.
 *
 * **PDF는 브라우저 인쇄로 만든다.** 인쇄 대상 영역에 `print-report`를, 조작 영역에
 * `print-hidden`을 붙이고 실제 레이아웃은 `app/globals.css`의 `@media print` 블록이 담당한다
 * (라이브러리를 쓰지 않는 이유는 그쪽 주석 참고).
 */
export function SettlementDetailView({
  groupId,
  detail,
  members,
  isAdmin,
  labels,
  commonLabels,
  exportLabels,
  categoryLabels,
  unnamedMemberLabel,
  groupName,
}: {
  groupId: string;
  detail: SettlementDetail;
  /**
   * 발행자·작성자 이름을 여기서 찾는다. 이름은 공유 `profiles`에 있고 그 테이블의 SELECT 정책이
   * **본인 행 또는 앱 관리자**라 정산 조회에서 직접 조인할 수 없다(지출 목록과 같은 제약).
   */
  members: GroupMemberRow[];
  isAdmin: boolean;
  labels: Dictionary["settlements"];
  commonLabels: Dictionary["common"];
  /** CSV 내보내기 문구 (Task 040). 이 리포트 하나만 받는 버튼에 쓴다. */
  exportLabels: Dictionary["exports"];
  categoryLabels: {
    dueType: Record<string, string>;
    expense: Record<string, string>;
  };
  unnamedMemberLabel: string;
  /** 인쇄본 상단에 모임 이름을 넣는다. 종이에 남으면 어느 모임 정산인지 알 수 없어서는 안 된다. */
  groupName: string;
}) {
  const router = useRouter();
  const { settlement, items } = detail;

  const incomeItems = filterSettlementItems(items, "income");
  const expenseItems = filterSettlementItems(items, "expense");

  function nameOf(userId: string | null): string | null {
    if (!userId) return null;
    const member = members.find((candidate) => candidate.userId === userId);
    return member ? memberDisplayName(member, unnamedMemberLabel) : null;
  }

  const publishedByName = nameOf(settlement.published_by);
  const createdByName = nameOf(settlement.created_by);
  const isPublished = settlement.status === "published";

  return (
    <div className="flex flex-col gap-6">
      {/* 조작 줄. 인쇄물에는 남지 않는다. */}
      <div className="print-hidden flex flex-wrap items-center justify-between gap-2">
        <Badge variant={isPublished ? "default" : "outline"}>
          {isPublished ? labels.statusPublished : labels.statusDraft}
        </Badge>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <PrinterIcon />
            {labels.detail.printButton}
          </Button>
          {/*
            이 리포트 하나만 CSV로 받는다(Task 040). 인쇄본은 사람이 읽는 결과물이고 CSV는
            다음 총무가 시트에서 이어 쓰는 결과물이라 둘 다 필요하다. 총무 전용인 이유는
            Route Handler 주석 참고 — 링크를 직접 열어도 403이다.
          */}
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`/protected/groups/${groupId}/dues/export?dataset=settlements&settlementId=${settlement.id}`}
              >
                <DownloadIcon />
                {exportLabels.settlementCsvButton}
              </a>
            </Button>
          )}
          {isAdmin && !isPublished && (
            <>
              <RecalculateSettlementDialog
                groupId={groupId}
                settlement={settlement}
                labels={labels}
                onRecalculated={() => router.refresh()}
              />
              <PublishButton
                groupId={groupId}
                settlementId={settlement.id}
                labels={labels}
                commonLabels={commonLabels}
                onPublished={() => router.refresh()}
              />
            </>
          )}
          {isAdmin && (
            <DeleteButton
              groupId={groupId}
              settlementId={settlement.id}
              labels={labels}
              commonLabels={commonLabels}
              onDeleted={() =>
                router.push(`/protected/groups/${groupId}/dues/settlements`)
              }
            />
          )}
        </div>
      </div>

      {isAdmin && !isPublished && (
        <p className="print-hidden text-sm text-muted-foreground">
          {labels.draftVisibilityNotice}
        </p>
      )}

      {/* 여기부터가 인쇄 대상이다. */}
      <article className="print-report flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{groupName}</p>
          <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatSettlementPeriod(settlement)}
          </p>
        </header>

        <dl className="print-avoid-break grid grid-cols-3 gap-2 rounded-lg border p-4 text-center">
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">
              {labels.detail.totalIncomeLabel}
            </dt>
            <dd className="text-sm font-semibold tabular-nums">
              {formatWon(settlement.total_income)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">
              {labels.detail.totalExpenseLabel}
            </dt>
            <dd className="text-sm font-semibold tabular-nums">
              {formatWon(settlement.total_expense)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">
              {labels.detail.balanceLabel}
            </dt>
            {/* 잔액이 음수면 그대로 보여준다(회비 대시보드와 같은 규칙, Task 035). */}
            <dd
              className={
                settlement.balance < 0
                  ? "text-sm font-semibold text-destructive tabular-nums"
                  : "text-sm font-semibold tabular-nums"
              }
            >
              {formatWon(settlement.balance)}
            </dd>
          </div>
        </dl>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {labels.detail.noItems}
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <ItemTable
              title={labels.detail.incomeSectionTitle}
              items={incomeItems}
              itemType="income"
              labels={labels}
              categoryLabels={categoryLabels}
            />
            <ItemTable
              title={labels.detail.expenseSectionTitle}
              items={expenseItems}
              itemType="expense"
              labels={labels}
              categoryLabels={categoryLabels}
            />
          </div>
        )}

        <Separator />

        <footer className="flex flex-col gap-2 text-xs text-muted-foreground">
          <dl className="flex flex-wrap gap-x-6 gap-y-1">
            {isPublished && settlement.published_at && (
              <div className="flex gap-1">
                <dt>{labels.detail.publishedAtLabel}</dt>
                <dd className="tabular-nums">
                  {isoToDateOnly(settlement.published_at)}
                </dd>
              </div>
            )}
            {publishedByName && (
              <div className="flex gap-1">
                <dt>{labels.detail.publishedByLabel}</dt>
                <dd>{publishedByName}</dd>
              </div>
            )}
            {createdByName && (
              <div className="flex gap-1">
                <dt>{labels.detail.createdByLabel}</dt>
                <dd>{createdByName}</dd>
              </div>
            )}
          </dl>
          <p>{labels.detail.snapshotNotice}</p>
          <p>{labels.detail.incomeNote}</p>
        </footer>
      </article>

      <p className="print-hidden text-xs text-muted-foreground">
        {labels.detail.printHint}
      </p>
    </div>
  );
}
