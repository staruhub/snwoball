"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#EF4444", label: "本基金回撤" },
  { color: "#9DA4B3", label: "基准回撤" },
];

export function DynamicDrawdownModule({ instance, definition }: ModuleProps) {
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
    id: "dynamic-drawdown",
    name: "动态回撤",
    category: "risk-stats",
    description: "展示动态回撤曲线",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showBenchmark: true,
    },
  },
  DynamicDrawdownModule,
  chartModuleSchema
);
