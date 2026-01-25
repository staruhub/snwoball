'use client';

import React, { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { EditorLayout } from './layout';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useReportEditorStore, useGlobalFiltersStore } from '@/stores';
import { useAutoSave, useUnsavedChanges } from '@/hooks';
import { updateReport } from '@/lib/api/reports';
import type { ReportContent, ModuleInstance as ApiModuleInstance } from '@/lib/api/reports';

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
    reportName,
    modules,
    config,
    isSaving,
    setSaving,
    markSaved,
    reset,
  } = useReportEditorStore();

  const { filters } = useGlobalFiltersStore();

  const {
    showConfirmDialog,
    confirmNavigation,
    cancelNavigation,
  } = useUnsavedChanges();

  // 收集报告内容
  const collectReportContent = useCallback((): ReportContent => {
    // 转换模块格式
    const apiModules: ApiModuleInstance[] = modules.map((m) => ({
      id: m.id,
      moduleType: m.moduleType,
      title: m.title,
      order: m.order,
      height: m.height,
      isLocked: m.isLocked,
      config: m.config,
    }));

    return {
      modules: apiModules,
      globalFilters: {
        fundId: filters.fundId,
        fundName: filters.fundName,
        benchmarkId: filters.benchmarkId,
        benchmarkName: filters.benchmarkName,
        dateRange: filters.dateRange,
        frequency: filters.frequency,
        navType: filters.navType,
      },
      reportConfig: {
        theme: config.theme,
        primaryColor: config.primaryColor,
        fontFamily: config.fontFamily,
        fontSize: config.fontSize,
        showPageNumbers: config.showPageNumbers,
        showTableOfContents: config.showTableOfContents,
      },
    };
  }, [modules, filters, config]);

  // 真实保存函数
  const handleSave = useCallback(async () => {
    if (!reportId) {
      console.warn('Cannot save: no reportId');
      return;
    }

    setSaving(true);
    try {
      const content = collectReportContent();
      await updateReport(reportId, {
        name: reportName,
        content,
        fundId: filters.fundId || undefined,
        fundName: filters.fundName || undefined,
      });
      markSaved();
      toast.success('保存成功');
    } catch (error) {
      console.error('Failed to save report:', error);
      toast.error('保存失败，请重试');
      throw error; // Re-throw for auto-save to handle
    } finally {
      setSaving(false);
    }
  }, [reportId, reportName, filters.fundId, filters.fundName, collectReportContent, markSaved, setSaving]);

  // 自动保存
  const { saveNow } = useAutoSave({
    interval: 30000, // 30 秒
    onSave: handleSave,
  });

  // 导出处理
  const handleExport = useCallback(() => {
    // TODO: 打开导出弹窗
    console.log('Opening export dialog...');
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

  // 手动保存包装（带 loading 状态）
  const handleManualSave = useCallback(async () => {
    if (isSaving) return;
    await saveNow();
  }, [isSaving, saveNow]);

  return (
    <>
      <EditorLayout onSave={handleManualSave} onExport={handleExport} />

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
