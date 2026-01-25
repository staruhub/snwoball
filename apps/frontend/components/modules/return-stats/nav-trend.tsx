"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#0F5FFE", label: "本基金" },
  { color: "#9DA4B3", label: "基准" },
];

export function NavTrendModule({ instance, definition }: ModuleProps) {
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
    id: "nav-trend",
    name: "净值走势图",
    category: "return-stats",
    description: "展示净值曲线与基准对比",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showBenchmark: true,
      showLegend: true,
    },
  },
  NavTrendModule,
  chartModuleSchema
);
