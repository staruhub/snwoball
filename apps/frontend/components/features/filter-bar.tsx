"use client";

import { useEffect, useState } from "react";
import { SelectGroup } from "../ui/select-group";
import {
  getPublicFunds,
  getActiveBenchmarks,
  type FundProfile,
  type BenchmarkInfo,
} from "@/lib/api";

interface FilterBarProps {
  fundProduct: string;
  startDate: string;
  endDate: string;
  benchmark: string;
  frequency: string;
  onFundProductChange?: (value: string) => void;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  onBenchmarkChange?: (value: string) => void;
  onFrequencyChange?: (value: string) => void;
}

// 日期选项生成函数
function generateDateOptions() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const dates: { value: string; label: string }[] = [];

  // 生成过去3年的日期选项
  for (let year = currentYear; year >= currentYear - 3; year--) {
    dates.push({ value: `${year}-01-01`, label: `${year}-01-01` });
    dates.push({ value: `${year}-12-31`, label: `${year}-12-31` });
  }

  return dates;
}

const dateOptions = generateDateOptions();

const frequencyOptions = [
  { value: "daily", label: "日频" },
  { value: "weekly", label: "周频" },
  { value: "monthly", label: "月频" },
];

export function FilterBar({
  fundProduct,
  startDate,
  endDate,
  benchmark,
  frequency,
  onFundProductChange,
  onStartDateChange,
  onEndDateChange,
  onBenchmarkChange,
  onFrequencyChange,
}: FilterBarProps) {
  const [funds, setFunds] = useState<FundProfile[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载基金列表和基准列表
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 并行加载基金和基准列表
        const [fundsResponse, benchmarksResponse] = await Promise.all([
          getPublicFunds({ page_size: 100 }),
          getActiveBenchmarks(),
        ]);

        if (!cancelled) {
          setFunds(fundsResponse.items);
          setBenchmarks(benchmarksResponse);

          // 如果当前没有选中基金，自动选择第一个
          if (!fundProduct && fundsResponse.items.length > 0) {
            onFundProductChange?.(fundsResponse.items[0].id);
          }

          // 如果当前没有选中基准，自动选择第一个
          if (!benchmark && benchmarksResponse.length > 0) {
            onBenchmarkChange?.(benchmarksResponse[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load data:", err);
          setError("加载数据失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // 生成基金选项
  const fundOptions = funds.map((fund) => ({
    value: fund.id,
    label: fund.short_name || fund.name,
  }));

  // 生成基准选项
  const benchmarkOptions = benchmarks.map((bm) => ({
    value: bm.id,
    label: bm.short_name || bm.name,
  }));

  // 如果正在加载或者没有数据，显示占位选项
  if (loading) {
    fundOptions.unshift({ value: "", label: "加载中..." });
    benchmarkOptions.unshift({ value: "", label: "加载中..." });
  } else if (error) {
    fundOptions.unshift({ value: "", label: error });
  } else {
    if (fundOptions.length === 0) {
      fundOptions.push({ value: "", label: "暂无基金" });
    }
    if (benchmarkOptions.length === 0) {
      benchmarkOptions.push({ value: "", label: "暂无基准" });
    }
  }

  return (
    <div className="flex items-center gap-6 h-14 px-8 py-2 bg-[var(--card)] border-b border-[var(--border)]">
      <SelectGroup
        label="基金产品"
        value={fundProduct}
        onChange={onFundProductChange}
        options={fundOptions}
        className="w-[220px]"
      />

      <SelectGroup
        label="开始日期"
        value={startDate}
        onChange={onStartDateChange}
        options={dateOptions}
        className="w-40"
      />

      <SelectGroup
        label="结束日期"
        value={endDate}
        onChange={onEndDateChange}
        options={dateOptions}
        className="w-40"
      />

      <SelectGroup
        label="基准指数"
        value={benchmark}
        onChange={onBenchmarkChange}
        options={benchmarkOptions}
        className="w-[180px]"
      />

      <SelectGroup
        label="频率"
        value={frequency}
        onChange={onFrequencyChange}
        options={frequencyOptions}
        className="w-[140px]"
      />
    </div>
  );
}
