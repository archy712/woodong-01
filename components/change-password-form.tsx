"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useState } from "react";

export function ChangePasswordForm({
  className,
  auth,
  email,
  genericError,
  ...props
}: {
  auth: Dictionary["auth"];
  email: string;
  genericError: string;
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
      // 세션이 이미 있어도 updateUser()는 현재 비밀번호를 요구하지 않으므로,
      // 자리를 비운 기기에서의 오남용을 막기 위해 현재 비밀번호로 재인증한 뒤 변경한다.
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (reauthError) {
        setError(auth.changePassword.currentPasswordIncorrectError);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : genericError);
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
