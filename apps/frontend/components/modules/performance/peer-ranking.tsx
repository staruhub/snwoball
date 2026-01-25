"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";

// 模拟排名数据
const rankingData = [
  { period: "近1月", rank: 85, total: 1500, percentile: 5.7 },
  { period: "近3月", rank: 56, total: 1500, percentile: 3.7 },
  { period: "近6月", rank: 42, total: 1500, percentile: 2.8 },
  { period: "近1年", rank: 25, total: 1500, percentile: 1.7 },
  { period: "近3年", rank: 18, total: 1500, percentile: 1.2 },
];

export function PeerRankingModule({ instance, definition }: ModuleProps) {
  return (
    <div className="space-y-3">
      {rankingData.map((item) => (
        <div key={item.period} className="flex items-center gap-3">
          <span className="w-16 text-sm text-[var(--muted-foreground)]">
            {item.period}
          </span>
          <div className="flex-1 h-6 bg-[var(--muted)] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              style={{ width: `${100 - item.percentile}%` }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-[var(--primary)]"
              style={{ left: `${item.percentile}%` }}
            />
          </div>
          <span className="w-24 text-sm text-right text-[var(--foreground)]">
            {item.rank}/{item.total}
          </span>
          <span className="w-16 text-sm text-right text-green-600">
            前{item.percentile}%
          </span>
        </div>
      ))}
    </div>
  );
}

registerModule(
  {
    id: "peer-ranking",
    name: "同类排名",
    category: "performance",
    description: "展示在同类基金中的排名情况",
    displayType: "chart",
  },
  PeerRankingModule,
  chartModuleSchema
);
