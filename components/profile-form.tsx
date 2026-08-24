"use client";

import { Loader2Icon } from "lucide-react";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { updateProfileAction } from "@/lib/udong/actions/profile";
import {
  updateProfileSchema,
  type Profile,
  type UpdateProfileInput,
} from "@/lib/udong/profile";
import type { AvatarKey } from "@/lib/udong/avatars";
import { cn } from "@/lib/utils";
import { AvatarPicker } from "@/components/avatar-picker";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm({
  profile,
  avatarKey,
  className,
  ...props
}: {
  profile: Profile;
  avatarKey: AvatarKey;
} & React.ComponentPropsWithoutRef<"div">) {
  const defaultValues: UpdateProfileInput = {
    name: profile.name ?? "",
    phoneNumber: profile.phone_number ?? "",
    bio: profile.bio ?? "",
  };

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: updateProfileSchema,
    defaultValues,
    action: updateProfileAction,
    successMessage: "프로필을 저장했습니다.",
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">내 프로필</CardTitle>
          <CardDescription>
            회원 프로필 정보를 확인하고 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <Label>아바타</Label>
              <AvatarPicker avatarKey={avatarKey} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email ?? ""}
                disabled
              />
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="이름을 입력해주세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <Input placeholder="010-1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>자기소개</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="자기소개를 입력해주세요"
                          {...field}
                        />
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
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    "저장"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
