"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { mapAuthErrorMessage } from "@/lib/auth/auth-error-message";
import { useState } from "react";

export function ChangePasswordForm({
  className,
  auth,
  email,
  errors,
  ...props
}: {
  auth: Dictionary["auth"];
  email: string;
  errors: Dictionary["errors"];
} & React.ComponentPropsWithoutRef<"div">) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError(auth.changePassword.passwordMismatchError);
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      // 현재 비밀번호 확인을 **두 겹**으로 건다 (Task 033 후속).
      //
      // ① 클라이언트 재인증: `updateUser()`는 기본 설정에서 현재 비밀번호를 요구하지 않으므로,
      //    자리를 비운 기기에서의 오남용을 막기 위해 먼저 로그인을 시도한다.
      //    다만 이건 **화면에서만 걸리는 방어**다 — 세션을 쥔 사람이 콘솔에서
      //    `updateUser({ password })`를 직접 부르면 이 단계는 통째로 건너뛴다.
      // ② `current_password` 전달: Supabase Auth의
      //    "Require current password when updating"(대시보드 토글, Free 플랜 사용 가능)이
      //    켜져 있으면 **서버가** 이 값을 검증한다. 꺼져 있으면 조용히 무시되므로,
      //    토글을 켜기 전에 먼저 배포해도 안전하다(반대 순서는 비밀번호 변경이 전부 실패한다).
      //
      // 토글이 켜진 뒤에도 ①을 남겨 두는 이유: 서버가 거부하면 GoTrue의 일반 에러로
      // 내려와 "현재 비밀번호가 틀렸다"는 구체적 안내를 주기 어렵다.
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (reauthError) {
        setError(auth.changePassword.currentPasswordIncorrectError);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        current_password: currentPassword,
        password: newPassword,
      });
      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(mapAuthErrorMessage(err, errors));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="current-password">
            {auth.changePassword.currentPasswordLabel}
          </Label>
          <Input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">
            {auth.changePassword.newPasswordLabel}
          </Label>
          <Input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">
            {auth.changePassword.confirmPasswordLabel}
          </Label>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="text-sm text-muted-foreground">
            {auth.changePassword.successMessage}
          </p>
        )}
        <Button type="submit" disabled={isLoading} className="w-fit">
          {isLoading
            ? auth.changePassword.submittingButton
            : auth.changePassword.submitButton}
        </Button>
      </form>
    </div>
  );
}
