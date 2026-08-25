"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2Icon,
  PencilIcon,
  ReceiptTextIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import {
  deletePaymentAction,
  recordPaymentAction,
  updatePaymentAction,
} from "@/lib/woodong/actions/dues";
import {
  isoToDateOnly,
  recordPaymentSchema,
  updatePaymentSchema,
  type Payment,
  type RecordPaymentInput,
  type UpdatePaymentInput,
} from "@/lib/woodong/dues";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type PaymentLabels = Dictionary["dues"]["recordPayment"];
type CommonLabels = Dictionary["common"];

function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 오늘 날짜(`YYYY-MM-DD`).
 *
 * ⚠️ 렌더 중에 호출하면 안 된다. Client Component도 SSR되므로 서버와 클라이언트가 서로 다른 날짜를
 * 계산해 hydration 불일치가 난다(Task 020의 초대 만료 기본값과 같은 이유). 다이얼로그를 **열 때**나
 * 버튼을 **누를 때**만 부른다. 저장·표시 기준이 UTC(`dateOnlyToIso`)이므로 여기서도 UTC로 맞춘다.
 */
function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 납부 이력 한 줄의 수정 폼(다이얼로그 안에서 인라인 전환). */
function EditPaymentForm({
  payment,
  labels,
  commonLabels,
  onDone,
}: {
  payment: Payment;
  labels: PaymentLabels;
  commonLabels: CommonLabels;
  onDone: () => void;
}) {
  const defaultValues: UpdatePaymentInput = {
    paymentId: payment.id,
    amount: payment.amount,
    paidAt: isoToDateOnly(payment.paid_at),
    memo: payment.memo ?? "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: updatePaymentSchema,
    defaultValues,
    action: updatePaymentAction,
    successMessage: labels.updateSuccessToast,
    onSuccess: onDone,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>
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
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            {commonLabels.cancel}
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {commonLabels.save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function DeletePaymentButton({
  paymentId,
  labels,
  commonLabels,
  onDeleted,
}: {
  paymentId: string;
  labels: PaymentLabels;
  commonLabels: CommonLabels;
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePaymentAction({ paymentId });

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
          aria-label={commonLabels.delete}
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

/** 새 납부 이력 기록 폼. 기본 금액은 남은 금액이라 "완납 처리"가 한 번에 끝난다. */
function AddPaymentForm({
  dueId,
  remaining,
  labels,
  onRecorded,
}: {
  dueId: string;
  remaining: number;
  labels: PaymentLabels;
  onRecorded: () => void;
}) {
  // 이 폼은 다이얼로그가 열린 뒤에만 마운트되므로(= 클라이언트 전용) 렌더 중 `new Date()`를 써도
  // hydration 불일치가 없다. 그래도 열 때마다 오늘 날짜가 다시 계산되도록 초기값으로만 쓴다.
  const defaultValues: RecordPaymentInput = {
    dueId,
    amount: remaining > 0 ? remaining : 0,
    paidAt: todayDateOnly(),
    memo: "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: recordPaymentSchema,
    defaultValues,
    action: recordPaymentAction,
    successMessage: labels.successToast,
    onSuccess: () => {
      form.reset({ ...defaultValues, paidAt: todayDateOnly() });
      onRecorded();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>
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
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {labels.submitButton}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/**
 * 멤버 한 명의 납부 이력 관리 (Task 023).
 *
 * 한 청구(`woodong_dues`)에 여러 번의 납부(`woodong_payments`)가 쌓일 수 있어서(부분 납부),
 * "상태 토글" 대신 **이력 목록 + 추가/수정/삭제**로 구성했다. 상태(`unpaid`/`partial`/`paid`)는
 * 애플리케이션이 쓰는 값이 아니라 DB 트리거가 이력 합계로 다시 계산해 주는 결과값이다.
 *
 * 일반회원에게도 열리지만 **읽기 전용**이다(자기 회비를 얼마나 냈는지 확인할 수 있어야 한다).
 * 쓰기는 RLS가 막지만, 반드시 실패할 폼과 버튼을 보여주지 않는 것이 이 코드베이스의 규약이다.
 */
export function PaymentManagerDialog({
  dueId,
  dueAmount,
  paidAmount,
  payments,
  memberName,
  isAdmin,
  labels,
  commonLabels,
}: {
  dueId: string;
  dueAmount: number;
  paidAmount: number;
  payments: Payment[];
  memberName: string;
  isAdmin: boolean;
  labels: PaymentLabels;
  commonLabels: CommonLabels;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const remaining = Math.max(dueAmount - paidAmount, 0);

  function handleMutated() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setEditingId(null);
        setOpen(next);
      }}
    >
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
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {labels.title} — {memberName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">
              {labels.totalPaidLabel}:{" "}
              <span className="font-medium text-foreground">
                {formatWon(paidAmount)}
              </span>{" "}
              / {formatWon(dueAmount)}
            </span>
            <span className="text-muted-foreground">
              {labels.remainingLabel}:{" "}
              <span className="font-medium text-foreground">
                {formatWon(remaining)}
              </span>
            </span>
          </div>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{labels.historyTitle}</h3>
            {payments.length > 0 ? (
              <ItemGroup className="gap-2">
                {payments.map((payment) =>
                  editingId === payment.id ? (
                    <Item key={payment.id} variant="outline" size="sm">
                      <ItemContent>
                        <EditPaymentForm
                          payment={payment}
                          labels={labels}
                          commonLabels={commonLabels}
                          onDone={handleMutated}
                        />
                      </ItemContent>
                    </Item>
                  ) : (
                    <Item key={payment.id} variant="outline" size="sm">
                      <ItemContent>
                        <ItemTitle>{formatWon(payment.amount)}</ItemTitle>
                        <ItemDescription>
                          {isoToDateOnly(payment.paid_at)}
                          {payment.memo ? ` · ${payment.memo}` : ""}
                        </ItemDescription>
                      </ItemContent>
                      {isAdmin && (
                        <ItemActions>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={commonLabels.edit}
                            onClick={() => setEditingId(payment.id)}
                          >
                            <PencilIcon />
                          </Button>
                          <DeletePaymentButton
                            paymentId={payment.id}
                            labels={labels}
                            commonLabels={commonLabels}
                            onDeleted={handleMutated}
                          />
                        </ItemActions>
                      )}
                    </Item>
                  ),
                )}
              </ItemGroup>
            ) : (
              <p className="text-sm text-muted-foreground">
                {labels.historyEmpty}
              </p>
            )}
          </section>

          {isAdmin && (
            <section className="flex flex-col gap-3 border-t pt-4">
              <h3 className="text-sm font-semibold">{labels.addTitle}</h3>
              {/*
                `key`로 남은 금액이 바뀔 때마다 폼을 새로 마운트한다. 기본 금액은 마운트 시점의
                `remaining`으로 채워지는데, 기록 직후 `router.refresh()`로 잔액이 줄어도 폼은 옛 값을
                들고 있어서(예: 30,000원 청구에 10,000원을 넣은 뒤에도 기본값이 30,000원) 이어서
                저장하면 의도치 않은 초과 납부가 된다.
              */}
              <AddPaymentForm
                key={paidAmount}
                dueId={dueId}
                remaining={remaining}
                labels={labels}
                onRecorded={handleMutated}
              />
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
