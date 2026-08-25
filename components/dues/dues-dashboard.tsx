"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Loader2Icon, WalletIcon } from "lucide-react";
import { toast } from "sonner";

import { recordPaymentAction } from "@/lib/woodong/actions/dues";
import type { Due, DueCycle, DuesStatus, Payment } from "@/lib/woodong/dues";
import {
  dueRemainingAmount,
  formatWon,
  summarizeDueCycle,
} from "@/lib/woodong/dues-summary";
import {
  memberAvatarEmoji,
  memberDisplayName,
} from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import { CreateDueCycleDialog } from "@/components/dues/create-due-cycle-dialog";
import {
  DuesMemberProgressBar,
  DuesOverallRateGauge,
  DuesStatusBreakdownChart,
} from "@/components/dues/dues-paid-rate-chart";
import { PaymentManagerDialog } from "@/components/dues/payment-manager-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STATUS_BADGE_VARIANT: Record<
  DuesStatus,
  "default" | "secondary" | "outline"
> = {
  paid: "default",
  partial: "secondary",
  unpaid: "outline",
};

/** 상태 필터 값 — `all`은 필터 없음. */
type StatusFilter = "all" | DuesStatus;

const STATUS_FILTERS: StatusFilter[] = ["all", "unpaid", "partial", "paid"];

/**
 * 남은 금액을 한 번에 기록하는 "완납 처리" 버튼 (Task 023).
 *
 * 상태를 직접 `paid`로 바꾸는 게 아니라 **남은 금액만큼의 납부 이력을 남기고** 상태 갱신은 트리거에
 * 맡긴다. 총무가 흔히 하는 "전액 입금 확인"을 다이얼로그를 열지 않고 끝내려는 단축 경로일 뿐,
 * 저장되는 데이터는 다이얼로그에서 직접 기록한 것과 완전히 같다.
 */
function MarkPaidButton({
  dueId,
  remaining,
  labels,
  commonLabels,
  onRecorded,
}: {
  dueId: string;
  remaining: number;
  labels: Dictionary["dues"];
  commonLabels: Dictionary["common"];
  onRecorded: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await recordPaymentAction({
        dueId,
        amount: remaining,
        // 렌더가 아니라 클릭 시점에 계산한다(SSR/hydration 불일치 방지). 기준은 저장·표시와 같은 UTC.
        paidAt: new Date().toISOString().slice(0, 10),
        memo: "",
      });

      if (!result.success) {
        toast.error(result.formError ?? commonLabels.retry);
        return;
      }

      toast.success(labels.recordPayment.successToast);
      onRecorded();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
      {labels.markPaidButton}
    </Button>
  );
}

/**
 * 회비 대시보드 (Task 022에서 실데이터 연동, Task 023에서 납부 기록 연결, Task 024에서 집계·필터 강화).
 *
 * 목록은 로컬 state로 들지 않고 서버가 내려준 값을 그대로 그린다(멤버 목록·초대 관리자와 같은 규약).
 * 항목을 만들거나 납부를 기록하면 Server Action의 `revalidatePath` + `router.refresh()`로 다시
 * 받아온다. 특히 납부는 **한 번의 기록이 청구 상태·전체 납부율·미납자 목록을 동시에 바꾸므로**
 * 로컬 state로 흉내 내면 서버 계산(트리거)과 어긋나기 쉽다.
 *
 * 납부 상태는 `woodong_dues.status`를 그대로 표시한다. 이 값은 애플리케이션이 쓰는 게 아니라
 * DB 트리거가 납부 이력 합계로 다시 계산해 주는 결과값이다. 집계 역시 화면에서 직접 계산하지 않고
 * `summarizeDueCycle()`(모임 홈 요약 카드와 공유)에 맡겨 두 화면의 납부율이 어긋나지 않게 한다.
 */
export function DuesDashboard({
  groupId,
  defaultDueAmount,
  cycles,
  duesByCycle,
  paymentsByDue,
  paidAmounts,
  members,
  isAdmin,
  labels,
  commonLabels,
  unnamedMemberLabel,
}: {
  groupId: string;
  /** 모임 설정의 기본 회비 금액. 새 항목 생성 폼의 초기값으로만 쓴다. */
  defaultDueAmount: number | null;
  cycles: DueCycle[];
  duesByCycle: Record<string, Due[]>;
  paymentsByDue: Record<string, Payment[]>;
  paidAmounts: Record<string, number>;
  members: GroupMemberRow[];
  isAdmin: boolean;
  labels: Dictionary["dues"];
  commonLabels: Dictionary["common"];
  unnamedMemberLabel: string;
}) {
  const router = useRouter();
  const [requestedCycleId, setRequestedCycleId] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const memberByUserId = useMemo(() => {
    const map = new Map<string, GroupMemberRow>();
    for (const member of members) map.set(member.userId, member);
    return map;
  }, [members]);

  // 방금 만든 항목은 `router.refresh()`가 끝나기 전까지 `cycles`에 없다. 목록에 없는 id를
  // 그대로 쓰면 빈 탭이 되므로, 실제로 존재하는 항목일 때만 선택값으로 인정한다.
  const selectedCycleId = cycles.some((c) => c.id === requestedCycleId)
    ? requestedCycleId
    : (cycles[0]?.id ?? "");

  /** 다른 회비 항목으로 옮기면 필터는 푼다 — 새 항목에서 빈 목록만 보이는 상황을 만들지 않는다. */
  function handleCycleChange(cycleId: string) {
    setRequestedCycleId(cycleId);
    setStatusFilter("all");
  }

  function handleCycleCreated(cycleId: string) {
    handleCycleChange(cycleId);
    router.refresh();
  }

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);
  const selectedDues = duesByCycle[selectedCycleId] ?? [];

  const entries = selectedDues
    .map((due) => {
      const member = memberByUserId.get(due.user_id);
      const paidAmount = paidAmounts[due.id] ?? 0;
      return {
        due,
        paidAmount,
        remaining: dueRemainingAmount(due.amount, paidAmount),
        name: member
          ? memberDisplayName(member, unnamedMemberLabel)
          : unnamedMemberLabel,
        avatarKey: member?.avatarKey ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));

  const summary = summarizeDueCycle(selectedDues, paidAmounts);
  const unpaidEntries = entries.filter((e) => e.due.status !== "paid");
  const visibleEntries =
    statusFilter === "all"
      ? entries
      : entries.filter((e) => e.due.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
        {/* 쓰기는 RLS가 막지만, 총무가 아닌 사람에게 반드시 실패할 버튼을 보여주지 않는다(이중 방어). */}
        {isAdmin && (
          <CreateDueCycleDialog
            groupId={groupId}
            defaultDueAmount={defaultDueAmount}
            labels={labels}
            onCreated={handleCycleCreated}
          />
        )}
      </div>

      {cycles.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WalletIcon />
            </EmptyMedia>
            <EmptyTitle>{labels.emptyState}</EmptyTitle>
            <EmptyDescription>{labels.incomeOnlyNotice}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Tabs value={selectedCycleId} onValueChange={handleCycleChange}>
          <TabsList className="min-h-11 w-full justify-start overflow-x-auto">
            {cycles.map((cycle) => (
              <TabsTrigger key={cycle.id} value={cycle.id} className="min-h-11">
                {cycle.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {cycles.map((cycle) => (
            <TabsContent
              key={cycle.id}
              value={cycle.id}
              className="flex flex-col gap-6"
            >
              {cycle.id === selectedCycleId && selectedCycle && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">
                          {labels.summaryLabel}
                        </CardTitle>
                        <Badge variant="outline">
                          {selectedCycle.due_type === "regular"
                            ? labels.type.regular
                            : labels.type.extra}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="shrink-0">
                          <DuesOverallRateGauge rate={summary.paidRate} />
                          <p className="mt-1 text-center text-xs text-muted-foreground">
                            {labels.headcountRateLabel}
                          </p>
                        </div>
                        <div className="flex w-full flex-col gap-3 text-sm">
                          <span className="text-muted-foreground">
                            {formatWon(selectedCycle.amount)} ·{" "}
                            {selectedCycle.due_date}
                          </span>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-muted-foreground">
                                {labels.amountRateLabel}
                              </span>
                              <span className="font-semibold">
                                {summary.collectedRate}%
                              </span>
                            </div>
                            {/* 진행률 바는 "수입만 집계"라는 원칙에 맞춰 수납액/청구액만 쓴다(잔액 개념 없음). */}
                            <DuesMemberProgressBar
                              dueAmount={summary.chargedAmount}
                              paidAmount={summary.collectedAmount}
                              status={
                                summary.collectedRate >= 100
                                  ? "paid"
                                  : summary.collectedRate > 0
                                    ? "partial"
                                    : "unpaid"
                              }
                              label={labels.amountRateLabel}
                            />
                            <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                              <span>
                                {labels.collectedAmountLabel}{" "}
                                <span className="font-semibold text-foreground">
                                  {formatWon(summary.collectedAmount)}
                                </span>
                              </span>
                              <span>
                                {labels.chargedAmountLabel}{" "}
                                {formatWon(summary.chargedAmount)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {summary.countByStatus.paid}/{summary.totalCount}
                            {labels.paidCountSuffix}
                          </span>
                        </div>
                      </div>

                      <DuesStatusBreakdownChart
                        countByStatus={summary.countByStatus}
                        labels={labels.status}
                      />
                    </CardContent>
                  </Card>

                  {unpaidEntries.length > 0 && (
                    <Card className="border-dashed">
                      <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <AlertTriangleIcon className="size-4 text-destructive" />
                            {labels.unpaidHighlightTitle} (
                            {unpaidEntries.length})
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatusFilter("unpaid")}
                          >
                            {labels.showUnpaidOnlyButton}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {unpaidEntries.map(({ due, name, remaining }) => (
                          <Badge
                            key={due.id}
                            variant="outline"
                            className="gap-1.5"
                          >
                            <span className="max-w-[10rem] truncate">
                              {name}
                            </span>
                            <span className="text-muted-foreground">
                              {formatWon(remaining)}
                            </span>
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <div className="flex flex-col gap-3">
                        <CardTitle className="text-base">
                          {labels.memberProgressTitle}
                        </CardTitle>
                        <ToggleGroup
                          type="single"
                          variant="outline"
                          value={statusFilter}
                          // Radix는 선택된 항목을 다시 누르면 빈 문자열을 준다. 그때는 "전체"로 되돌린다.
                          onValueChange={(value) =>
                            setStatusFilter((value as StatusFilter) || "all")
                          }
                          aria-label={labels.statusFilterLabel}
                          className="w-full flex-wrap justify-start"
                        >
                          {STATUS_FILTERS.map((filter) => (
                            <ToggleGroupItem
                              key={filter}
                              value={filter}
                              className="min-h-11 px-3"
                            >
                              {filter === "all"
                                ? labels.filterAllLabel
                                : labels.status[filter]}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      {visibleEntries.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {labels.filterEmptyState}
                        </p>
                      ) : (
                        visibleEntries.map(
                          ({ due, paidAmount, remaining, name, avatarKey }) => (
                            <div key={due.id} className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                <Avatar size="sm">
                                  <AvatarFallback>
                                    {memberAvatarEmoji(avatarKey)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                  {name}
                                </span>
                                <Badge
                                  variant={STATUS_BADGE_VARIANT[due.status]}
                                >
                                  {labels.status[due.status]}
                                </Badge>
                              </div>
                              <DuesMemberProgressBar
                                dueAmount={due.amount}
                                paidAmount={paidAmount}
                                status={due.status}
                                label={`${name} ${labels.summaryLabel}`}
                              />
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatWon(paidAmount)} /{" "}
                                  {formatWon(due.amount)}
                                </span>
                                <div className="flex shrink-0 items-center gap-1">
                                  {isAdmin && due.status !== "paid" && (
                                    <MarkPaidButton
                                      dueId={due.id}
                                      remaining={remaining}
                                      labels={labels}
                                      commonLabels={commonLabels}
                                      onRecorded={() => router.refresh()}
                                    />
                                  )}
                                  <PaymentManagerDialog
                                    dueId={due.id}
                                    dueAmount={due.amount}
                                    paidAmount={paidAmount}
                                    payments={paymentsByDue[due.id] ?? []}
                                    memberName={name}
                                    isAdmin={isAdmin}
                                    labels={labels.recordPayment}
                                    commonLabels={commonLabels}
                                  />
                                </div>
                              </div>
                            </div>
                          ),
                        )
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <Card className="border-dashed">
        <CardContent className="py-4 text-sm text-muted-foreground">
          {labels.incomeOnlyNotice}
        </CardContent>
      </Card>
    </div>
  );
}
