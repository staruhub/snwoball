'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useReportEditorStore } from '@/stores';
import Link from 'next/link';

interface TopActionBarProps {
  onSave?: () => void;
  onExport?: () => void;
}

export function TopActionBar({ onSave, onExport }: TopActionBarProps) {
  const {
    reportName,
    setReportName,
    isDirty,
    isSaving,
    lastSavedAt,
  } = useReportEditorStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(reportName);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步报告名称
  useEffect(() => {
    setTempName(reportName);
  }, [reportName]);

  // 聚焦输入框
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setReportName(tempName.trim());
    } else {
      setTempName(reportName);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(reportName);
      setIsEditingName(false);
    }
  };

  // 格式化保存时间
  const formatSavedTime = () => {
    if (!lastSavedAt) return null;
    const time = lastSavedAt.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `上次保存于 ${time}`;
  };

  return (
    <div className="h-14 px-4 flex items-center gap-4 border-b border-gray-200 bg-white">
      {/* 返回按钮 */}
      <Link
        href="/"
        className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="返回首页"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </Link>

      {/* 报告名称 */}
      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 outline-none w-full max-w-md"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors truncate max-w-md text-left"
            title="点击编辑报告名称"
          >
            {reportName}
          </button>
        )}
      </div>

      {/* 保存状态 */}
      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <span className="flex items-center gap-1 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            保存中...
          </span>
        ) : isDirty ? (
          <span className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            有未保存的更改
          </span>
        ) : lastSavedAt ? (
          <span className="flex items-center gap-1 text-green-600">
            <Check className="w-4 h-4" />
            {formatSavedTime()}
          </span>
        ) : null}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
      </div>
    </div>
  );
}
