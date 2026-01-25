'use client';

import React from 'react';
import { FileText, MousePointerClick } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-blue-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        开始构建您的报告
      </h3>

      <p className="text-gray-500 text-sm max-w-xs mb-6">
        从左侧选择分析模块添加到报告画布，通过拖拽调整模块顺序
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <MousePointerClick className="w-4 h-4" />
        <span>点击左侧模块即可添加</span>
      </div>
    </div>
  );
}
