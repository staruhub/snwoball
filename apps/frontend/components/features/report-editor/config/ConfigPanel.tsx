'use client';

import React, { useState } from 'react';
import { Settings, Sliders } from 'lucide-react';
import { GlobalConfig } from './GlobalConfig';
import { ModuleConfig } from './ModuleConfig';
import { useReportEditorStore } from '@/stores';

type TabType = 'global' | 'module';

export function ConfigPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('global');
  const { selectedModuleId } = useReportEditorStore();

  // 当选中模块时自动切换到模块配置
  React.useEffect(() => {
    if (selectedModuleId) {
      setActiveTab('module');
    }
  }, [selectedModuleId]);

  const tabs = [
    { id: 'global', icon: Settings, label: '全局配置' },
    { id: 'module', icon: Sliders, label: '模块配置' },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 配置内容 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'global' ? <GlobalConfig /> : <ModuleConfig />}
      </div>
    </div>
  );
}
