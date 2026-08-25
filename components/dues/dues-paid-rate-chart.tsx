"use client";

import {
  Bar,
  BarChart,
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { dueProgressPercent } from "@/lib/woodong/dues-summary";
import type { DuesStatus } from "@/lib/woodong/dues";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 회비 상태별 색상 — 코럴/앰버 브랜드 팔레트(`--chart-1`~`--chart-5`)를 재사용하되,
 * 미납은 "주의가 필요한 상태"라는 기존 UI 관례(회비 대시보드의 미납 하이라이트 카드가
 * `text-destructive` 아이콘을 쓰는 것)를 그대로 이어받아 destructive 색을 쓴다.
 */
const STATUS_COLOR: Record<DuesStatus, string> = {
  paid: "hsl(var(--chart-1))",
  partial: "hsl(var(--chart-2))",
  unpaid: "hsl(var(--destructive))",
};

/** 스택 막대와 범례가 같은 순서로 읽히도록 고정. 완납 → 부분납부 → 미납. */
const STATUS_ORDER: DuesStatus[] = ["paid", "partial", "unpaid"];

/**
 * 사이클 전체 납부율을 표시하는 단일 게이지(RadialBarChart).
 *
 * ⚠️ 값을 `endAngle`로 표현하면(shadcn 예제의 기본형) **0%일 때 차트가 통째로 사라진다** — 시작각과
 * 끝각이 같아져 `background` 트랙까지 그려지지 않고, 화면에는 140px짜리 빈 사각형에 "0%" 글자만
 * 남는다. 회비 항목을 막 만든 직후가 정확히 그 상태다. 그래서 차트는 항상 360°를 돌게 두고
 * (`endAngle={-270}`), 값은 `PolarAngleAxis`의 0~100 도메인으로 매핑한다. 0%에서도 트랙 링이
 * 남아 "게이지가 비어 있다"는 게 눈에 보인다.
 */
export function DuesOverallRateGauge({ rate }: { rate: number }) {
  const clamped = Number.isFinite(rate) ? Math.min(100, Math.max(0, rate)) : 0;

  const config = {
    rate: { label: "전체 납부율", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  const chartData = [
    { name: "rate", value: clamped, fill: "var(--color-rate)" },
  ];

  return (
    <ChartContainer config={config} className="aspect-auto h-[140px] w-[140px]">
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius="72%"
        outerRadius="100%"
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {clamped}%
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="value"
          background
          cornerRadius={8}
          angleAxisId={0}
          fill="var(--color-rate)"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

/**
 * 회비 항목 하나의 **상태 분포**를 한 줄 스택 막대로 보여준다 (Task 024).
 *
 * ⚠️ 이전에는 같은 자리에 "멤버별 납부율 가로 막대 차트"가 있었는데, Y축에 멤버 이름을 그리는 구조라
 * 360px에서 라벨이 잘렸다(이름을 설정하지 않은 계정은 긴 이메일로 폴백되기 때문 — Task 022가
 * 남긴 관찰). 게다가 바로 아래 멤버 목록이 같은 수치를 다시 보여줘 정보가 중복이었다.
 * 그래서 차트는 **이름 라벨이 필요 없는 분포 요약**만 맡고, 멤버별 진행률은 목록의 각 행에
 * `DuesMemberProgressBar`로 붙였다. 폭이 좁아져도 잘릴 라벨 자체가 없다.
 */
export function DuesStatusBreakdownChart({
  countByStatus,
  labels,
}: {
  countByStatus: Record<DuesStatus, number>;
  labels: Dictionary["dues"]["status"];
}) {
  const total = STATUS_ORDER.reduce(
    (sum, status) => sum + countByStatus[status],
    0,
  );

  if (total === 0) return null;

  const config = Object.fromEntries(
    STATUS_ORDER.map((status) => [
      status,
      { label: labels[status], color: STATUS_COLOR[status] },
    ]),
  ) satisfies ChartConfig;

  const chartData = [
    {
      name: "breakdown",
      ...Object.fromEntries(
        STATUS_ORDER.map((status) => [status, countByStatus[status]]),
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={config} className="aspect-auto h-[44px] w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 0, right: 0, top: 4, bottom: 4 }}
        >
          <XAxis type="number" domain={[0, total]} hide />
          <YAxis type="category" dataKey="name" hide />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          {STATUS_ORDER.map((status) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="breakdown"
              fill={STATUS_COLOR[status]}
              radius={4}
              barSize={24}
              // 애니메이션을 끈다. 폭이 바뀔 때마다(회전·리사이즈) 0에서 다시 자라느라 막대가 잠깐
              // 사라지는데, 한 줄짜리 정적 요약에는 그 연출이 득보다 실이 크다.
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {STATUS_ORDER.map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {labels[status]}
            <span className="font-semibold text-foreground">
              {countByStatus[status]}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 멤버 한 명의 납부 진행률 바.
 *
 * 공용 `components/ui/progress.tsx`는 인디케이터 색이 `bg-primary`로 고정이라 상태별(완납/부분납부/
 * 미납) 색 구분을 할 수 없다. 여러 화면이 공유하는 shadcn 프리미티브를 회비 사정에 맞춰 고치는 대신
 * 회비 전용 바를 여기에 둔다(색 정의도 차트와 한 곳에서 관리된다).
 */
export function DuesMemberProgressBar({
  dueAmount,
  paidAmount,
  status,
  label,
}: {
  dueAmount: number;
  paidAmount: number;
  status: DuesStatus;
  label: string;
}) {
  const percent = dueProgressPercent(dueAmount, paidAmount);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${percent}%`,
          backgroundColor: STATUS_COLOR[status],
        }}
      />
    </div>
  );
}
