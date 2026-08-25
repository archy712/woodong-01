"use client";

import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createVoteAction } from "@/lib/woodong/actions/votes";
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
import { toast } from "sonner";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** 찬반 투표로 바꿨을 때 채워 넣는 기본 선택지. 서버도 찬반은 선택지 2개만 허용한다. */
const YES_NO_OPTIONS = [{ label: "찬성" }, { label: "반대" }];

/**
 * 투표 생성 폼 (Task 029에서 실데이터 연동).
 *
 * 제출은 `createVoteAction` → `woodong_create_vote()` RPC 한 번으로 투표·선택지·알림 팬아웃이
 * 한 트랜잭션에서 처리된다. 선택지는 `useFieldArray`로 2개 이상 동적 관리한다.
 *
 * 찬반(`yes_no`)을 고르면 선택지를 찬성/반대 2개로 고정한다 — 찬반인데 선택지가 5개면
 * 형식과 내용이 어긋나고, 서버도 그 조합을 거부한다.
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

  const router = useRouter();

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createVoteSchema,
    defaultValues,
    action: (input) =>
      createVoteAction({
        ...input,
        notificationTitle: labels.notificationTitle,
        notificationBody: labels.notificationBody,
      }),
    // 성공 토스트는 서버가 실제로 만든 알림 건수를 그대로 쓴다(클라이언트가 멤버 수로
    // 흉내 내면 작성자·비활성 멤버가 빠진 서버 계산과 어긋난다 — 공지와 같은 규약).
    onSuccess: ({ voteId, notifiedCount }) => {
      toast.success(
        notifiedCount > 0
          ? `${labels.create.successToast} ${notifiedCount}${labels.create.notifiedCountSuffix}`
          : `${labels.create.successToast} ${labels.create.notifiedNoneNotice}`,
      );
      router.push(`/protected/groups/${groupId}/votes/${voteId}`);
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const voteType = form.watch("voteType");
  const isYesNo = voteType === "yes_no";

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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "yes_no") {
                        form.setValue("options", YES_NO_OPTIONS);
                      }
                    }}
                    value={field.value}
                  >
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
                          disabled={isYesNo || fields.length <= 2}
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
              {!isYesNo && (
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
              )}
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
