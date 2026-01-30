"use client";

import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// 模拟数据 - 实际应从 API 获取
const MOCK_INDICES: MarketIndex[] = [
  { name: "上证指数", value: 3089.26, change: 15.32, changePercent: 0.50 },
  { name: "深证成指", value: 9876.54, change: -23.45, changePercent: -0.24 },
  { name: "创业板指", value: 1923.67, change: 8.12, changePercent: 0.42 },
  { name: "沪深300", value: 3654.21, change: 12.89, changePercent: 0.35 },
];

interface MarketOverviewProps {
  className?: string;
}

export function MarketOverview({ className = "" }: MarketOverviewProps) {
  // TODO: 从 API 获取实时市场数据
  const indices = MOCK_INDICES;

  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="font-medium text-[var(--foreground)]">市场速览</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {indices.map((index) => (
          <div
            key={index.name}
            className="p-3 bg-[var(--muted)] rounded-md"
          >
            <div className="text-xs text-[var(--muted-foreground)] mb-1">
              {index.name}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-[var(--foreground)]">
                {index.value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-sm ${
                  index.change >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {index.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {index.change >= 0 ? "+" : ""}
                {index.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-[var(--muted-foreground)] text-center">
        数据延迟约 15 分钟 · 仅供参考
      </div>
    </div>
  );
}
