"use client";

import { useFieldArray } from "react-hook-form";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import { createVoteSchema, type CreateVoteInput } from "@/lib/woodong/votes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const demoCreateVoteAction = createDemoAction<CreateVoteInput>();

/**
 * 투표 생성 폼. 실제 `createVoteAction`(`woodong_votes`+`woodong_vote_options` 생성 및
 * "새 투표 시작" 알림 팬아웃)은 Task 029 몫이라, 이번 Task에서는 클라이언트 검증까지만
 * 동작시키고 제출은 데모 액션으로 대체한다. 선택지는 `useFieldArray`로 2개 이상 동적 관리한다.
 */
export function CreateVoteForm({
  groupId,
  labels,
}: {
  groupId: string;
  labels: Dictionary["votes"];
}) {
  const defaultValues: CreateVoteInput = {
    groupId,
    title: "",
    voteType: "multiple_choice",
    options: [{ label: "" }, { label: "" }],
    allowMultiple: false,
    isAnonymous: false,
    closesAt: "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createVoteSchema,
    defaultValues,
    action: demoCreateVoteAction,
    successMessage: labels.create.successToast,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{labels.create.title}</CardTitle>
        <CardDescription>{labels.pageTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
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

            <FormField
              control={form.control}
              name="voteType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.create.voteTypeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="multiple_choice">
                        {labels.type.multipleChoice}
                      </SelectItem>
                      <SelectItem value="yes_no">
                        {labels.type.yesNo}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <FormLabel>{labels.create.optionsLabel}</FormLabel>
              {fields.map((optionField, index) => (
                <FormField
                  key={optionField.id}
                  control={form.control}
                  name={`options.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder={labels.create.optionPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={labels.create.removeOptionButton}
                          disabled={fields.length <= 2}
                          onClick={() => remove(index)}
                        >
                          <XIcon />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => append({ label: "" })}
              >
                <PlusIcon />
                {labels.create.addOptionButton}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="closesAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.create.closesAtLabel}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowMultiple"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FormLabel className="font-normal">
                    {labels.create.allowMultipleLabel}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2 rounded-lg border p-3">
                  <FormLabel className="font-normal">
                    {labels.create.anonymousLabel}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full sm:w-fit"
              disabled={isPending}
            >
              {isPending && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {labels.create.submitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
