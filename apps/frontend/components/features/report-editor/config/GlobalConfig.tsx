'use client';

import React from 'react';
import { useReportEditorStore } from '@/stores';

export function GlobalConfig() {
  const { config, updateConfig } = useReportEditorStore();

  return (
    <div className="p-4 space-y-6">
      {/* 基础设置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">基础设置</h4>
        <div className="space-y-4">
          {/* 报告名称 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">报告名称</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 显示页码 */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">显示页码</label>
            <button
              onClick={() =>
                updateConfig({ showPageNumbers: !config.showPageNumbers })
              }
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config.showPageNumbers ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  config.showPageNumbers ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* 显示目录 */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">显示目录</label>
            <button
              onClick={() =>
                updateConfig({
                  showTableOfContents: !config.showTableOfContents,
                })
              }
              className={`relative w-10 h-6 rounded-full transition-colors ${
                config.showTableOfContents ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  config.showTableOfContents ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 样式设置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">样式设置</h4>
        <div className="space-y-4">
          {/* 主题 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">主题</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateConfig({ theme: 'light' })}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  config.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                浅色
              </button>
              <button
                onClick={() => updateConfig({ theme: 'dark' })}
                className={`flex-1 py-2 text-sm rounded-lg border ${
                  config.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                深色
              </button>
            </div>
          </div>

          {/* 主题色 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">主题色</label>
            <div className="flex gap-2">
              {[
                '#0F5FFE', // 蓝色
                '#10B981', // 绿色
                '#F59E0B', // 橙色
                '#EF4444', // 红色
                '#8B5CF6', // 紫色
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => updateConfig({ primaryColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    config.primaryColor === color
                      ? 'border-gray-800'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* 字体大小 */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">字体大小</label>
            <div className="flex gap-2">
              {[
                { value: 'small', label: '小' },
                { value: 'medium', label: '中' },
                { value: 'large', label: '大' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateConfig({
                      fontSize: option.value as 'small' | 'medium' | 'large',
                    })
                  }
                  className={`flex-1 py-2 text-sm rounded-lg border ${
                    config.fontSize === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
