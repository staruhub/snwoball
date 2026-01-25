'use client';

import React from 'react';
import { useReportEditorStore } from '@/stores';
import { TopActionBar } from './TopActionBar';
import { CollapsiblePanel } from './CollapsiblePanel';
import { ModuleNavigation } from '../navigation';
import { Canvas } from '../canvas';
import { ConfigPanel } from '../config';
import { GlobalFiltersBar } from '../filters';

interface EditorLayoutProps {
  onSave?: () => void;
  onExport?: () => void;
}

export function EditorLayout({ onSave, onExport }: EditorLayoutProps) {
  const {
    isLeftPanelCollapsed,
    isRightPanelCollapsed,
    toggleLeftPanel,
    toggleRightPanel,
  } = useReportEditorStore();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部操作栏 */}
      <TopActionBar onSave={onSave} onExport={onExport} />

      {/* 全局筛选条件 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <GlobalFiltersBar />
      </div>

      {/* 主体区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧导航面板 */}
        <CollapsiblePanel
          isCollapsed={isLeftPanelCollapsed}
          onToggle={toggleLeftPanel}
          position="left"
          width={280}
        >
          <ModuleNavigation />
        </CollapsiblePanel>

        {/* 中间画布 */}
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>

        {/* 右侧配置面板 */}
        <CollapsiblePanel
          isCollapsed={isRightPanelCollapsed}
          onToggle={toggleRightPanel}
          position="right"
          width={320}
        >
          <ConfigPanel />
        </CollapsiblePanel>
      </div>
    </div>
  );
}
