'use client';

import React, { useState, useMemo } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useReportEditorStore, useGlobalFiltersStore } from '@/stores';

interface BatchParameterModalProps {
  open: boolean;
  onClose: () => void;
}

type ParameterType = 'date_range' | 'benchmark' | 'nav_type' | 'frequency';

interface ParameterOption {
  id: ParameterType;
  label: string;
  description: string;
}

const PARAMETER_OPTIONS: ParameterOption[] = [
  {
    id: 'date_range',
    label: '日期范围',
    description: '统一设置所有模块的分析时间范围',
  },
  {
    id: 'benchmark',
    label: '基准',
    description: '统一设置所有模块的比较基准',
  },
  {
    id: 'nav_type',
    label: '净值类型',
    description: '统一使用复权净值或单位净值',
  },
  {
    id: 'frequency',
    label: '数据频率',
    description: '统一设置日/周/月频率',
  },
];

export function BatchParameterModal({ open, onClose }: BatchParameterModalProps) {
  const { modules, updateModuleConfig } = useReportEditorStore();
  const { filters: globalFilters } = useGlobalFiltersStore();
  const [selectedParams, setSelectedParams] = useState<ParameterType[]>([]);
  const [applyToLocked, setApplyToLocked] = useState(false);

  // 统计受影响的模块数量
  const affectedModulesCount = useMemo(() => {
    if (applyToLocked) {
      return modules.length;
    }
    return modules.filter((m) => !m.isLocked).length;
  }, [modules, applyToLocked]);

  const handleToggleParam = (paramId: ParameterType) => {
    setSelectedParams((prev) =>
      prev.includes(paramId)
        ? prev.filter((p) => p !== paramId)
        : [...prev, paramId]
    );
  };

  const handleApply = () => {
    // 筛选需要更新的模块
    const targetModules = applyToLocked
      ? modules
      : modules.filter((m) => !m.isLocked);

    // 批量更新模块配置
    targetModules.forEach((module) => {
      const updates: Record<string, unknown> = {};

      if (selectedParams.includes('date_range')) {
        updates.startDate = globalFilters.dateRange.startDate;
        updates.endDate = globalFilters.dateRange.endDate;
      }
      if (selectedParams.includes('benchmark')) {
        updates.benchmarkId = globalFilters.benchmarkId;
      }
      if (selectedParams.includes('nav_type')) {
        updates.navType = globalFilters.navType;
      }
      if (selectedParams.includes('frequency')) {
        updates.frequency = globalFilters.frequency;
      }

      if (Object.keys(updates).length > 0) {
        updateModuleConfig(module.id, updates);
      }
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">批量设置参数</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 参数选择 */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            选择要批量应用到所有模块的全局参数：
          </p>

          <div className="space-y-2">
            {PARAMETER_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedParams.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedParams.includes(option.id)}
                  onChange={() => handleToggleParam(option.id)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          {/* 锁定模块选项 */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToLocked}
                onChange={(e) => setApplyToLocked(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                包括已锁定参数的模块
              </span>
            </label>
          </div>

          {/* 影响提示 */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              此操作将影响 {affectedModulesCount} 个模块的配置
              {!applyToLocked && modules.some((m) => m.isLocked) && (
                <span>（已锁定的模块不受影响）</span>
              )}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={selectedParams.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            应用到 {affectedModulesCount} 个模块
          </button>
        </div>
      </div>
    </div>
  );
}
