"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { VoteResult } from "@/lib/woodong/votes";

/** 선택지 색상 — 코럴/앰버 브랜드 팔레트(`--chart-1`~`--chart-5`)를 선택지 순서대로 순환 배정한다. */
const OPTION_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

/**
 * 투표 선택지별 응답 수를 가로 막대로 표현한다. 실명/익명 분기(투표자 이름 노출 여부)는
 * 이 컴포넌트가 아니라 호출부(`VoteDetail`)가 기존 텍스트 목록으로 그대로 유지한다 —
 * 툴크 전용으로 숨기면 터치 기기에서 이름을 확인할 방법이 없어지기 때문이다.
 */
export function VoteResultsChart({
  results,
  responseCountSuffix,
}: {
  results: VoteResult[];
  responseCountSuffix: string;
}) {
  const sorted = [...results].sort((a, b) => a.sort_order - b.sort_order);
  const chartData = sorted.map((r, index) => ({
    id: r.option_id,
    label: r.label,
    count: r.response_count,
    fill: OPTION_COLORS[index % OPTION_COLORS.length],
  }));

  if (chartData.length === 0) {
    return null;
  }

  // 전원 0표인 극단 케이스에서도 X축 스케일이 0~0이 되어 깨지지 않도록 최소 1로 보정한다.
  const maxCount = Math.max(1, ...chartData.map((d) => d.count));

  const config = {
    count: { label: `응답 수(${responseCountSuffix})` },
  } satisfies ChartConfig;

  const height = Math.max(96, chartData.length * 40 + 16);

  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height }}
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          allowDecimals={false}
          domain={[0, maxCount]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={88}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={4} barSize={18}>
          {chartData.map((entry) => (
            <Cell key={entry.id} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
