"use client";

import { Loader2Icon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createGroupAction } from "@/lib/udong/actions/groups";
import {
  createGroupSchema,
  GROUP_TYPE_SUGGESTIONS,
  type CreateGroupInput,
} from "@/lib/udong/groups";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const GROUP_TYPE_DATALIST_ID = "group-type-suggestions";

const defaultValues: CreateGroupInput = {
  name: "",
  description: "",
  type: "",
  defaultDueAmount: undefined,
};

/**
 * 모임 생성 폼 — Task 008(폼 아키텍처) 검증용 샘플 폼.
 *
 * `useServerActionForm`(react-hook-form + zod + Server Action 공통 훅)과
 * `createGroupAction`(`lib/udong/actions/groups.ts`)을 연결하기만 하면 되고,
 * 성공 시 `createGroupAction`이 직접 `redirect()`로 상세 페이지로 이동시키므로
 * 이 컴포넌트에는 성공 후 처리 로직이 따로 없다.
 */
export function CreateGroupForm({
  className,
  labels,
  ...props
}: {
  labels: Dictionary["groups"]["create"];
} & React.ComponentPropsWithoutRef<"div">) {
  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createGroupSchema,
    defaultValues,
    action: createGroupAction,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{labels.title}</CardTitle>
          <CardDescription>{labels.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={labels.namePlaceholder} {...field} />
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
                    <FormLabel>{labels.descriptionLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={labels.descriptionPlaceholder}
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
                    <FormLabel>{labels.typeLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={labels.typePlaceholder}
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
                    <FormLabel>{labels.defaultDueAmountLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1000}
                        placeholder={labels.defaultDueAmountPlaceholder}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {labels.submittingLabel}
                  </>
                ) : (
                  labels.submitButton
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* GROUP_TYPE_SUGGESTIONS는 힌트일 뿐, udong_groups.type은 자유 값이라 직접 타이핑도 허용한다. */}
      <datalist id={GROUP_TYPE_DATALIST_ID}>
        {GROUP_TYPE_SUGGESTIONS.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}
