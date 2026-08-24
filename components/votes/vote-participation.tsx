"use client";

import { useState, useTransition } from "react";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { createDemoAction } from "@/lib/woodong/dummy/demo-action";
import {
  submitVoteResponseSchema,
  type VoteOption,
  type VoteResult,
} from "@/lib/woodong/votes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const demoSubmitVoteAction = createDemoAction<{
  voteId: string;
  optionIds: string[];
}>();

/** 투표 참여 위젯. "나"는 데모 전용 가상 참여자 이름이다(실 사용자 이름 대신 사용). */
const DEMO_VOTER_NAME = "나";

export function VoteParticipation({
  voteId,
  options,
  allowMultiple,
  isAnonymous,
  hasVotedInitially,
  initialResults,
  labels,
  onResultsChange,
}: {
  voteId: string;
  options: VoteOption[];
  allowMultiple: boolean;
  isAnonymous: boolean;
  hasVotedInitially: boolean;
  initialResults: VoteResult[];
  labels: Dictionary["votes"];
  onResultsChange: (results: VoteResult[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(hasVotedInitially);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleOption(optionId: string) {
    if (allowMultiple) {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelected([optionId]);
    }
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
      const result = await demoSubmitVoteAction(parsed.data);
      if (!result.success) return;

      onResultsChange(
        initialResults.map((r) =>
          selected.includes(r.option_id)
            ? {
                ...r,
                response_count: r.response_count + 1,
                voter_names: isAnonymous
                  ? r.voter_names
                  : [...r.voter_names, DEMO_VOTER_NAME],
              }
            : r,
        ),
      );
      setHasVoted(true);
      toast.success(labels.submitVoteSuccessToast);
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
