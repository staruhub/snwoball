'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Filter, ChevronDown, Check } from 'lucide-react';
import { useGlobalFiltersStore } from '@/stores';

interface Fund {
  id: string;
  name: string;
  code: string;
  type: string;
}

// 示例数据 - 仅在开发环境使用
const SAMPLE_FUNDS: Fund[] = [
  { id: '1', name: '易方达蓝筹精选混合', code: '005827', type: '混合型' },
  { id: '2', name: '招商中证白酒指数', code: '161725', type: '指数型' },
  { id: '3', name: '天弘中证500指数', code: '000961', type: '指数型' },
  { id: '4', name: '景顺长城新兴成长混合', code: '260108', type: '混合型' },
  { id: '5', name: '富国天惠成长混合', code: '161005', type: '混合型' },
];

// 获取基金列表 - 开发环境使用示例数据
const getFunds = (): Fund[] => {
  // TODO: 生产环境应从 API 获取
  if (process.env.NODE_ENV === 'development') {
    return SAMPLE_FUNDS;
  }
  return SAMPLE_FUNDS; // 暂时返回示例数据，待 API 接入后替换
};

type TabType = 'search' | 'recent' | 'favorite' | 'type';

export function FundSelector() {
  const { filters, setFund } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [funds] = useState<Fund[]>(() => getFunds());
  const [filteredFunds, setFilteredFunds] = useState<Fund[]>(funds);

  // 搜索过滤
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredFunds(
        funds.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            f.code.includes(query)
        )
      );
    } else {
      setFilteredFunds(funds);
    }
  }, [searchQuery, funds]);

  const handleSelectFund = (fund: Fund) => {
    setFund(fund.id, fund.name);
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
              {filteredFunds.length > 0 ? (
                filteredFunds.map((fund) => (
                  <button
                    key={fund.id}
                    onClick={() => handleSelectFund(fund)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      filters.fundId === fund.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-800">
                        {fund.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{fund.code}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                          {fund.type}
                        </span>
                      </div>
                    </div>
                    {filters.fundId === fund.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))
              ) : (
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
