"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import type {
  NotificationChannel,
  NotificationPreference,
} from "@/lib/woodong/notifications";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const demoUpdatePreferenceAction = createDemoAction<{
  channel: NotificationChannel;
  enabled: boolean;
}>();

const CHANNEL_ORDER: NotificationChannel[] = [
  "in_app",
  "kakao",
  "slack",
  "email",
];

export function NotificationChannelSettings({
  initialPreferences,
  labels,
}: {
  initialPreferences: NotificationPreference[];
  labels: Dictionary["notifications"]["channelSettings"];
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [, startTransition] = useTransition();

  function handleToggle(channel: NotificationChannel, enabled: boolean) {
    setPreferences((prev) =>
      prev.map((p) => (p.channel === channel ? { ...p, enabled } : p)),
    );
    startTransition(async () => {
      const result = await demoUpdatePreferenceAction({ channel, enabled });
      if (result.success) {
        toast.success(labels.saveSuccessToast);
      }
    });
  }

  const channelLabel: Record<NotificationChannel, string> = {
    in_app: labels.inApp,
    kakao: labels.kakao,
    slack: labels.slack,
    email: labels.email,
  };

  return (
    <div className="flex flex-col gap-4">
      {CHANNEL_ORDER.map((channel) => {
        const pref = preferences.find((p) => p.channel === channel);
        return (
          <Label
            key={channel}
            htmlFor={`channel-${channel}`}
            className="flex min-h-11 items-center justify-between gap-2 rounded-lg border p-3 font-normal"
          >
            {channelLabel[channel]}
            <Switch
              id={`channel-${channel}`}
              checked={pref?.enabled ?? false}
              onCheckedChange={(checked) => handleToggle(channel, checked)}
            />
          </Label>
        );
      })}
      <p className="text-xs text-muted-foreground">{labels.comingSoonNotice}</p>
    </div>
  );
}
