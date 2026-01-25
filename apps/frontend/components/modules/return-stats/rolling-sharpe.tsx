"use client";

import { ModuleProps, registerModule, rollingChartSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#0F5FFE", label: "本基金" },
  { color: "#9DA4B3", label: "基准" },
];

export function RollingSharpeModule({ instance, definition }: ModuleProps) {
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
    id: "rolling-sharpe",
    name: "滚动夏普比率",
    category: "return-stats",
    description: "展示滚动窗口的夏普比率变化",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      rollingWindow: "252",
      showBenchmark: true,
    },
  },
  RollingSharpeModule,
  rollingChartSchema
);
