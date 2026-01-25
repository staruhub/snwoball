"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [
  { color: "#0F5FFE", label: "本基金" },
  { color: "#9DA4B3", label: "基准" },
];

export function CumulativeReturnModule({ instance, definition }: ModuleProps) {
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
    id: "cumulative-return",
    name: "累计收益走势",
    category: "return-stats",
    description: "展示累计收益曲线",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showBenchmark: true,
      showLegend: true,
    },
  },
  CumulativeReturnModule,
  chartModuleSchema
);
