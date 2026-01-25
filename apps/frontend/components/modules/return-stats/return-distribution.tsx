"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";

// 模拟分布数据
const distributionData = [
  { range: "< -5%", count: 15, percentage: 5 },
  { range: "-5% ~ -3%", count: 28, percentage: 10 },
  { range: "-3% ~ -1%", count: 45, percentage: 15 },
  { range: "-1% ~ 0%", count: 52, percentage: 18 },
  { range: "0% ~ 1%", count: 58, percentage: 20 },
  { range: "1% ~ 3%", count: 48, percentage: 16 },
  { range: "3% ~ 5%", count: 32, percentage: 11 },
  { range: "> 5%", count: 15, percentage: 5 },
];

export function ReturnDistributionModule({ instance, definition }: ModuleProps) {
  const maxPercentage = Math.max(...distributionData.map((d) => d.percentage));

  return (
    <div className="space-y-2">
      {distributionData.map((item) => (
        <div key={item.range} className="flex items-center gap-2 text-sm">
          <span className="w-24 text-right text-[var(--muted-foreground)]">
            {item.range}
          </span>
          <div className="flex-1 h-6 bg-[var(--muted)] rounded overflow-hidden">
            <div
              className={`h-full ${
                item.range.includes("-") ? "bg-red-400" : "bg-green-400"
              }`}
              style={{ width: `${(item.percentage / maxPercentage) * 100}%` }}
            />
          </div>
          <span className="w-12 text-right text-[var(--foreground)]">
            {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

registerModule(
  {
    id: "return-distribution",
    name: "收益率分布",
    category: "return-stats",
    description: "展示收益分布直方图",
    displayType: "chart",
    defaultConfig: {
      chartHeight: 250,
    },
  },
  ReturnDistributionModule,
  chartModuleSchema
);
