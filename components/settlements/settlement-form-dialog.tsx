"use client";

import { useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { Loader2Icon, PlusIcon, RefreshCwIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import {
  createSettlementAction,
  recalculateSettlementAction,
} from "@/lib/woodong/actions/settlements";
import {
  createSettlementSchema,
  recalculateSettlementSchema,
  type CreateSettlementInput,
  type RecalculateSettlementInput,
  type Settlement,
} from "@/lib/woodong/settlements";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 이번 달 1일 ~ 말일. 총무가 가장 자주 만드는 기간이라 폼을 그 값으로 열어 둔다.
 *
 * 말일은 "다음 달 0일"로 구한다 — 28/29/30/31과 윤년을 직접 따지지 않는다.
 * 기준은 사용자의 로컬 달력이다. 정산 기간은 총무가 눈으로 고르는 값이고, 이 프리필은
 * 그 사람이 지금 보고 있는 달을 뜻해야 한다.
 */
function currentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const toDateOnly = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  return {
    start: toDateOnly(new Date(now.getFullYear(), now.getMonth(), 1)),
    end: toDateOnly(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

/**
 * 정산 초안 생성 다이얼로그 (Task 036).
 *
 * 이 폼이 만드는 것은 **초안**이다. 발행(= 멤버 전원 알림)은 상세 화면에서 총무가 금액을
 * 확인한 뒤 따로 눌러야 한다. 두 동작을 한 버튼에 합치면 검토 단계를 둔 의미가 사라진다.
 */
export function CreateSettlementDialog({
  groupId,
  labels,
  onCreated,
}: {
  groupId: string;
  labels: Dictionary["settlements"];
  onCreated: (settlement: Settlement) => void;
}) {
  const [open, setOpen] = useState(false);
  const range = currentMonthRange();

  const defaultValues: DefaultValues<CreateSettlementInput> = {
    groupId,
    periodStart: range.start,
    periodEnd: range.end,
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createSettlementSchema,
    defaultValues,
    action: createSettlementAction,
    successMessage: labels.create.successToast,
    onSuccess: (settlement) => {
      setOpen(false);
      form.reset(defaultValues);
      onCreated(settlement);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <PlusIcon />
          {labels.create.triggerButton}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.create.title}</DialogTitle>
          <DialogDescription>{labels.create.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.periodStartLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periodEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.periodEndLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {isPending
                  ? labels.create.submittingLabel
                  : labels.create.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 초안 기간 수정 + 재계산 다이얼로그.
 *
 * 발행된 리포트에는 호출부에서 이 버튼을 띄우지 않는다. 눌러 봐야 DB 트리거
 * (`woodong_settlements_prevent_published_change`)가 막을 뿐이고, 반드시 실패할 버튼은
 * 보여주지 않는 것이 이 저장소의 규약이다.
 */
export function RecalculateSettlementDialog({
  groupId,
  settlement,
  labels,
  onRecalculated,
}: {
  groupId: string;
  settlement: Settlement;
  labels: Dictionary["settlements"];
  onRecalculated: () => void;
}) {
  const [open, setOpen] = useState(false);

  const defaultValues: DefaultValues<RecalculateSettlementInput> = {
    groupId,
    settlementId: settlement.id,
    periodStart: settlement.period_start,
    periodEnd: settlement.period_end,
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: recalculateSettlementSchema,
    defaultValues,
    action: recalculateSettlementAction,
    successMessage: labels.recalculate.successToast,
    onSuccess: () => {
      setOpen(false);
      onRecalculated();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <RefreshCwIcon />
          {labels.recalculate.triggerButton}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.recalculate.title}</DialogTitle>
          <DialogDescription>
            {labels.recalculate.description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.periodStartLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periodEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.periodEndLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
                {isPending
                  ? labels.recalculate.submittingLabel
                  : labels.recalculate.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
