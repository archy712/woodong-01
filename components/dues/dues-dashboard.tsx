"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, WalletIcon } from "lucide-react";

import type { Due, DueCycle, DuesStatus } from "@/lib/woodong/dues";
import {
  memberAvatarEmoji,
  memberDisplayName,
} from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
import { CreateDueCycleDialog } from "@/components/dues/create-due-cycle-dialog";
import {
  DuesMemberRateChart,
  DuesOverallRateGauge,
} from "@/components/dues/dues-paid-rate-chart";
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
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STATUS_BADGE_VARIANT: Record<
  DuesStatus,
  "default" | "secondary" | "outline"
> = {
  paid: "default",
  partial: "secondary",
  unpaid: "outline",
};

/**
 * 회비 대시보드 (Task 022에서 실데이터 연동).
 *
 * 목록은 로컬 state로 들지 않고 서버가 내려준 값을 그대로 그린다(멤버 목록·초대 관리자와 같은 규약).
 * 항목을 만들면 Server Action의 `revalidatePath` + `router.refresh()`로 다시 받아오는데, 이렇게 해야
 * 팬아웃으로 함께 생성된 청구 N건이 화면에 정확히 반영된다(클라이언트에서 흉내 내면 "그 시점의 활성
 * 멤버"를 서버와 다르게 계산할 수 있다).
 *
 * 납부 상태는 `woodong_dues.status`(DB 트리거가 납부 이력 합계로 자동 갱신)를 그대로 표시한다.
 * 납부 기록 UI는 Task 023에서 실제 Server Action과 함께 붙인다 — 실데이터 화면에 저장되지 않는
 * 더미 버튼을 남겨 두면 "납부 처리했는데 새로고침하면 사라지는" 오해를 만든다.
 */
export function DuesDashboard({
  groupId,
  cycles,
  duesByCycle,
  paidAmounts,
  members,
  isAdmin,
  labels,
  unnamedMemberLabel,
}: {
  groupId: string;
  cycles: DueCycle[];
  duesByCycle: Record<string, Due[]>;
  paidAmounts: Record<string, number>;
  members: GroupMemberRow[];
  isAdmin: boolean;
  labels: Dictionary["dues"];
  unnamedMemberLabel: string;
}) {
  const router = useRouter();
  const [requestedCycleId, setRequestedCycleId] = useState("");

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

  function handleCycleCreated(cycleId: string) {
    setRequestedCycleId(cycleId);
    router.refresh();
  }

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);
  const selectedDues = duesByCycle[selectedCycleId] ?? [];

  const entries = selectedDues
    .map((due) => {
      const member = memberByUserId.get(due.user_id);
      return {
        due,
        paidAmount: paidAmounts[due.id] ?? 0,
        name: member
          ? memberDisplayName(member, unnamedMemberLabel)
          : unnamedMemberLabel,
        avatarKey: member?.avatarKey ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));

  const paidCount = entries.filter((e) => e.due.status === "paid").length;
  const overallRate =
    entries.length > 0 ? Math.round((paidCount / entries.length) * 100) : 0;
  const unpaidEntries = entries.filter((e) => e.due.status !== "paid");

  const memberRateChartData = entries.map(({ due, paidAmount, name }) => ({
    id: due.id,
    name,
    percent: due.amount > 0 ? Math.round((paidAmount / due.amount) * 100) : 0,
    status: due.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
        {/* 쓰기는 RLS가 막지만, 총무가 아닌 사람에게 반드시 실패할 버튼을 보여주지 않는다(이중 방어). */}
        {isAdmin && (
          <CreateDueCycleDialog
            groupId={groupId}
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
        <Tabs value={selectedCycleId} onValueChange={setRequestedCycleId}>
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
                    <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                      <div className="flex w-full flex-col gap-1 text-sm">
                        <span>
                          {selectedCycle.amount.toLocaleString("ko-KR")}원 ·{" "}
                          {selectedCycle.due_date}
                        </span>
                        <span className="font-semibold text-foreground">
                          {overallRate}%{" "}
                          <span className="font-normal text-muted-foreground">
                            ({paidCount}/{entries.length})
                          </span>
                        </span>
                      </div>
                      <DuesOverallRateGauge rate={overallRate} />
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
                        {unpaidEntries.map(({ due, name }) => (
                          <Badge key={due.id} variant="outline">
                            {name}
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
                    <CardContent className="flex flex-col gap-6">
                      <DuesMemberRateChart
                        members={memberRateChartData}
                        labels={labels.status}
                      />
                      {entries.map(({ due, name, avatarKey }) => (
                        <div key={due.id} className="flex items-center gap-3">
                          <Avatar size="sm">
                            <AvatarFallback>
                              {memberAvatarEmoji(avatarKey)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-sm">
                            <span className="truncate font-medium">{name}</span>
                            <Badge variant={STATUS_BADGE_VARIANT[due.status]}>
                              {labels.status[due.status]}
                            </Badge>
                          </div>
                        </div>
                      ))}
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
