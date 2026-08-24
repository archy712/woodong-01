"use client";

import { useMemo, useState } from "react";
import { AlertTriangleIcon, WalletIcon } from "lucide-react";
import { toast } from "sonner";

import { AVATAR_EMOJI } from "@/lib/woodong/avatars";
import type { DummyGroupMember } from "@/lib/woodong/dummy/groups";
import type { Due, DueCycle, DuesStatus } from "@/lib/woodong/dues";
import { CreateDueCycleDialog } from "@/components/dues/create-due-cycle-dialog";
import {
  RecordPaymentDialog,
  deriveStatus,
} from "@/components/dues/record-payment-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STATUS_BADGE_VARIANT: Record<
  DuesStatus,
  "default" | "secondary" | "outline"
> = {
  paid: "default",
  partial: "secondary",
  unpaid: "outline",
};

export function DuesDashboard({
  groupId,
  initialCycles,
  initialDuesByCycle,
  initialPaidAmounts,
  members,
  labels,
  commonLabels,
}: {
  groupId: string;
  initialCycles: DueCycle[];
  initialDuesByCycle: Record<string, Due[]>;
  initialPaidAmounts: Record<string, number>;
  members: DummyGroupMember[];
  labels: Dictionary["dues"];
  commonLabels: Dictionary["common"];
}) {
  const [cycles, setCycles] = useState(initialCycles);
  const [duesByCycle, setDuesByCycle] = useState(initialDuesByCycle);
  const [paidAmounts, setPaidAmounts] = useState(initialPaidAmounts);
  const [selectedCycleId, setSelectedCycleId] = useState(
    initialCycles[0]?.id ?? "",
  );

  const memberByUserId = useMemo(() => {
    const map = new Map<string, DummyGroupMember>();
    for (const m of members) map.set(m.user_id, m);
    return map;
  }, [members]);

  function handleCycleCreated(cycle: DueCycle) {
    setCycles((prev) => [cycle, ...prev]);
    const newDues: Due[] = members.map((m) => ({
      id: crypto.randomUUID(),
      due_cycle_id: cycle.id,
      group_id: groupId,
      user_id: m.user_id,
      amount: cycle.amount,
      status: "unpaid",
      last_reminded_at: null,
    }));
    setDuesByCycle((prev) => ({ ...prev, [cycle.id]: newDues }));
    setPaidAmounts((prev) => {
      const next = { ...prev };
      for (const d of newDues) next[d.id] = 0;
      return next;
    });
    setSelectedCycleId(cycle.id);
  }

  function handleRecorded(dueId: string, totalPaidAmount: number) {
    setPaidAmounts((prev) => ({ ...prev, [dueId]: totalPaidAmount }));
  }

  function handleMarkPaid(due: Due) {
    setPaidAmounts((prev) => ({ ...prev, [due.id]: due.amount }));
    toast.success(labels.recordPayment.successToast);
  }

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);
  const selectedDues = duesByCycle[selectedCycleId] ?? [];

  const withStatus = selectedDues.map((due) => ({
    due,
    paidAmount: paidAmounts[due.id] ?? 0,
    status: deriveStatus(paidAmounts[due.id] ?? 0, due.amount),
  }));
  const paidCount = withStatus.filter((d) => d.status === "paid").length;
  const overallRate =
    withStatus.length > 0
      ? Math.round((paidCount / withStatus.length) * 100)
      : 0;
  const unpaidEntries = withStatus.filter((d) => d.status !== "paid");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
        <CreateDueCycleDialog
          groupId={groupId}
          labels={labels}
          onCreated={handleCycleCreated}
        />
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
        <Tabs value={selectedCycleId} onValueChange={setSelectedCycleId}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {cycles.map((cycle) => (
              <TabsTrigger key={cycle.id} value={cycle.id}>
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
                    <CardContent className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {selectedCycle.amount.toLocaleString("ko-KR")}원 ·{" "}
                          {selectedCycle.due_date}
                        </span>
                        <span className="font-semibold">{overallRate}%</span>
                      </div>
                      <Progress value={overallRate} />
                    </CardContent>
                  </Card>

                  {unpaidEntries.length > 0 && (
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <AlertTriangleIcon className="size-4 text-destructive" />
                          {labels.unpaidHighlightTitle} ({unpaidEntries.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {unpaidEntries.map(({ due }) => (
                          <Badge key={due.id} variant="outline">
                            {memberByUserId.get(due.user_id)?.profile.name ??
                              due.user_id}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {labels.memberProgressTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {withStatus.map(({ due, paidAmount, status }) => {
                        const member = memberByUserId.get(due.user_id);
                        const percent = Math.round(
                          (paidAmount / due.amount) * 100,
                        );
                        return (
                          <div key={due.id} className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>
                                {member
                                  ? AVATAR_EMOJI[member.profile.avatarKey]
                                  : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <div className="flex items-center justify-between gap-2 text-sm">
                                <span className="truncate font-medium">
                                  {member?.profile.name ?? due.user_id}
                                </span>
                                <Badge variant={STATUS_BADGE_VARIANT[status]}>
                                  {labels.status[status]}
                                </Badge>
                              </div>
                              <Progress value={percent} className="h-1.5" />
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              {status !== "paid" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkPaid(due)}
                                >
                                  {labels.markPaidButton}
                                </Button>
                              )}
                              <RecordPaymentDialog
                                dueId={due.id}
                                dueAmount={due.amount}
                                currentPaidAmount={paidAmount}
                                memberName={member?.profile.name ?? due.user_id}
                                labels={labels.recordPayment}
                                onRecorded={handleRecorded}
                              />
                            </div>
                          </div>
                        );
                      })}
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
      <p className="sr-only">{commonLabels.demoModeNotice}</p>
    </div>
  );
}
