'use client';

import React, { useCallback, useEffect } from 'react';
import { EditorLayout } from './layout';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useReportEditorStore } from '@/stores';
import { useAutoSave, useUnsavedChanges } from '@/hooks';

interface ReportEditorProps {
  reportId?: string;
  initialData?: {
    name?: string;
    modules?: unknown[];
    config?: Record<string, unknown>;
  };
}

export function ReportEditor({ reportId, initialData }: ReportEditorProps) {
  const {
    setReportId,
    setReportName,
    markSaved,
    reset,
  } = useReportEditorStore();

  const {
    showConfirmDialog,
    confirmNavigation,
    cancelNavigation,
  } = useUnsavedChanges();

  // 模拟保存函数
  const handleSave = useCallback(async () => {
    // TODO: 实现实际的保存 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  // 自动保存
  const { saveNow } = useAutoSave({
    interval: 30000, // 30 秒
    onSave: handleSave,
  });

  // 导出处理
  const handleExport = useCallback(() => {
    // TODO: 打开导出弹窗
  }, []);

  // 初始化
  useEffect(() => {
    if (reportId) {
      setReportId(reportId);
    }
    if (initialData?.name) {
      setReportName(initialData.name);
    }

    // 组件卸载时重置状态
    return () => {
      reset();
    };
  }, [reportId, initialData, setReportId, setReportName, reset]);

  return (
    <>
      <EditorLayout onSave={saveNow} onExport={handleExport} />

      <UnsavedChangesDialog
        isOpen={showConfirmDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
        onSave={async () => {
          await saveNow();
          confirmNavigation();
        }}
      />
    </>
  );
}
