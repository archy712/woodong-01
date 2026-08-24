"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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

/** 사이클 전체 납부율을 표시하는 단일 게이지(RadialBarChart). */
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
        endAngle={90 - (360 * clamped) / 100}
        innerRadius="72%"
        outerRadius="100%"
      >
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        >
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
          fill="var(--color-rate)"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

export interface DuesMemberRateEntry {
  id: string;
  name: string;
  percent: number;
  status: DuesStatus;
}

/** 멤버별 납부율을 상태 색상으로 구분한 가로 막대 차트. */
export function DuesMemberRateChart({
  members,
  labels,
}: {
  members: DuesMemberRateEntry[];
  labels: Dictionary["dues"]["status"];
}) {
  const chartData = members.map((m) => ({
    id: m.id,
    name: m.name,
    percent: Number.isFinite(m.percent)
      ? Math.min(100, Math.max(0, m.percent))
      : 0,
    status: m.status,
    fill: STATUS_COLOR[m.status],
  }));

  if (chartData.length === 0) {
    return null;
  }

  const config = {
    percent: { label: "납부율(%)" },
  } satisfies ChartConfig;

  const height = Math.max(96, chartData.length * 32 + 24);

  return (
    <div className="flex flex-col gap-2">
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
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="percent" radius={4} barSize={16}>
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {(Object.keys(STATUS_COLOR) as DuesStatus[]).map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[key] }}
            />
            {labels[key]}
          </span>
        ))}
      </div>
    </div>
  );
}
