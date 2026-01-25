"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { LineChart } from "@/components/ui/chart";
import { HeaderBar } from "@/components/features/header-bar";
import { FilterBar } from "@/components/features/filter-bar";
import { ConfigPanel } from "@/components/features/config-panel";
import {
  getPerformanceComparison,
  type PerformanceComparisonResponse,
} from "@/lib/api";

const returnColumns = [
  { key: "metric", header: "指标" },
  { key: "fund", header: "本基金" },
  { key: "benchmark", header: "沪深300" },
  { key: "excess", header: "超额" },
];

const chartLegends = [
  { color: "#0F5FFE", label: "本基金" },
  { color: "#9DA4B3", label: "沪深300" },
];

// 格式化百分比
function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return "-";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

// 将 API 响应转换为表格数据
function transformPerformanceData(data: PerformanceComparisonResponse | null) {
  if (!data?.metrics) {
    return [];
  }

  const m = data.metrics;
  // 后端返回的字段名格式：fund_total_return, benchmark_total_return, excess_return
  return [
    {
      metric: "累计收益",
      fund: formatPercent(m.fund_total_return as number),
      benchmark: formatPercent(m.benchmark_total_return as number),
      excess: formatPercent(m.excess_return as number),
    },
    {
      metric: "年化收益",
      fund: formatPercent(m.fund_annualized_return as number),
      benchmark: formatPercent(m.benchmark_annualized_return as number),
      excess: formatPercent(m.excess_annualized_return as number),
    },
    {
      metric: "最大回撤",
      fund: formatPercent(m.fund_max_drawdown as number),
      benchmark: formatPercent(m.benchmark_max_drawdown as number),
      excess: formatPercent(m.excess_max_drawdown as number),
    },
    {
      metric: "夏普比率",
      fund: typeof m.fund_sharpe_ratio === "number" ? (m.fund_sharpe_ratio as number).toFixed(2) : "-",
      benchmark:
        typeof m.benchmark_sharpe_ratio === "number"
          ? (m.benchmark_sharpe_ratio as number).toFixed(2)
          : "-",
      excess: "-",
    },
  ];
}

export default function FundReportPage() {
  const [reportName, setReportName] = useState("2024年度基金分析报告");
  const [fundProduct, setFundProduct] = useState("");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [benchmark, setBenchmark] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [showConfigPanel, setShowConfigPanel] = useState(true);

  // 业绩数据状态
  const [performanceData, setPerformanceData] =
    useState<PerformanceComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载业绩数据
  const loadPerformanceData = useCallback(async () => {
    if (!fundProduct || !benchmark) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getPerformanceComparison({
        fund_id: fundProduct,
        benchmark_id: benchmark,
        start_date: startDate,
        end_date: endDate,
      });

      setPerformanceData(data);
    } catch (err) {
      console.error("Failed to load performance data:", err);
      setError("加载业绩数据失败");
      setPerformanceData(null);
    } finally {
      setLoading(false);
    }
  }, [fundProduct, benchmark, startDate, endDate]);

  // 当筛选条件变化时重新加载数据
  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  // 转换为表格数据
  const returnData = transformPerformanceData(performanceData);

  return (
    <div className="flex h-full bg-[var(--background)]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="flex flex-col flex-1 h-full">
        {/* Header Bar */}
        <HeaderBar
          reportName={reportName}
          onReportNameChange={setReportName}
          onExport={() => console.log("Export clicked")}
          onSave={() => console.log("Save clicked")}
        />

        {/* Filter Bar */}
        <FilterBar
          fundProduct={fundProduct}
          startDate={startDate}
          endDate={endDate}
          benchmark={benchmark}
          frequency={frequency}
          onFundProductChange={setFundProduct}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onBenchmarkChange={setBenchmark}
          onFrequencyChange={setFrequency}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
          {/* Card 1 - 区间收益 */}
          <Card
            icon={<Table className="w-[18px] h-[18px]" />}
            title="区间收益"
          >
            {loading ? (
              <div className="flex items-center justify-center h-24 text-[var(--muted-foreground)]">
                加载中...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-24 text-red-500">
                {error}
              </div>
            ) : returnData.length > 0 ? (
              <DataTable columns={returnColumns} data={returnData} />
            ) : (
              <div className="flex items-center justify-center h-24 text-[var(--muted-foreground)]">
                请选择基金产品
              </div>
            )}
          </Card>

          {/* Card 2 - 滚动夏普比率 */}
          <Card
            icon={<TrendingUp className="w-[18px] h-[18px]" />}
            title="滚动夏普比率"
          >
            <LineChart legends={chartLegends} className="h-[200px]" />
          </Card>
        </div>
      </main>

      {/* Right Config Panel */}
      {showConfigPanel && (
        <ConfigPanel onClose={() => setShowConfigPanel(false)} />
      )}
    </div>
  );
}
