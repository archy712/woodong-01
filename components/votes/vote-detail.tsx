import type { Vote, VoteOption, VoteResult } from "@/lib/woodong/votes";
import { VoteParticipation } from "@/components/votes/vote-participation";
import { VoteResultsChart } from "@/components/votes/vote-results-chart";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 투표 상세 본문 (Task 029에서 실데이터 연동).
 *
 * 결과를 로컬 state로 들지 않는 **서버 컴포넌트**다. 참여 후 갱신은 `router.refresh()`가
 * 서버에서 다시 집계해 오므로(익명 집계는 `woodong_get_vote_results()` RPC만 알고 있다)
 * 클라이언트가 표를 더해 둘 이유가 없다.
 */
export function VoteDetail({
  vote,
  options,
  results,
  hasVoted,
  isClosed,
  labels,
  unnamedVoterLabel,
}: {
  vote: Vote;
  options: VoteOption[];
  results: VoteResult[];
  hasVoted: boolean;
  /** 마감 여부는 쿼리 계층에서 계산해 받는다(렌더 중 `Date.now()`는 순수성 규칙 위반). */
  isClosed: boolean;
  labels: Dictionary["votes"];
  /**
   * 이름이 비어 있는 참여자를 대신할 문구(Task 030).
   *
   * `woodong_get_vote_results()`는 이름이 없는 참여자를 빈 문자열로 돌려준다 — 배열에서
   * 빼 버리면 "3표인데 이름은 1개"가 되기 때문이다. 멤버 목록·회비 대시보드와 **같은**
   * 문구("이름 미확인 멤버")를 쓰도록 상위에서 받아 온다.
   */
  unnamedVoterLabel: string;
}) {
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
                    {labels.voterNamesLabel}:{" "}
                    {r.voter_names
                      .map((name) => name || unnamedVoterLabel)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isClosed ? (
        <p className="text-sm text-muted-foreground">{labels.closedNotice}</p>
      ) : (
        <VoteParticipation
          voteId={vote.id}
          options={options}
          allowMultiple={vote.allow_multiple}
          hasVoted={hasVoted}
          labels={labels}
        />
      )}
    </div>
  );
}
