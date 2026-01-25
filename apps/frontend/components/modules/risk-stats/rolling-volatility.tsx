"use client";

import { ModuleProps, registerModule, rollingChartSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#0F5FFE", label: "本基金" },
  { color: "#9DA4B3", label: "基准" },
];

export function RollingVolatilityModule({ instance, definition }: ModuleProps) {
  const height = (instance.config?.chartHeight as number) || 200;

  return (
    <LineChart
      legends={chartLegends}
      style={{ height }}
    />
  );
}

registerModule(
  {
    id: "rolling-volatility",
    name: "滚动波动率",
    category: "risk-stats",
    description: "展示滚动窗口的年化波动率",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      rollingWindow: "252",
      showBenchmark: true,
    },
  },
  RollingVolatilityModule,
  rollingChartSchema
);
