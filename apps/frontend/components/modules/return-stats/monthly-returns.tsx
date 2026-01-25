"use client";

import { ModuleProps, registerModule } from "@/lib/modules";

// 月度收益热力图颜色
function getHeatmapColor(value: number): string {
  if (value > 5) return "bg-green-600 text-white";
  if (value > 2) return "bg-green-400 text-white";
  if (value > 0) return "bg-green-200 text-green-800";
  if (value === 0) return "bg-gray-100 text-gray-600";
  if (value > -2) return "bg-red-200 text-red-800";
  if (value > -5) return "bg-red-400 text-white";
  return "bg-red-600 text-white";
}

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const years = ["2024", "2023", "2022", "2021"];

// 模拟月度收益数据
function getMockData(): Record<string, number[]> {
  return {
    "2024": [2.5, 1.2, -0.8, 3.5, -1.2, 2.8, 1.5, -2.3, 4.2, 1.8, 2.1, 0],
    "2023": [1.8, -1.5, 2.3, 0.8, -2.1, 1.5, 3.2, -0.5, 1.2, -1.8, 2.5, 1.2],
    "2022": [-3.5, -2.1, -1.8, -4.2, 2.5, 3.8, -1.5, 0.8, -2.5, -3.2, 1.5, -2.8],
    "2021": [5.2, 2.8, 1.5, 3.2, -1.2, 2.5, 4.5, 1.8, -0.5, 3.8, 2.1, 1.5],
  };
}

export function MonthlyReturnsModule({ instance, definition }: ModuleProps) {
  const data = getMockData();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-medium text-[var(--muted-foreground)]">年份</th>
            {months.map((m) => (
              <th key={m} className="px-2 py-1 text-center font-medium text-[var(--muted-foreground)]">
                {m}
              </th>
            ))}
            <th className="px-2 py-1 text-center font-medium text-[var(--muted-foreground)]">年度</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => {
            const yearData = data[year] || [];
            const yearTotal = yearData.reduce((sum, v) => sum + v, 0);
            return (
              <tr key={year}>
                <td className="px-2 py-1 font-medium text-[var(--foreground)]">{year}</td>
                {yearData.map((value, idx) => (
                  <td
                    key={idx}
                    className={`px-2 py-1 text-center ${getHeatmapColor(value)}`}
                  >
                    {value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`}
                  </td>
                ))}
                <td
                  className={`px-2 py-1 text-center font-medium ${getHeatmapColor(yearTotal)}`}
                >
                  {yearTotal > 0 ? `+${yearTotal.toFixed(1)}%` : `${yearTotal.toFixed(1)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

registerModule(
  {
    id: "monthly-returns",
    name: "月度收益",
    category: "return-stats",
    description: "月度收益热力图展示",
    displayType: "table",
  },
  MonthlyReturnsModule
);
