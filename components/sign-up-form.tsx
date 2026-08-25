"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { mapAuthErrorMessage } from "@/lib/auth/auth-error-message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  auth,
  or,
  errors,
  next,
  ...props
}: {
  auth: Dictionary["auth"];
  or: string;
  errors: Dictionary["errors"];
  /** 가입 성공 후 복귀할 내부 경로. 페이지에서 `resolveNextPath()`로 검증해 내려준다. */
  next: string;
} & React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(auth.signUp.passwordMismatchError);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // 헤더는 루트 레이아웃의 서버 컴포넌트라 Router Cache에 담겨 있다.
      // refresh() 없이 이동하면 캐시된 "비로그인" 헤더가 그대로 재사용된다.
      router.push(next);
      router.refresh();
    } catch (error: unknown) {
      setError(mapAuthErrorMessage(error, errors));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{auth.signUp.title}</CardTitle>
          <CardDescription>{auth.signUp.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{auth.signUp.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{auth.signUp.passwordLabel}</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">
                    {auth.signUp.repeatPasswordLabel}
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? auth.signUp.submittingButton
                  : auth.signUp.submitButton}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {auth.signUp.haveAccountText}{" "}
              <Link
                href={`/auth/login?next=${encodeURIComponent(next)}`}
                className="underline underline-offset-4"
              >
                {auth.signUp.loginLink}
              </Link>
            </div>
          </form>
          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{or}</span>
            <Separator className="flex-1" />
          </div>
          <SocialAuthButtons auth={auth} errors={errors} next={next} />
        </CardContent>
      </Card>
    </div>
  );
}
