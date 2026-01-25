"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [{ color: "#0F5FFE", label: "基金规模" }];

export function HistoricalAumModule({ instance, definition }: ModuleProps) {
  const height = (instance.config?.chartHeight as number) || 200;

  return (
    <LineChart
      legends={chartLegends}
      className={`h-[${height}px]`}
      style={{ height }}
    />
  );
}

registerModule(
  {
    id: "historical-aum",
    name: "历史规模",
    category: "product-info",
    description: "展示基金规模变化图表",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showLegend: true,
    },
  },
  HistoricalAumModule,
  chartModuleSchema
);
