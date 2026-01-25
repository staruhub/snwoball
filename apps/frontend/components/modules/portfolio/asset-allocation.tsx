"use client";

import { ModuleProps, registerModule, holdingSchema } from "@/lib/modules";

// 模拟资产配置数据
const allocationData = [
  { type: "股票", ratio: 78.5, color: "#0F5FFE" },
  { type: "债券", ratio: 12.3, color: "#10B981" },
  { type: "现金", ratio: 6.2, color: "#F59E0B" },
  { type: "其他", ratio: 3.0, color: "#9DA4B3" },
];

export function AssetAllocationModule({ instance, definition }: ModuleProps) {
  return (
    <div className="flex gap-8">
      {/* 饼图占位 */}
      <div className="w-48 h-48 rounded-full bg-[var(--muted)] flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* 简化的饼图效果 */}
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(
                ${allocationData[0].color} 0% ${allocationData[0].ratio}%,
                ${allocationData[1].color} ${allocationData[0].ratio}% ${allocationData[0].ratio + allocationData[1].ratio}%,
                ${allocationData[2].color} ${allocationData[0].ratio + allocationData[1].ratio}% ${allocationData[0].ratio + allocationData[1].ratio + allocationData[2].ratio}%,
                ${allocationData[3].color} ${allocationData[0].ratio + allocationData[1].ratio + allocationData[2].ratio}% 100%
              )`,
            }}
          />
          <div className="absolute inset-8 rounded-full bg-[var(--card)]" />
        </div>
      </div>

      {/* 图例 */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {allocationData.map((item) => (
          <div key={item.type} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-sm text-[var(--foreground)]">{item.type}</span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {item.ratio.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

registerModule(
  {
    id: "asset-allocation",
    name: "资产配置",
    category: "portfolio",
    description: "展示股票、债券、现金等资产配置",
    displayType: "chart",
  },
  AssetAllocationModule,
  holdingSchema
);
