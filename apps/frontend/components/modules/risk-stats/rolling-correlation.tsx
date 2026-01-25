"use client";

import { ModuleProps, registerModule, rollingChartSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [{ color: "#0F5FFE", label: "滚动相关系数" }];

export function RollingCorrelationModule({ instance, definition }: ModuleProps) {
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
    id: "rolling-correlation",
    name: "滚动相关系数",
    category: "risk-stats",
    description: "展示与基准的滚动相关性",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      rollingWindow: "252",
    },
  },
  RollingCorrelationModule,
  rollingChartSchema
);
