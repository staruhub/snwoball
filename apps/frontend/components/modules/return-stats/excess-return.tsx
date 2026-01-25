"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [{ color: "#10B981", label: "超额收益" }];

export function ExcessReturnModule({ instance, definition }: ModuleProps) {
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
    id: "excess-return",
    name: "超额收益走势",
    category: "return-stats",
    description: "展示超额收益曲线",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      showLegend: true,
    },
  },
  ExcessReturnModule,
  chartModuleSchema
);
