'use client';

import React, { useState } from 'react';
import { TrendingUp, ChevronDown, Check, Search } from 'lucide-react';
import { useGlobalFiltersStore } from '@/stores';

interface Benchmark {
  id: string;
  name: string;
  code: string;
  category: string;
}

// 模拟数据
const BENCHMARKS: Benchmark[] = [
  { id: '1', name: '沪深300', code: '000300', category: '宽基指数' },
  { id: '2', name: '中证500', code: '000905', category: '宽基指数' },
  { id: '3', name: '上证指数', code: '000001', category: '宽基指数' },
  { id: '4', name: '创业板指', code: '399006', category: '宽基指数' },
  { id: '5', name: '中证消费', code: '000932', category: '行业指数' },
  { id: '6', name: '中证医药', code: '000933', category: '行业指数' },
  { id: '7', name: '中证银行', code: '399986', category: '行业指数' },
  { id: '8', name: '中证新能源', code: '399808', category: '行业指数' },
];

export function BenchmarkSelector() {
  const { filters, setBenchmark } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBenchmarks = searchQuery.trim()
    ? BENCHMARKS.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.code.includes(searchQuery)
      )
    : BENCHMARKS;

  // 按分类分组
  const groupedBenchmarks = filteredBenchmarks.reduce<
    Record<string, Benchmark[]>
  >((acc, benchmark) => {
    const category = benchmark.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(benchmark);
    return acc;
  }, {});

  const handleSelect = (benchmark: Benchmark) => {
    setBenchmark(benchmark.id, benchmark.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <TrendingUp className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">基准:</span>
        <span className="text-sm font-medium">
          {filters.benchmarkName || '请选择'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* 搜索 */}
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索指数..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 分组列表 */}
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedBenchmarks).map(
                ([category, benchmarks]) => (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 font-medium">
                      {category}
                    </div>
                    {benchmarks.map((benchmark) => (
                      <button
                        key={benchmark.id}
                        onClick={() => handleSelect(benchmark)}
                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                          filters.benchmarkId === benchmark.id
                            ? 'bg-blue-50'
                            : ''
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <div className="text-sm text-gray-800">
                            {benchmark.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {benchmark.code}
                          </div>
                        </div>
                        {filters.benchmarkId === benchmark.id && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
