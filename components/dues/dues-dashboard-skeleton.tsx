import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 회비 대시보드 로딩 스켈레톤 (Task 024).
 *
 * 회비 화면은 항목·청구·납부 이력을 한 번에 읽어 오는 데다 멤버 표시 이름을 RPC로 따로 가져오므로
 * 다른 화면보다 첫 응답이 느리다. `Suspense fallback={null}`이면 그동안 헤더 아래가 통째로 비어
 * "빈 모임"처럼 보이기 때문에, 실제 레이아웃(요약 카드 → 멤버 목록)과 같은 골격을 미리 깔아 준다.
 * 서버 컴포넌트로 두어(`"use client"` 없음) 폴백에 클라이언트 번들을 얹지 않는다.
 */
export function DuesDashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>

        <Skeleton className="h-11 w-full" />

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <Skeleton className="size-[140px] shrink-0 rounded-full" />
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-11 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
