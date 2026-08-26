"use client";

import { useRef, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createClient } from "@/lib/supabase/client";
import {
  buildGroupObjectPath,
  WOODONG_RECEIPTS_BUCKET,
} from "@/lib/supabase/storage";
import { resizeImageFile, validateImageFile } from "@/lib/storage/image";
import {
  createExpenseAction,
  updateExpenseAction,
} from "@/lib/woodong/actions/expenses";
import {
  createExpenseSchema,
  EXPENSE_CATEGORIES,
  type CreateExpenseInput,
  type ExpenseRow,
} from "@/lib/woodong/expenses";
import { memberDisplayName } from "@/lib/woodong/member-display";
import type { GroupMemberRow } from "@/lib/woodong/queries/groups";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** `<input type="date">` 초기값용 오늘 날짜(로컬 기준 `YYYY-MM-DD`). */
function todayDateOnly(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

/**
 * 지출 등록·수정 다이얼로그 (Task 035, PRD 3.4-b).
 *
 * 등록과 수정이 한 컴포넌트인 이유: 입력 항목이 완전히 같고, 영수증 업로드라는 까다로운
 * 부분을 두 벌로 두면 한쪽만 고치는 사고가 난다. `expense`가 있으면 수정, 없으면 등록이다.
 *
 * 영수증은 Server Action에 실어 보내지 않고 **브라우저가 Storage에 직접 올린 뒤 경로만**
 * 넘긴다(모임 대표 이미지와 동일). Storage RLS가 경로 첫 세그먼트를 모임 id로 보고 총무만
 * 쓰도록 막고 있어 업로드 자체가 안전하고, 5MB 이미지를 Server Action 본문에 넣지 않아도 된다.
 */
export function ExpenseFormDialog({
  groupId,
  expense,
  members,
  labels,
  commonLabels,
  unnamedMemberLabel,
  onSaved,
}: {
  groupId: string;
  /** 수정 대상. 없으면 등록 모드. */
  expense?: ExpenseRow;
  members: GroupMemberRow[];
  labels: Dictionary["expenses"];
  commonLabels: Dictionary["common"];
  unnamedMemberLabel: string;
  onSaved: () => void;
}) {
  const isEdit = Boolean(expense);
  const [open, setOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  // 기존 영수증을 떼어 내겠다는 의사. 새 파일을 고르는 것과 구분해야 한다.
  const [removeReceipt, setRemoveReceipt] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues: DefaultValues<CreateExpenseInput> = {
    groupId,
    category: expense?.category,
    // 빈 칸으로 시작시킨다. `0`을 넣으면 총무가 매번 지우고 입력해야 하는데, 0은 어차피
    // zod `min(1)`에 걸리는 값이라 의미가 없다(회비 항목 생성 폼과 같은 처리).
    amount: expense?.amount ?? undefined,
    spentAt: expense?.spent_at ?? todayDateOnly(),
    paidBy: expense?.paid_by ?? undefined,
    memo: expense?.memo ?? "",
    receiptObjectPath: expense?.receipt_object_path ?? "",
  };

  function resetLocalState() {
    setReceiptFile(null);
    setRemoveReceipt(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createExpenseSchema,
    defaultValues,
    action: async (values) => {
      let receiptObjectPath = values.receiptObjectPath ?? "";

      if (removeReceipt) {
        receiptObjectPath = "";
      } else if (receiptFile) {
        const uploaded = await uploadReceipt(receiptFile);
        if (!uploaded.ok) {
          return { success: false as const, formError: uploaded.error };
        }
        receiptObjectPath = uploaded.path;
      }

      const payload = { ...values, receiptObjectPath };
      return expense
        ? updateExpenseAction({ ...payload, expenseId: expense.id })
        : createExpenseAction(payload);
    },
    successMessage: isEdit
      ? labels.form.updateSuccessToast
      : labels.form.createSuccessToast,
    onSuccess: () => {
      setOpen(false);
      resetLocalState();
      form.reset(defaultValues);
      onSaved();
    },
  });

  async function uploadReceipt(
    file: File,
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
    setIsUploading(true);
    try {
      const resized = await resizeImageFile(file);
      const path = buildGroupObjectPath(groupId, resized.name);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(WOODONG_RECEIPTS_BUCKET)
        .upload(path, resized, { contentType: resized.type });

      if (error) {
        console.error("[ExpenseFormDialog] receipt upload failed:", error);
        return { ok: false, error: labels.form.receiptUploadError };
      }
      return { ok: true, path };
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // 5MB/형식 제한은 업로드를 시도하기 전에 브라우저에서 먼저 막는다(Task 004).
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      event.target.value = "";
      return;
    }
    setReceiptFile(file);
    setRemoveReceipt(false);
  }

  /** 다이얼로그를 닫을 때 고르다 만 파일이 남지 않게 한다. */
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetLocalState();
      form.reset(defaultValues);
    }
  }

  const hasExistingReceipt = Boolean(expense?.receipt_object_path);
  const busy = isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button type="button" variant="ghost" size="sm" className="min-h-11">
            {labels.editButton}
          </Button>
        ) : (
          <Button type="button" size="sm">
            <PlusIcon />
            {labels.addButton}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? labels.form.editTitle : labels.form.createTitle}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.form.categoryLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue
                            placeholder={labels.form.categoryPlaceholder}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {labels.category[category]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.form.amountLabel}</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="spentAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.form.spentAtLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.form.paidByLabel}</FormLabel>
                    <Select
                      // Radix Select는 빈 문자열을 항목 값으로 허용하지 않아 "선택 안 함"에
                      // 센티넬을 쓴다. zod 쪽은 빈 값을 undefined로 정규화한다.
                      onValueChange={(value) =>
                        field.onChange(value === "__none__" ? undefined : value)
                      }
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">
                          {labels.form.paidByNone}
                        </SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {memberDisplayName(member, unnamedMemberLabel)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>{labels.form.memoLabel}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="expense-receipt">
                {labels.form.receiptLabel}
              </Label>
              <Input
                id="expense-receipt"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                {labels.form.receiptHint}
              </p>
              {hasExistingReceipt && !receiptFile && !removeReceipt && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-11 self-start"
                  onClick={() => setRemoveReceipt(true)}
                >
                  {labels.form.receiptRemoveButton}
                </Button>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={busy}>
                {busy && <Loader2Icon className="animate-spin" />}
                {busy ? labels.form.submittingLabel : labels.form.submitButton}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={busy}
              >
                {commonLabels.cancel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
