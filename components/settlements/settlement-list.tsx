"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileTextIcon } from "lucide-react";

import { formatWon } from "@/lib/woodong/dues-summary";
import {
  formatSettlementPeriod,
  type Settlement,
} from "@/lib/woodong/settlements";
import { CreateSettlementDialog } from "@/components/settlements/settlement-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 정산 리포트 목록 (Task 036, PRD 6.3 "정산 리포트").
 *
 * 초안이 목록에 섞여 있는 것은 총무 화면에서만 벌어지는 일이다 —
 * `woodong_settlements_select_member` 정책이 일반회원에게는 발행분만 내려준다. 그래서 여기서
 * `status`로 다시 거르지 않고, 대신 상태 배지를 달아 총무가 무엇이 아직 초안인지 알게 한다.
 */
export function SettlementList({
  groupId,
  settlements,
  isAdmin,
  labels,
}: {
  groupId: string;
  settlements: Settlement[];
  isAdmin: boolean;
  labels: Dictionary["settlements"];
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{labels.pageTitle}</h1>
        {/* 쓰기는 RLS가 막지만, 반드시 실패할 버튼을 보여주지 않는다(이중 방어). */}
        {isAdmin && (
          <CreateSettlementDialog
            groupId={groupId}
            labels={labels}
            onCreated={(settlement) => {
              // 방금 만든 초안을 바로 검토할 수 있게 상세로 보낸다. 목록으로 되돌리면
              // 총무가 한 번 더 눌러야 하고, 초안의 존재 이유가 "확인"이다.
              router.push(
                `/protected/groups/${groupId}/dues/settlements/${settlement.id}`,
              );
            }}
          />
        )}
      </div>

      {isAdmin && (
        <p className="text-sm text-muted-foreground">
          {labels.draftVisibilityNotice}
        </p>
      )}

      {settlements.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>{labels.emptyState}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {settlements.map((settlement) => (
            <Link
              key={settlement.id}
              href={`/protected/groups/${groupId}/dues/settlements/${settlement.id}`}
            >
              <Card className="transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {formatSettlementPeriod(settlement)}
                    </CardTitle>
                    <Badge
                      variant={
                        settlement.status === "published"
                          ? "default"
                          : "outline"
                      }
                    >
                      {settlement.status === "published"
                        ? labels.statusPublished
                        : labels.statusDraft}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>
                    {labels.detail.totalIncomeLabel}{" "}
                    <span className="tabular-nums">
                      {formatWon(settlement.total_income)}
                    </span>
                  </span>
                  <span>
                    {labels.detail.totalExpenseLabel}{" "}
                    <span className="tabular-nums">
                      {formatWon(settlement.total_expense)}
                    </span>
                  </span>
                  <span
                    className={
                      settlement.balance < 0
                        ? "font-medium text-destructive"
                        : "font-medium text-foreground"
                    }
                  >
                    {labels.detail.balanceLabel}{" "}
                    <span className="tabular-nums">
                      {formatWon(settlement.balance)}
                    </span>
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isAdmin && (
        <p className="text-xs text-muted-foreground">
          {labels.adminOnlyNotice}
        </p>
      )}
    </div>
  );
}
