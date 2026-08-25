"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, MailIcon } from "lucide-react";
import { toast } from "sonner";

import { GoogleIcon, KakaoIcon } from "@/components/auth/provider-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";
import { mapAuthErrorMessage } from "@/lib/auth/auth-error-message";

/** 우동이 관리하는 로그인 수단과 화면 표시 순서. */
const MANAGED_PROVIDERS = ["email", "google", "kakao"] as const;
type ManagedProvider = (typeof MANAGED_PROVIDERS)[number];

/** 마이페이지에서 새로 연동을 시작할 수 있는 provider(OAuth만 가능). */
const LINKABLE_PROVIDERS = ["google", "kakao"] as const;
type LinkableProvider = (typeof LINKABLE_PROVIDERS)[number];

function isLinkable(provider: string): provider is LinkableProvider {
  return (LINKABLE_PROVIDERS as readonly string[]).includes(provider);
}

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "google") return <GoogleIcon />;
  if (provider === "kakao") return <KakaoIcon />;
  return <MailIcon className="size-4" />;
}

/**
 * 마이페이지 "연동된 계정" 카드 (Task 018).
 *
 * 인증 관련 조작이라 이 저장소의 예외 규칙대로 Server Action이 아니라 Client Component에서
 * `supabase.auth.*`를 직접 호출한다(`docs/guides/forms-react-hook-form.md`).
 *
 * 해제는 Supabase가 "identity 2개 이상"일 때만 허용하므로(마지막 로그인 수단 상실 방지)
 * 버튼 비활성화 + 해제 직전 재조회로 UI·서버 양쪽에서 막는다.
 */
export function LinkedAccounts({
  providers,
  email,
  labels,
  errors,
  noEmailNotice,
}: {
  /** JWT `app_metadata.providers`에서 읽은 연동된 provider 목록. */
  providers: string[];
  /** 세션의 이메일. 이메일 로그인 수단 행에 함께 표시한다. */
  email: string | null;
  labels: Dictionary["me"];
  errors: Dictionary["errors"];
  /** 이메일 없이 가입된 계정(Kakao 이메일 미동의)에만 보여줄 안내. 없으면 숨긴다. */
  noEmailNotice: string | null;
}) {
  const router = useRouter();
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  const linkedProviders = new Set(providers);
  // 관리 목록 밖의 provider가 붙어 있어도 최소한 목록에는 보여준다.
  const extraProviders = providers.filter(
    (provider) => !(MANAGED_PROVIDERS as readonly string[]).includes(provider),
  );
  const rows: string[] = [...MANAGED_PROVIDERS, ...extraProviders];

  // Supabase 규칙: identity가 2개 이상일 때만 해제할 수 있다.
  const canUnlink = providers.length >= 2;

  const providerLabel = (provider: ManagedProvider | string) => {
    if (provider === "email") return labels.emailProviderLabel;
    if (provider === "google") return "Google";
    if (provider === "kakao") return "Kakao";
    return provider;
  };

  async function handleLink(provider: LinkableProvider) {
    const supabase = createClient();
    setPendingProvider(provider);

    // 연동도 OAuth 왕복이라 콜백을 거친다. 돌아올 곳은 마이페이지로 고정한다(Task 017).
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", "/protected/me");

    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });

    if (error) {
      toast.error(mapAuthErrorMessage(error, errors));
      setPendingProvider(null);
    }
    // 성공하면 브라우저가 provider 인가 화면으로 이동한다.
  }

  async function handleUnlink(provider: string) {
    const supabase = createClient();
    setPendingProvider(provider);

    try {
      // `unlinkIdentity()`는 UserIdentity 객체를 요구한다. 서버 컴포넌트에서는 이 조회가
      // 불안정해 클레임으로 목록을 그리고(Task 018-1), identity_id가 실제로 필요한 이 시점에만
      // 브라우저 클라이언트로 조회한다. 다른 탭에서 이미 해제된 경우도 여기서 걸러진다.
      const { data, error } = await supabase.auth.getUserIdentities();
      if (error || !data) {
        toast.error(
          error
            ? mapAuthErrorMessage(error, errors)
            : labels.linkedAccountsLoadError,
        );
        return;
      }

      if (data.identities.length < 2) {
        toast.error(labels.lastIdentityNotice);
        router.refresh();
        return;
      }

      const identity = data.identities.find(
        (candidate) => candidate.provider === provider,
      );
      if (!identity) {
        router.refresh();
        return;
      }

      const { error: unlinkError } =
        await supabase.auth.unlinkIdentity(identity);
      if (unlinkError) {
        toast.error(mapAuthErrorMessage(unlinkError, errors));
        return;
      }

      // 목록은 JWT의 `app_metadata.providers`로 그리는데, 이 값은 토큰 발급 시점 기준이라
      // 해제만 하고 새로고침하면 방금 끊은 provider가 그대로 남는다. 토큰을 재발급받아야
      // 갱신된 provider 목록이 내려온다.
      await supabase.auth.refreshSession();

      toast.success(labels.unlinkSuccessToast);
      router.refresh();
    } finally {
      setPendingProvider(null);
    }
  }

  // 클레임에 provider가 하나도 없으면 정상 상태로 보기 어렵다. 잘못된 "연동 안 됨" 표시보다
  // 실패를 알리는 편이 안전하다(오해하고 재연동을 시도하면 오히려 에러를 만난다).
  if (providers.length === 0) {
    return (
      <p className="rounded-md bg-muted p-3 text-sm text-destructive">
        {labels.linkedAccountsLoadError}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((provider) => {
        const isLinked = linkedProviders.has(provider);
        const isPending = pendingProvider === provider;
        const label = providerLabel(provider);
        // 이메일은 provider별로 다를 수 있지만 세션에는 대표 이메일 하나뿐이라,
        // 이메일 로그인 수단 행에만 표시한다.
        const subLabel = provider === "email" ? email : null;

        return (
          <div
            key={provider}
            className="flex flex-wrap items-center justify-between gap-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <ProviderIcon provider={provider} />
              <span className="flex flex-col">
                <span>{label}</span>
                {isLinked && subLabel && (
                  <span className="text-xs text-muted-foreground">
                    {subLabel}
                  </span>
                )}
              </span>
            </span>

            <span className="flex items-center gap-2">
              <Badge variant={isLinked ? "secondary" : "outline"}>
                {isLinked ? labels.connectedLabel : labels.notConnectedLabel}
              </Badge>

              {isLinked ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canUnlink || pendingProvider !== null}
                      title={canUnlink ? undefined : labels.lastIdentityNotice}
                    >
                      {isPending && (
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                      )}
                      {labels.unlinkAccountButton}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {labels.unlinkConfirmTitle}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {labels.unlinkConfirmDescription}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {labels.unlinkConfirmCancel}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleUnlink(provider)}>
                        {labels.unlinkConfirmAction}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                isLinkable(provider) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleLink(provider)}
                    disabled={pendingProvider !== null}
                  >
                    {isPending && (
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                    )}
                    {labels.linkAccountButton}
                  </Button>
                )
              )}
            </span>
          </div>
        );
      })}

      {!canUnlink && (
        <p className="text-xs text-muted-foreground">
          {labels.lastIdentityNotice}
        </p>
      )}

      {/* 이메일 없이 가입된 Kakao 계정은 이메일 로그인 수단을 추가할 수 없어 별도 안내한다. */}
      {noEmailNotice && (
        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          {noEmailNotice}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {labels.linkedAccountsNotice}
      </p>
    </div>
  );
}
