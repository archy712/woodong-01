"use client";

import { Loader2Icon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  createAnnouncementSchema,
  type CreateAnnouncementInput,
} from "@/lib/woodong/announcements";
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

const demoCreateAnnouncementAction =
  createDemoAction<CreateAnnouncementInput>();

/**
 * 공지 작성 폼. 실제 `createAnnouncementAction`(Edge Function 기반 알림 팬아웃 포함)은
 * Task 025 몫이라, 이번 Task에서는 클라이언트 검증까지만 동작시키고 제출은 데모 액션으로
 * 대체한다. 성공 시 페이지 이동 없이 폼을 초기화하고 토스트로 안내한다.
 */
export function CreateAnnouncementForm({
  groupId,
  labels,
}: {
  groupId: string;
  labels: Dictionary["groups"]["announcements"];
}) {
  const defaultValues: CreateAnnouncementInput = {
    groupId,
    title: "",
    body: "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createAnnouncementSchema,
    defaultValues,
    action: demoCreateAnnouncementAction,
    successMessage: labels.submitSuccessToast,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{labels.createTitle}</CardTitle>
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
                  <FormLabel>{labels.titleLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.contentLabel}</FormLabel>
                  <FormControl>
                    <Textarea rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
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
              {labels.submitButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
