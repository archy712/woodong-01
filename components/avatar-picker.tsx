"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AVATAR_EMOJI,
  AVATAR_KEYS,
  type AvatarKey,
} from "@/lib/woodong/avatars";
import { updateAvatarAction } from "@/lib/woodong/actions/profile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AvatarPicker({ avatarKey }: { avatarKey: AvatarKey }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(avatarKey);
  const [isPending, startTransition] = useTransition();

  function handleSelect(key: AvatarKey) {
    if (key === selected) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await updateAvatarAction({ avatarKey: key });
      if (!result.success) {
        toast.error(result.formError ?? "아바타 변경에 실패했습니다.");
        return;
      }
      setSelected(key);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="text-xl">
            {AVATAR_EMOJI[selected]}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={isPending}
        >
          아바타 변경
        </Button>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>아바타 선택</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-3">
          {AVATAR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              disabled={isPending}
              aria-label={key}
              aria-pressed={key === selected}
              className={cn(
                "flex size-11 items-center justify-center rounded-full bg-muted text-xl transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50",
                key === selected &&
                  "ring-2 ring-foreground ring-offset-2 ring-offset-background",
              )}
            >
              {AVATAR_EMOJI[key]}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
