import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 데이터를 읽어 오는 화면들의 공용 로딩 스켈레톤 (Task 031).
 *
 * `cacheComponents`에서 이 앱의 페이지는 전부 얇은 셸 + `<Suspense>` + 비동기 콘텐츠 구조라,
 * 폴백이 `null`이면 서버 응답이 올 때까지 **헤더 아래가 통째로 빈 화면**이 된다. 느린 회선에서는
 * 그 빈 화면이 "데이터가 없는 모임"과 구별되지 않는다(회비 화면만 Task 024에서 스켈레톤을
 * 갖고 있었다). 실제 레이아웃과 같은 골격을 미리 깔아 체감 대기 시간을 줄인다.
 *
 * 전부 서버 컴포넌트(`"use client"` 없음)라 폴백 때문에 클라이언트 번들이 늘지 않는다.
 * 목록 길이는 "흔한 경우"에 맞춘 고정값이다 — 실제 개수를 알 수 없는 시점이라, 많이 그려서
 * 레이아웃이 크게 줄어드는 것(CLS)보다 적게 그리는 편이 낫다.
 */

/** 제목 + (선택) 우측 버튼 한 줄. 대부분의 화면 상단이 이 모양이다. */
function PageHeadingSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="h-8 w-32" />
      {withAction && <Skeleton className="h-9 w-28" />}
    </div>
  );
}

/** 카드 목록형 화면(모임 목록, 공지, 투표 목록, 알림센터) 공용. */
export function CardListSkeleton({
  rows = 3,
  withAction = false,
  maxWidth = "max-w-2xl",
}: {
  rows?: number;
  withAction?: boolean;
  /** 각 화면이 쓰는 컨테이너 폭을 그대로 받아 폴백↔실제 전환에서 폭이 튀지 않게 한다. */
  maxWidth?: string;
}) {
  return (
    <div
      className={`mx-auto flex w-full ${maxWidth} flex-1 flex-col gap-6 p-6 sm:p-8`}
    >
      <PageHeadingSkeleton withAction={withAction} />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, row) => (
          <Card key={row}>
            <CardHeader>
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** 모임 홈: 커버 이미지 자리 + 제목 + 요약 카드 3장(공지·회비·투표). */
export function GroupDashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-24" />
      </div>
      {[0, 1, 2].map((card) => (
        <Card key={card}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * 투표 상세: 제목 + 결과 차트 + 선택지 집계 + 참여 위젯.
 *
 * 실제 화면(선택지 4개 기준 약 860px)과 **높이를 비슷하게** 맞춰 둔다. 스켈레톤이 실제보다
 * 훨씬 짧으면 콘텐츠가 도착하는 순간 그 아래 푸터가 통째로 밀려 내려가 CLS로 잡힌다
 * (Task 031에서 짧은 스켈레톤 때문에 CLS 0.169가 나왔다 — 회비 대시보드가 0.003인 이유는
 * 그쪽 스켈레톤이 실제 레이아웃과 같은 골격이기 때문이다).
 */
export function VoteDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* 결과 영역: 제목 + 익명/실명 안내 + 차트 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
            {/* 차트 높이는 `VoteResultsChart`의 계산식(선택지 4개 → 176px)과 맞춘다. */}
            <Skeleton className="h-44 w-full" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* 참여 위젯: 안내 + 선택지 버튼 목록 + 제출 버튼 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-56" />
            {[0, 1, 2, 3].map((row) => (
              <Skeleton key={row} className="h-12 w-full rounded-md" />
            ))}
            <Skeleton className="h-9 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
