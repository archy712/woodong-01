"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { createAnnouncementAction } from "@/lib/woodong/actions/announcements";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 공지 작성 폼 (Task 025에서 실제 발송으로 연결).
 *
 * 발송은 `createAnnouncementAction` → `woodong_create_announcement()` RPC 한 번으로 공지 저장과
 * 멤버 알림 팬아웃이 함께 처리된다. 성공 시 몇 명에게 전달됐는지 토스트로 알려 주는데,
 * 그 수는 클라이언트가 멤버 수로 흉내 내지 않고 **서버가 실제로 만든 알림 건수**를 그대로 쓴다
 * (작성자 본인과 `in_app`을 끈 멤버가 빠지므로 화면이 아는 멤버 수와 다르다).
 */
export function CreateAnnouncementForm({
  groupId,
  labels,
  commonLabels,
}: {
  groupId: string;
  labels: Dictionary["groups"]["announcements"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();

  const defaultValues: CreateAnnouncementInput = {
    groupId,
    title: "",
    body: "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: createAnnouncementSchema,
    defaultValues,
    action: createAnnouncementAction,
    onSuccess: ({ notifiedCount }) => {
      toast.success(
        notifiedCount > 0
          ? `${labels.submitSuccessToast} ${notifiedCount}${labels.notifiedCountSuffix}`
          : `${labels.submitSuccessToast} ${labels.notifiedNoneNotice}`,
      );
      form.reset(defaultValues);
      router.push(`/protected/groups/${groupId}/announcements`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{labels.createTitle}</CardTitle>
        <CardDescription>{labels.notifyNotice}</CardDescription>
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
                  <FormDescription>{labels.editNotifyNotice}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {labels.submitButton}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  router.push(`/protected/groups/${groupId}/announcements`)
                }
                disabled={isPending}
              >
                {commonLabels.cancel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
