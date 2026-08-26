"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLinkIcon,
  Loader2Icon,
  ReceiptIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { deleteExpenseAction } from "@/lib/woodong/actions/expenses";
import {
  summarizeGroupBalance,
  sumExpensesByCategory,
  type ExpenseRow,
} from "@/lib/woodong/expenses";
import { formatWon } from "@/lib/woodong/dues-summary";
import { memberDisplayName } from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import { ExpenseFormDialog } from "@/components/dues/expense-form-dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** 지출 삭제 버튼 + 확인 다이얼로그. 영수증 오브젝트도 서버에서 함께 지운다. */
function DeleteExpenseButton({
  groupId,
  expenseId,
  labels,
  commonLabels,
  onDeleted,
}: {
  groupId: string;
  expenseId: string;
  labels: Dictionary["expenses"];
  commonLabels: Dictionary["common"];
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteExpenseAction({ groupId, expenseId });
      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }
      toast.success(labels.deleteSuccessToast);
      onDeleted();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={labels.deleteButton}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Trash2Icon />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.deleteDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.deleteConfirmMessage}
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
 * 지출 내역 + 모임 잔액 (Task 035, PRD 3.4-b).
 *
 * 1차 MVP에서 이 자리에는 "수입만 집계합니다"라는 안내 카드가 서 있었다. 지출 데이터가
 * 생기면서 그 안내가 더 이상 사실이 아니게 되어 잔액 카드로 대체했다.
 */
export function ExpenseSection({
  groupId,
  expenses,
  paidAmounts,
  members,
  isAdmin,
  labels,
  commonLabels,
  unnamedMemberLabel,
}: {
  groupId: string;
  expenses: ExpenseRow[];
  /** 청구 id → 납부 이력 합계. 잔액의 "수입" 쪽 근거다(`getDuesOverview` 산출물). */
  paidAmounts: Record<string, number>;
  members: GroupMemberRow[];
  isAdmin: boolean;
  labels: Dictionary["expenses"];
  commonLabels: Dictionary["common"];
  unnamedMemberLabel: string;
}) {
  const router = useRouter();

  const memberByUserId = useMemo(() => {
    const map = new Map<string, GroupMemberRow>();
    for (const member of members) map.set(member.userId, member);
    return map;
  }, [members]);

  const balance = useMemo(
    () => summarizeGroupBalance(paidAmounts, expenses),
    [paidAmounts, expenses],
  );
  const byCategory = useMemo(() => sumExpensesByCategory(expenses), [expenses]);

  function handleChanged() {
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{labels.balance.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">
                {labels.balance.incomeLabel}
              </dt>
              <dd className="text-sm font-semibold tabular-nums">
                {formatWon(balance.totalIncome)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">
                {labels.balance.expenseLabel}
              </dt>
              <dd className="text-sm font-semibold tabular-nums">
                {formatWon(balance.totalExpense)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">
                {labels.balance.balanceLabel}
              </dt>
              {/*
                지출이 수입을 넘으면 음수가 된다. 0으로 깎아 숨기지 않는다 — 잔액이 마이너스인
                것은 총무가 가장 먼저 알아야 할 사실이다.
              */}
              <dd
                className={
                  balance.balance < 0
                    ? "text-sm font-semibold text-destructive tabular-nums"
                    : "text-sm font-semibold tabular-nums"
                }
              >
                {formatWon(balance.balance)}
              </dd>
            </div>
          </dl>

          {byCategory.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {byCategory.map(({ category, amount }) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="font-normal"
                >
                  {labels.category[category]} {formatWon(amount)}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">{labels.balance.note}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{labels.sectionTitle}</h2>
          {/* 쓰기는 RLS가 막지만, 반드시 실패할 버튼을 보여주지 않는다(이중 방어). */}
          {isAdmin && (
            <ExpenseFormDialog
              groupId={groupId}
              members={members}
              labels={labels}
              commonLabels={commonLabels}
              unnamedMemberLabel={unnamedMemberLabel}
              onSaved={handleChanged}
            />
          )}
        </div>

        {expenses.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ReceiptIcon />
              </EmptyMedia>
              <EmptyTitle>{labels.emptyState}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-2">
            {expenses.map((expense) => {
              const member = expense.paid_by
                ? memberByUserId.get(expense.paid_by)
                : undefined;
              const paidByLabel = member
                ? memberDisplayName(member, unnamedMemberLabel)
                : null;

              return (
                <Item key={expense.id} variant="outline">
                  <ItemContent>
                    <ItemTitle className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {labels.category[expense.category]}
                      </Badge>
                      <span className="tabular-nums">
                        {formatWon(expense.amount)}
                      </span>
                    </ItemTitle>
                    <ItemDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>{expense.spent_at}</span>
                      {paidByLabel && <span>{paidByLabel}</span>}
                      {expense.memo && <span>{expense.memo}</span>}
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4"
                        >
                          {labels.receiptViewLabel}
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      ) : (
                        <span>{labels.receiptNoneLabel}</span>
                      )}
                    </ItemDescription>
                  </ItemContent>
                  {isAdmin && (
                    <ItemActions>
                      <ExpenseFormDialog
                        groupId={groupId}
                        expense={expense}
                        members={members}
                        labels={labels}
                        commonLabels={commonLabels}
                        unnamedMemberLabel={unnamedMemberLabel}
                        onSaved={handleChanged}
                      />
                      <DeleteExpenseButton
                        groupId={groupId}
                        expenseId={expense.id}
                        labels={labels}
                        commonLabels={commonLabels}
                        onDeleted={handleChanged}
                      />
                    </ItemActions>
                  )}
                </Item>
              );
            })}
          </ItemGroup>
        )}

        {!isAdmin && (
          <p className="text-xs text-muted-foreground">
            {labels.adminOnlyNotice}
          </p>
        )}
      </div>
    </div>
  );
}
