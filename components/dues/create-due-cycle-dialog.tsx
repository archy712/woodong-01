"use client";

import { useState } from "react";
import { Loader2Icon, PlusIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  createDueCycleSchema,
  type CreateDueCycleInput,
  type DueCycle,
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

const demoCreateDueCycleAction = createDemoAction<
  CreateDueCycleInput,
  DueCycle
>((input) => ({
  id: crypto.randomUUID(),
  group_id: input.groupId,
  title: input.title,
  period: input.period,
  amount: input.amount,
  due_type: input.dueType,
  due_date: input.dueDate,
  reminder_interval_days: input.reminderIntervalDays ?? null,
  created_by: null,
  created_at: new Date().toISOString(),
}));

export function CreateDueCycleDialog({
  groupId,
  labels,
  onCreated,
}: {
  groupId: string;
  labels: Dictionary["dues"];
  onCreated: (cycle: DueCycle) => void;
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
    action: demoCreateDueCycleAction,
    successMessage: labels.create.successToast,
    onSuccess: (cycle) => {
      onCreated(cycle);
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
                        min={0}
                        step={1000}
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
                        <SelectTrigger className="w-full">
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
                      min={1}
                      max={90}
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
