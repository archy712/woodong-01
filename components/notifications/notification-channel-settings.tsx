"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  updateChannelPreferenceAction,
  updateWebPushSubscriptionAction,
} from "@/lib/woodong/actions/notifications";
import type { NotificationChannel } from "@/lib/woodong/notifications";
import type { ChannelPreference } from "@/lib/woodong/queries/notifications";
import {
  getPushEnvironmentSnapshot,
  getServerPushEnvironmentSnapshot,
  invalidatePushEnvironment,
  parsePushEnvironment,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/woodong/web-push";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Labels = Dictionary["notifications"]["channelSettings"];

/** VAPID 공개 키는 비밀이 아니라 브라우저 구독에 반드시 필요한 값이다(PRD 4.2). */
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/**
 * 브라우저 환경은 구독하지 않는다 — 한 번 읽으면 페이지가 살아 있는 동안 바뀌지 않고,
 * 권한만 우리가 직접 요청했을 때 바뀌므로 그때 캐시를 버리고 다시 읽는다.
 */
function subscribeToNothing() {
  return () => {};
}

/**
 * 마이페이지 알림 채널 설정 (Task 027에서 실데이터 연동, Task 038에서 웹 푸시 구독 연결).
 *
 * 목록과 달리 여기서는 **낙관적 로컬 state를 쓴다**. 토글은 누른 즉시 움직여야 하고,
 * 서버 왕복을 기다리는 스위치는 고장 난 것처럼 느껴진다. 실패하면 이전 값으로 되돌리고
 * 토스트로 알린다 — 되돌리지 않으면 화면에는 꺼져 있는데 실제로는 알림이 계속 오게 된다.
 *
 * ⚠️ `web_push`는 **켜는 것과 목적지를 확보하는 것이 같은 동작**이라 경로가 다르다.
 * 브라우저 권한 요청 → Push 구독 → 서버 저장이 한 묶음이고, 어디서 끊겨도 "켜져 있는데
 * 못 보내는" 상태가 되면 안 되므로 마지막 저장이 성공해야만 스위치가 켜진 채로 남는다.
 */
export function NotificationChannelSettings({
  preferences,
  labels,
}: {
  preferences: ChannelPreference[];
  labels: Labels;
}) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useState(preferences);
  const [pendingChannel, setPendingChannel] =
    useState<NotificationChannel | null>(null);
  const [, startTransition] = useTransition();

  // 서버 렌더에서는 "지원 안 함"으로 그리고, 하이드레이션 후 실제 환경으로 바뀐다.
  // 이 값 때문에 안내 문구가 서버/클라이언트에서 달라지므로 effect가 아니라 스토어로 읽는다.
  const [environmentVersion, setEnvironmentVersion] = useState(0);
  const environmentSnapshot = useSyncExternalStore(
    subscribeToNothing,
    getPushEnvironmentSnapshot,
    getServerPushEnvironmentSnapshot,
  );
  // `environmentVersion`은 권한을 요청한 뒤 스냅샷을 다시 읽게 만드는 트리거일 뿐이다.
  void environmentVersion;
  const environment = parsePushEnvironment(environmentSnapshot);

  const channelLabel: Record<NotificationChannel, string> = {
    in_app: labels.inApp,
    web_push: labels.webPush,
  };
  const channelDescription: Record<NotificationChannel, string> = {
    in_app: labels.inAppDescription,
    web_push: labels.webPushDescription,
  };

  /** iOS는 홈 화면에 추가(PWA 설치)해야만 푸시가 동작한다(PRD 9장). */
  const needsIosInstall = environment.ios && !environment.standalone;
  const webPushBlocked =
    !environment.supported ||
    needsIosInstall ||
    environment.permission === "denied" ||
    VAPID_PUBLIC_KEY === "";

  function setEnabledLocally(channel: NotificationChannel, enabled: boolean) {
    setOptimistic((prev) =>
      prev.map((p) => (p.channel === channel ? { ...p, enabled } : p)),
    );
  }

  function handleInAppToggle(enabled: boolean) {
    setEnabledLocally("in_app", enabled);
    setPendingChannel("in_app");

    startTransition(async () => {
      const result = await updateChannelPreferenceAction({
        channel: "in_app",
        enabled,
      });
      setPendingChannel(null);

      if (!result.success) {
        setEnabledLocally("in_app", !enabled);
        toast.error(result.formError ?? labels.saveErrorToast);
        return;
      }

      toast.success(labels.saveSuccessToast);
      router.refresh();
    });
  }

  function handleWebPushToggle(enabled: boolean) {
    setEnabledLocally("web_push", enabled);
    setPendingChannel("web_push");

    startTransition(async () => {
      const revert = () => {
        setEnabledLocally("web_push", !enabled);
        setPendingChannel(null);
      };

      if (enabled) {
        const result = await subscribeToPush(VAPID_PUBLIC_KEY);
        // 권한 상태가 바뀌었을 수 있으므로 안내 문구를 다시 계산하게 만든다.
        invalidatePushEnvironment();
        setEnvironmentVersion((v) => v + 1);

        if (!result.ok) {
          revert();
          toast.error(
            result.reason === "denied"
              ? labels.webPushPermissionDenied
              : result.reason === "unsupported"
                ? labels.webPushUnsupported
                : labels.webPushSubscribeErrorToast,
          );
          return;
        }

        const saved = await updateWebPushSubscriptionAction({
          enabled: true,
          subscription: result.subscription,
        });
        setPendingChannel(null);

        if (!saved.success) {
          // 서버에 저장하지 못했으면 브라우저 구독도 되돌린다. 남겨 두면 브라우저는
          // 구독 중인데 서버는 모르는 상태가 되어 다음에 켤 때 혼선이 생긴다.
          await unsubscribeFromPush();
          setEnabledLocally("web_push", false);
          toast.error(saved.formError ?? labels.saveErrorToast);
          return;
        }

        toast.success(labels.saveSuccessToast);
        router.refresh();
        return;
      }

      // 끄기: 브라우저 구독을 해지하고 서버의 목적지도 함께 비운다.
      await unsubscribeFromPush();
      const saved = await updateWebPushSubscriptionAction({
        enabled: false,
        subscription: null,
      });
      setPendingChannel(null);

      if (!saved.success) {
        setEnabledLocally("web_push", true);
        toast.error(saved.formError ?? labels.saveErrorToast);
        return;
      }

      toast.success(labels.saveSuccessToast);
      router.refresh();
    });
  }

  /** 채널별로 스위치 아래에 붙는 상황 안내. 없으면 아무것도 그리지 않는다. */
  function webPushNotice(pref: ChannelPreference): string | null {
    if (VAPID_PUBLIC_KEY === "") return labels.webPushMissingKeyNotice;
    if (!environment.supported) return labels.webPushUnsupported;
    if (environment.permission === "denied")
      return labels.webPushPermissionDenied;
    if (pref.enabled && pref.hasDestination) return labels.webPushActiveNotice;
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {optimistic.map((pref) => {
        const isWebPush = pref.channel === "web_push";
        const notice = isWebPush ? webPushNotice(pref) : null;

        return (
          <div key={pref.channel} className="flex flex-col gap-2">
            <Label
              htmlFor={`channel-${pref.channel}`}
              className="flex min-h-11 items-start justify-between gap-3 rounded-lg border p-3 font-normal"
            >
              <span className="flex flex-col gap-1">
                <span>{channelLabel[pref.channel]}</span>
                <span className="text-xs text-muted-foreground">
                  {channelDescription[pref.channel]}
                </span>
              </span>
              <Switch
                id={`channel-${pref.channel}`}
                checked={pref.enabled}
                // 켤 수 없는 환경에서는 끄는 것만 허용한다. 이미 켜져 있는 사람이
                // (예: 브라우저 설정에서 나중에 알림을 차단한 경우) 갇히면 안 된다.
                disabled={
                  pendingChannel === pref.channel ||
                  (isWebPush && webPushBlocked && !pref.enabled)
                }
                onCheckedChange={(checked) =>
                  isWebPush
                    ? handleWebPushToggle(checked)
                    : handleInAppToggle(checked)
                }
              />
            </Label>

            {notice && (
              <p className="px-1 text-xs text-muted-foreground">{notice}</p>
            )}

            {isWebPush && needsIosInstall && (
              <div className="rounded-lg border border-dashed p-3">
                <p className="text-xs font-medium">
                  {labels.webPushIosInstallTitle}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {labels.webPushIosInstallBody}
                </p>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">{labels.comingSoonNotice}</p>
    </div>
  );
}
