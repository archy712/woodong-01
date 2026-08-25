"use client";

import { useState } from "react";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDueCycleAction } from "@/lib/woodong/actions/dues";
import {
  createDueCycleSchema,
  type CreateDueCycleInput,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 회비 항목 생성 다이얼로그 (Task 022).
 *
 * 생성 성공 시 활성 멤버 전원에게 `unpaid` 청구가 함께 만들어지므로(팬아웃), 화면 갱신은
 * 새 항목 하나를 로컬 state에 끼워 넣는 방식이 아니라 서버 재조회로 처리한다
 * (`onCreated`가 받은 id로 탭만 선택하고 나머지는 부모가 `router.refresh()`로 다시 받아온다).
 */
export function CreateDueCycleDialog({
  groupId,
  labels,
  onCreated,
}: {
  groupId: string;
  labels: Dictionary["dues"];
  onCreated: (cycleId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const defaultValues: CreateDueCycleInput = {
    groupId,
    title: "",
    period: "",
    amount: 0,
    dueType: "regular",
    dueDate: "",
    reminderIntervalDays: 7,
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createDueCycleSchema,
    defaultValues,
    action: createDueCycleAction,
    successMessage: labels.create.successToast,
    onSuccess: ({ cycle }) => {
      onCreated(cycle.id);
      setOpen(false);
      form.reset(defaultValues);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <PlusIcon />
          {labels.create.createTriggerButton}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.create.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.create.titleLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.periodLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="2026-09" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.amountLabel}</FormLabel>
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.dueDateLabel}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.create.dueTypeLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">
                          {labels.type.regular}
                        </SelectItem>
                        <SelectItem value="extra">
                          {labels.type.extra}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="reminderIntervalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.create.reminderIntervalLabel}</FormLabel>
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
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {labels.create.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
