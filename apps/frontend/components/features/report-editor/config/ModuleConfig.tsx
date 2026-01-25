'use client';

import React from 'react';
import { Lock, Unlock, Info } from 'lucide-react';
import { useReportEditorStore } from '@/stores';
import { getModuleById } from '../navigation/module-registry';

export function ModuleConfig() {
  const { modules, selectedModuleId, updateModuleTitle, updateModuleHeight, toggleModuleLock } =
    useReportEditorStore();

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const moduleDef = selectedModule
    ? getModuleById(selectedModule.moduleType)
    : null;

  if (!selectedModule) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p className="text-sm">请先选择一个模块</p>
        <p className="text-xs mt-1">点击画布中的模块卡片进行配置</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* 模块信息 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-800">
              {selectedModule.title}
            </h4>
            {moduleDef && (
              <p className="text-xs text-gray-500 mt-1">{moduleDef.description}</p>
            )}
          </div>
          <button className="p-1 hover:bg-gray-200 rounded" title="模块说明">
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 参数锁定 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-800">参数设置</h4>
          <button
            onClick={() => toggleModuleLock(selectedModule.id)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
              selectedModule.isLocked
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {selectedModule.isLocked ? (
              <>
                <Lock className="w-3 h-3" />
                已锁定
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3" />
                跟随全局
              </>
            )}
          </button>
        </div>

        {selectedModule.isLocked && (
          <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            参数已锁定，将独立于全局筛选条件
          </p>
        )}

        <div className="space-y-4">
          {/* 模块标题 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">模块标题</label>
            <input
              type="text"
              value={selectedModule.title}
              onChange={(e) => updateModuleTitle(selectedModule.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 显示配置 - 根据模块类型可以扩展 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">显示高度</label>
            <select
              value={selectedModule.height}
              onChange={(e) => updateModuleHeight(selectedModule.id, Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={200}>小 (200px)</option>
              <option value={300}>中 (300px)</option>
              <option value={400}>大 (400px)</option>
              <option value={500}>特大 (500px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 数据配置 - 可根据模块类型扩展 */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">数据配置</h4>
        <div className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
          此模块暂无自定义数据配置
        </div>
      </div>
    </div>
  );
}
