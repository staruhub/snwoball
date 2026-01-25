"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";
import { DataTable } from "@/components/ui/data-table";

const columns = [
  { key: "period", header: "报告期" },
  { key: "turnover", header: "换手率" },
  { key: "peerAvg", header: "同类平均" },
  { key: "diff", header: "偏离" },
];

function getMockData() {
  return [
    { period: "2024Q3", turnover: "125.6%", peerAvg: "185.3%", diff: "-59.7%" },
    { period: "2024Q2", turnover: "156.8%", peerAvg: "198.5%", diff: "-41.7%" },
    { period: "2024Q1", turnover: "138.5%", peerAvg: "175.2%", diff: "-36.7%" },
    { period: "2023Q4", turnover: "168.2%", peerAvg: "205.6%", diff: "-37.4%" },
    { period: "2023Q3", turnover: "145.6%", peerAvg: "189.3%", diff: "-43.7%" },
    { period: "2023Q2", turnover: "132.5%", peerAvg: "178.6%", diff: "-46.1%" },
  ];
}

export function TurnoverAnalysisModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
      <div className="text-sm text-[var(--muted-foreground)] p-3 bg-[var(--muted)] rounded">
        换手率分析：该基金换手率持续低于同类平均，说明基金经理偏好长期持有，交易风格稳健。
      </div>
    </div>
  );
}

registerModule(
  {
    id: "turnover-analysis",
    name: "换手率分析",
    category: "portfolio",
    description: "展示换手率变化及与同类对比",
    displayType: "mixed",
  },
  TurnoverAnalysisModule,
  chartModuleSchema
);
