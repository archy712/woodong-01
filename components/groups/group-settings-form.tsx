"use client";

import { Loader2Icon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  createGroupSchema,
  GROUP_TYPE_SUGGESTIONS,
  type CreateGroupInput,
} from "@/lib/woodong/groups";
import { Button } from "@/components/ui/button";
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

const GROUP_TYPE_DATALIST_ID = "group-settings-type-suggestions";

const demoUpdateGroupAction = createDemoAction<CreateGroupInput>();

/**
 * 모임 정보 수정 폼(설정 화면 전용).
 *
 * 실제 `updateGroupAction`은 Task 019(모임 CRUD) 몫이라, 이번 Task에서는
 * `createGroupSchema`(모임 생성 폼과 동일한 필드 구성)를 재사용해 클라이언트 검증까지만
 * 동작시키고 제출은 데모 액션으로 대체한다. 성공해도 페이지 이동 없이 폼에 남아
 * 방금 입력한 값이 그대로 "저장된 값"처럼 보이게 한다(낙관적 UI).
 */
export function GroupSettingsForm({
  groupId,
  defaultValues,
  labels,
  createLabels,
  commonLabels,
}: {
  groupId: string;
  defaultValues: CreateGroupInput;
  labels: Dictionary["groups"]["settings"];
  createLabels: Dictionary["groups"]["create"];
  commonLabels: Dictionary["common"];
}) {
  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createGroupSchema,
    defaultValues,
    action: demoUpdateGroupAction,
    successMessage: labels.saveSuccessToast,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={createLabels.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={createLabels.descriptionPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.typeLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={createLabels.typePlaceholder}
                  list={GROUP_TYPE_DATALIST_ID}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultDueAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.defaultDueAmountLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  placeholder={createLabels.defaultDueAmountPlaceholder}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-fit"
          disabled={isPending}
          data-group-id={groupId}
        >
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {createLabels.submittingLabel}
            </>
          ) : (
            commonLabels.save
          )}
        </Button>
      </form>

      <datalist id={GROUP_TYPE_DATALIST_ID}>
        {GROUP_TYPE_SUGGESTIONS.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </Form>
  );
}
