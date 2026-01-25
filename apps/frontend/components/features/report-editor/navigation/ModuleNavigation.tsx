'use client';

import React, { useState } from 'react';
import { ModuleTree } from './ModuleTree';
import { ModuleSearchBar } from './ModuleSearchBar';

export function ModuleNavigation() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">分析模块</h3>
        <p className="text-xs text-gray-500 mt-1">点击模块添加到报告</p>
      </div>

      {/* 搜索框 */}
      <div className="px-3 py-3 border-b border-gray-100">
        <ModuleSearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* 模块树 */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <ModuleTree searchQuery={searchQuery} />
      </div>
    </div>
  );
}
