"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { submitVoteResponseAction } from "@/lib/woodong/actions/votes";
import { submitVoteResponseSchema, type VoteOption } from "@/lib/woodong/votes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 투표 참여 위젯 (Task 029에서 실데이터 연동).
 *
 * 집계는 로컬에서 더하지 않고 `router.refresh()`로 서버에서 다시 받아온다. 익명 투표에서
 * 클라이언트가 결과를 직접 계산하면 "내가 무엇을 골랐는지"가 화면 상태에 남아, 익명성을
 * 지키는 유일한 경로(`woodong_get_vote_results()` RPC)를 우회하게 된다.
 *
 * 중복 참여와 마감 후 참여는 DB 트리거가 최종적으로 막는다. 여기서 버튼을 감추는 것은
 * 편의일 뿐이고, 실패하면 서버가 돌려준 문구를 그대로 보여준다.
 */
export function VoteParticipation({
  voteId,
  options,
  allowMultiple,
  hasVoted,
  labels,
}: {
  voteId: string;
  options: VoteOption[];
  allowMultiple: boolean;
  hasVoted: boolean;
  labels: Dictionary["votes"];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleOption(optionId: string) {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  }

  function handleSubmit() {
    const parsed = submitVoteResponseSchema.safeParse({
      voteId,
      optionIds: selected,
    });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.optionIds?.[0] ?? null);
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await submitVoteResponseAction(parsed.data);

      if (!result.success) {
        setError(result.fieldErrors?.optionIds?.[0] ?? null);
        if (result.formError) {
          toast.error(result.formError);
        }
        // 마감·중복처럼 서버 상태가 화면과 어긋나서 실패한 경우가 대부분이라, 실패해도
        // 최신 상태를 다시 받아온다.
        router.refresh();
        return;
      }

      toast.success(labels.submitVoteSuccessToast);
      router.refresh();
    });
  }

  if (hasVoted) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2Icon className="size-4 text-primary" />
        {labels.alreadyVotedNotice}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {labels.notVotedYetNotice}
      </p>

      {allowMultiple ? (
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <Label
              key={option.id}
              className="flex min-h-11 items-center gap-2 rounded-md border p-3 font-normal"
            >
              <Checkbox
                checked={selected.includes(option.id)}
                onCheckedChange={() => toggleOption(option.id)}
              />
              {option.label}
            </Label>
          ))}
        </div>
      ) : (
        <RadioGroup
          value={selected[0] ?? ""}
          onValueChange={(value) => setSelected([value])}
          className="flex flex-col gap-2"
        >
          {options.map((option) => (
            <Label
              key={option.id}
              className="flex min-h-11 items-center gap-2 rounded-md border p-3 font-normal"
            >
              <RadioGroupItem value={option.id} />
              {option.label}
            </Label>
          ))}
        </RadioGroup>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-fit"
      >
        {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        {labels.voteButton}
      </Button>
    </div>
  );
}
