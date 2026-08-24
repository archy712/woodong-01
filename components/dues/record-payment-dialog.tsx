"use client";

import { useState } from "react";
import { Loader2Icon, ReceiptTextIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  recordPaymentSchema,
  type DuesStatus,
  type RecordPaymentInput,
} from "@/lib/woodong/dues";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const demoRecordPaymentAction = createDemoAction<RecordPaymentInput>();

/**
 * 실제 시스템은 `woodong_payments` 이력을 쌓으면 DB 트리거가 합계와 청구 금액을 비교해
 * `woodong_dues.status`를 자동 갱신한다(Task 003/023). 이 더미 다이얼로그도 같은 규칙을
 * 클라이언트에서 흉내 낸다: 이번에 입력한 금액을 기존 누계에 더해서 새 상태를 계산한다.
 */
function deriveStatus(totalPaid: number, dueAmount: number): DuesStatus {
  if (totalPaid <= 0) return "unpaid";
  if (totalPaid >= dueAmount) return "paid";
  return "partial";
}

export function RecordPaymentDialog({
  dueId,
  dueAmount,
  currentPaidAmount,
  memberName,
  labels,
  onRecorded,
}: {
  dueId: string;
  dueAmount: number;
  currentPaidAmount: number;
  memberName: string;
  labels: Dictionary["dues"]["recordPayment"];
  onRecorded: (dueId: string, totalPaidAmount: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const remaining = Math.max(dueAmount - currentPaidAmount, 0);

  const defaultValues: RecordPaymentInput = {
    dueId,
    amount: remaining,
    paidAt: new Date().toISOString().slice(0, 10),
    memo: "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: recordPaymentSchema,
    defaultValues,
    action: demoRecordPaymentAction,
    successMessage: labels.successToast,
    onSuccess: (input) => {
      const total = currentPaidAmount + input.amount;
      onRecorded(dueId, Math.min(total, dueAmount));
      setOpen(false);
      form.reset({ ...defaultValues, amount: 0 });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={labels.title}
        >
          <ReceiptTextIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {labels.title} — {memberName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.amountLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1000}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.paidAtLabel}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.memoLabel}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {labels.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { deriveStatus };
