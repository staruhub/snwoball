"use client";

import { ModuleProps, registerModule, chartModuleSchema } from "@/lib/modules";

// 模拟年度对比数据
const annualData = [
  { year: "2020", fund: 35.12, benchmark: 28.56, peerAvg: 25.68 },
  { year: "2021", fund: 25.68, benchmark: 18.45, peerAvg: 15.23 },
  { year: "2022", fund: -12.56, benchmark: -15.23, peerAvg: -18.56 },
  { year: "2023", fund: 8.45, benchmark: 5.23, peerAvg: 3.56 },
  { year: "2024", fund: 15.23, benchmark: 12.56, peerAvg: 10.35 },
];

function getBarColor(value: number): string {
  return value >= 0 ? "bg-green-500" : "bg-red-500";
}

export function AnnualComparisonModule({ instance, definition }: ModuleProps) {
  const maxValue = Math.max(
    ...annualData.flatMap((d) => [Math.abs(d.fund), Math.abs(d.benchmark), Math.abs(d.peerAvg)])
  );

  return (
    <div className="space-y-4">
      {/* 图例 */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#0F5FFE] rounded" />
          <span>本基金</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#9DA4B3] rounded" />
          <span>基准</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F59E0B] rounded" />
          <span>同类平均</span>
        </div>
      </div>

      {/* 柱状图 */}
      {annualData.map((item) => (
        <div key={item.year} className="flex items-center gap-3">
          <span className="w-12 text-sm text-[var(--muted-foreground)]">{item.year}</span>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                className={`h-4 rounded ${item.fund >= 0 ? "bg-[#0F5FFE]" : "bg-red-500"}`}
                style={{ width: `${(Math.abs(item.fund) / maxValue) * 100}%` }}
              />
              <span className="text-xs">{item.fund > 0 ? "+" : ""}{item.fund.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-4 rounded ${item.benchmark >= 0 ? "bg-[#9DA4B3]" : "bg-red-300"}`}
                style={{ width: `${(Math.abs(item.benchmark) / maxValue) * 100}%` }}
              />
              <span className="text-xs">{item.benchmark > 0 ? "+" : ""}{item.benchmark.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-4 rounded ${item.peerAvg >= 0 ? "bg-[#F59E0B]" : "bg-orange-300"}`}
                style={{ width: `${(Math.abs(item.peerAvg) / maxValue) * 100}%` }}
              />
              <span className="text-xs">{item.peerAvg > 0 ? "+" : ""}{item.peerAvg.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

registerModule(
  {
    id: "annual-comparison",
    name: "分年度业绩对比",
    category: "performance",
    description: "柱状图展示年度业绩对比",
    displayType: "chart",
  },
  AnnualComparisonModule,
  chartModuleSchema
);
