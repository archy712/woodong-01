"use client";

import { useState } from "react";

import type { Vote, VoteOption, VoteResult } from "@/lib/woodong/votes";
import { VoteParticipation } from "@/components/votes/vote-participation";
import { VoteResultsChart } from "@/components/votes/vote-results-chart";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function VoteDetail({
  vote,
  options,
  initialResults,
  hasVotedInitially,
  labels,
}: {
  vote: Vote;
  options: VoteOption[];
  initialResults: VoteResult[];
  hasVotedInitially: boolean;
  labels: Dictionary["votes"];
}) {
  const [results, setResults] = useState(initialResults);
  const totalResponses = results.reduce((sum, r) => sum + r.response_count, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">{labels.resultsTitle}</h2>
        <p className="text-xs text-muted-foreground">
          {vote.is_anonymous
            ? labels.anonymousResultsNotice
            : labels.realNameResultsNotice}
        </p>
        <VoteResultsChart
          results={results}
          responseCountSuffix={labels.responseCountSuffix}
        />
        <div className="flex flex-col gap-3">
          {results.map((r) => {
            const percent =
              totalResponses > 0
                ? Math.round((r.response_count / totalResponses) * 100)
                : 0;
            return (
              <div key={r.option_id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.label}</span>
                  <span className="text-muted-foreground">
                    {r.response_count}
                    {labels.responseCountSuffix} ({percent}%)
                  </span>
                </div>
                {!vote.is_anonymous && r.voter_names.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {labels.voterNamesLabel}: {r.voter_names.join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {vote.status === "open" && (
        <VoteParticipation
          voteId={vote.id}
          options={options}
          allowMultiple={vote.allow_multiple}
          isAnonymous={vote.is_anonymous}
          hasVotedInitially={hasVotedInitially}
          initialResults={results}
          labels={labels}
          onResultsChange={setResults}
        />
      )}
    </div>
  );
}
