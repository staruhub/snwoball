"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#0F5FFE", label: "滚动1月" },
  { color: "#10B981", label: "滚动3月" },
  { color: "#F59E0B", label: "滚动1年" },
];

export function RollingReturnsModule({ instance, definition }: ModuleProps) {
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
    id: "rolling-returns",
    name: "滚动收益",
    category: "return-stats",
    description: "展示1M/3M/6M/1Y/3Y滚动收益",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showLegend: true,
    },
  },
  RollingReturnsModule,
  chartModuleSchema
);
