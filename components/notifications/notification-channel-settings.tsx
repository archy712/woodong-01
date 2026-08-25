"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateChannelPreferenceAction } from "@/lib/woodong/actions/notifications";
import type { NotificationChannel } from "@/lib/woodong/notifications";
import type { ChannelPreference } from "@/lib/woodong/queries/notifications";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Labels = Dictionary["notifications"]["channelSettings"];

/**
 * 마이페이지 알림 채널 설정 (Task 027에서 실데이터 연동).
 *
 * 목록과 달리 여기서는 **낙관적 로컬 state를 쓴다**. 토글은 누른 즉시 움직여야 하고,
 * 서버 왕복을 기다리는 스위치는 고장 난 것처럼 느껴진다. 실패하면 이전 값으로 되돌리고
 * 토스트로 알린다 — 되돌리지 않으면 화면에는 꺼져 있는데 실제로는 알림이 계속 오게 된다.
 *
 * 저장 후 `router.refresh()`로 서버 값을 다시 읽어 화면과 DB가 어긋난 채 남지 않게 한다.
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

  const channelLabel: Record<NotificationChannel, string> = {
    in_app: labels.inApp,
    web_push: labels.webPush,
  };
  const channelDescription: Record<NotificationChannel, string> = {
    in_app: labels.inAppDescription,
    web_push: labels.webPushDescription,
  };

  function handleToggle(channel: NotificationChannel, enabled: boolean) {
    setOptimistic((prev) =>
      prev.map((p) => (p.channel === channel ? { ...p, enabled } : p)),
    );
    setPendingChannel(channel);

    startTransition(async () => {
      const result = await updateChannelPreferenceAction({ channel, enabled });
      setPendingChannel(null);

      if (!result.success) {
        setOptimistic((prev) =>
          prev.map((p) =>
            p.channel === channel ? { ...p, enabled: !enabled } : p,
          ),
        );
        toast.error(result.formError ?? labels.saveErrorToast);
        return;
      }

      toast.success(labels.saveSuccessToast);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {optimistic.map((pref) => (
        <Label
          key={pref.channel}
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
            disabled={pendingChannel === pref.channel}
            onCheckedChange={(checked) => handleToggle(pref.channel, checked)}
          />
        </Label>
      ))}
      <p className="text-xs text-muted-foreground">{labels.comingSoonNotice}</p>
    </div>
  );
}
