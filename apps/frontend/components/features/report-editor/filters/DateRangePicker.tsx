'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { useGlobalFiltersStore, GlobalFilters } from '@/stores';

type DateRangeType = GlobalFilters['dateRange']['type'];

interface QuickOption {
  type: DateRangeType;
  label: string;
}

const QUICK_OPTIONS: QuickOption[] = [
  { type: 'since_inception', label: '成立以来' },
  { type: 'ytd', label: '今年以来' },
  { type: '1y', label: '近1年' },
  { type: '3y', label: '近3年' },
  { type: '5y', label: '近5年' },
  { type: 'custom', label: '自定义' },
];

export function DateRangePicker() {
  const { filters, setDateRange } = useGlobalFiltersStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(
    filters.dateRange.startDate || ''
  );
  const [customEndDate, setCustomEndDate] = useState(
    filters.dateRange.endDate || ''
  );

  // 同步外部状态变化
  useEffect(() => {
    setCustomStartDate(filters.dateRange.startDate || '');
    setCustomEndDate(filters.dateRange.endDate || '');
  }, [filters.dateRange.startDate, filters.dateRange.endDate]);

  const currentOption = QUICK_OPTIONS.find(
    (o) => o.type === filters.dateRange.type
  );

  const handleSelectOption = (option: QuickOption) => {
    if (option.type === 'custom') {
      // 自定义需要保持面板打开
      setDateRange({
        type: 'custom',
        startDate: customStartDate || null,
        endDate: customEndDate || null,
      });
    } else {
      setDateRange({
        type: option.type,
        startDate: null,
        endDate: null,
      });
      setIsOpen(false);
    }
  };

  const handleApplyCustom = () => {
    setDateRange({
      type: 'custom',
      startDate: customStartDate || null,
      endDate: customEndDate || null,
    });
    setIsOpen(false);
  };

  const displayLabel = () => {
    if (filters.dateRange.type === 'custom') {
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        return `${filters.dateRange.startDate} ~ ${filters.dateRange.endDate}`;
      }
      return '自定义';
    }
    return currentOption?.label || '请选择';
  };

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">日期:</span>
        <span className="text-sm font-medium">{displayLabel()}</span>
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
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* 快捷选项 */}
            <div className="p-2 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-2">
                {QUICK_OPTIONS.filter((o) => o.type !== 'custom').map(
                  (option) => (
                    <button
                      key={option.type}
                      onClick={() => handleSelectOption(option)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        filters.dateRange.type === option.type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 自定义日期 */}
            <div className="p-3">
              <div className="text-xs text-gray-500 mb-2">自定义日期范围</div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleApplyCustom}
                className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                应用
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
