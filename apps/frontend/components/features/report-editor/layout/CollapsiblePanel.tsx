'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapsiblePanelProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
  width?: number;
}

export function CollapsiblePanel({
  children,
  isCollapsed,
  onToggle,
  position,
  width = 280,
}: CollapsiblePanelProps) {
  return (
    <div
      className={`relative bg-white border-gray-200 transition-all duration-300 ${
        position === 'left' ? 'border-r' : 'border-l'
      }`}
      style={{ width: isCollapsed ? 0 : width }}
    >
      {/* 内容区域 */}
      <div
        className={`h-full overflow-hidden ${
          isCollapsed ? 'invisible' : 'visible'
        }`}
        style={{ width }}
      >
        {children}
      </div>

      {/* 折叠/展开按钮 */}
      <button
        onClick={onToggle}
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-10 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-10 ${
          position === 'left'
            ? '-right-2.5'
            : '-left-2.5'
        }`}
        title={isCollapsed ? '展开面板' : '收起面板'}
      >
        {position === 'left' ? (
          isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )
        ) : isCollapsed ? (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
}
