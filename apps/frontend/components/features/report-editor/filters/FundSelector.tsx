'use client';

import React, { useState } from 'react';
import { Search, Star, Clock, Filter, ChevronDown, Check, Loader2, RefreshCw } from 'lucide-react';
import { useGlobalFiltersStore } from '@/stores';
import { useFunds, useDebounce } from '@/hooks';

// 基金类型映射
const FUND_TYPE_MAP: Record<number, string> = {
  1: '股票型',
  2: '混合型',
  3: '债券型',
  4: '指数型',
  5: '货币型',
  6: 'QDII',
  7: 'FOF',
};

type TabType = 'search' | 'recent' | 'favorite' | 'type';

export function FundSelector() {
  const { filters, setFund } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');

  // 使用防抖搜索
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 使用真实 API 获取基金列表
  const { funds, isLoading, isError, refetch } = useFunds({
    keyword: debouncedSearch,
    pageSize: 50,
    enabled: isOpen, // 仅在下拉框打开时获取数据
  });

  const handleSelectFund = (fundId: string, fundName: string) => {
    setFund(fundId, fundName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const tabs = [
    { id: 'search', icon: Search, label: '搜索' },
    { id: 'recent', icon: Clock, label: '最近' },
    { id: 'favorite', icon: Star, label: '关注' },
    { id: 'type', icon: Filter, label: '分类' },
  ] as const;

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px]"
      >
        <span className="text-sm text-gray-500">基金:</span>
        <span className="flex-1 text-sm font-medium text-left truncate">
          {filters.fundName || '请选择基金'}
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
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Tab 切换 */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            {activeTab === 'search' && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入基金名称或代码..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* 基金列表 */}
            <div className="max-h-64 overflow-y-auto">
              {/* 加载状态 */}
              {isLoading && (
                <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}

              {/* 错误状态 */}
              {isError && !isLoading && (
                <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-sm mb-2">加载失败</span>
                  <button
                    onClick={() => refetch()}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重试
                  </button>
                </div>
              )}

              {/* 基金列表 */}
              {!isLoading && !isError && funds.length > 0 && (
                funds.map((fund) => (
                  <button
                    key={fund.id}
                    onClick={() => handleSelectFund(String(fund.id), fund.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      filters.fundId === String(fund.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-800">
                        {fund.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{fund.code}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                          {FUND_TYPE_MAP[fund.fund_type] || '其他'}
                        </span>
                      </div>
                    </div>
                    {filters.fundId === String(fund.id) && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))
              )}

              {/* 空状态 */}
              {!isLoading && !isError && funds.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  未找到匹配的基金
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
