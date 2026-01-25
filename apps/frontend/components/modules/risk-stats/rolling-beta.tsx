"use client";

import { ModuleProps, registerModule, rollingChartSchema } from "@/lib/modules";
import { LineChart } from "@/components/ui/chart";

const chartLegends = [{ color: "#0F5FFE", label: "滚动Beta" }];

export function RollingBetaModule({ instance, definition }: ModuleProps) {
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
    id: "rolling-beta",
    name: "滚动Beta",
    category: "risk-stats",
    description: "展示相对基准的滚动Beta值",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 200,
      rollingWindow: "252",
    },
  },
  RollingBetaModule,
  rollingChartSchema
);
