"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ExportForm } from "./export-form";
import { ExportProgress, getProgressInfo } from "./export-progress";
import { generateCoverHtml } from "./cover-page-template";
import { generateTocHtml, type TocItem } from "./toc-template";
import { useExportTemplates } from "@/hooks/use-export-templates";
import { exportReportPdf, downloadBlob } from "@/lib/api/export";
import type { ExportConfig, ExportProgress as ExportProgressType } from "./types";
import { DEFAULT_EXPORT_CONFIG } from "./types";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  reportName?: string;
  fundName?: string;
  dateRange?: string;
  getContentHtml: () => string;
  getToken: () => string | null;
  tocItems?: TocItem[];
  selectedModulesCount?: number;
}

export function ExportModal({
  open,
  onClose,
  reportName = "基金分析报告",
  fundName,
  dateRange,
  getContentHtml,
  getToken,
  tocItems = [],
  selectedModulesCount = 0,
}: ExportModalProps) {
  const { templates, applyTemplate } = useExportTemplates();

  const [config, setConfig] = useState<ExportConfig>({
    ...DEFAULT_EXPORT_CONFIG,
    reportName,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgressType>(
    getProgressInfo("idle")
  );

  // 用于取消导出请求
  const abortControllerRef = useRef<AbortController | null>(null);

  // 组件卸载时取消正在进行的请求
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // 处理模板切换
  const handleConfigChange = useCallback(
    (newConfig: ExportConfig) => {
      if (newConfig.templateId !== config.templateId) {
        const applied = applyTemplate(newConfig.templateId, newConfig);
        setConfig(applied);
      } else {
        setConfig(newConfig);
      }
    },
    [config.templateId, applyTemplate]
  );

  // 重置状态
  const resetState = useCallback(() => {
    setIsExporting(false);
    setProgress(getProgressInfo("idle"));
  }, []);

  // 关闭弹窗
  const handleClose = useCallback(() => {
    if (!isExporting || progress.status === "done" || progress.status === "error") {
      // 取消正在进行的请求
      abortControllerRef.current?.abort();
      resetState();
      onClose();
    }
  }, [isExporting, progress.status, resetState, onClose]);

  // 执行导出
  const handleExport = useCallback(async () => {
    // 验证选中模块
    if (config.exportScope === "selected" && selectedModulesCount === 0) {
      setProgress({
        status: "error",
        percent: 0,
        message: "导出失败",
        error: "请先在画布中选择要导出的模块",
      });
      setIsExporting(true);
      return;
    }

    const token = getToken();
    if (!token) {
      setProgress({
        status: "error",
        percent: 0,
        message: "导出失败",
        error: "请先登录后再导出",
      });
      setIsExporting(true);
      return;
    }

    // 取消之前的请求（如果有）
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsExporting(true);

    try {
      // Step 1: 准备内容
      setProgress(getProgressInfo("preparing", "正在准备导出内容..."));

      let html = "";

      // 添加封面
      if (config.includeCover) {
        html += generateCoverHtml({
          reportTitle: config.reportName,
          fundName,
          dateRange,
        });
      }

      // 添加目录
      if (config.includeToc && tocItems.length > 0) {
        html += generateTocHtml(tocItems);
      }

      // 添加主要内容
      html += getContentHtml();

      // 包装为完整 HTML
      const fullHtml = wrapHtml(html, config);

      // Step 2: 生成 PDF
      setProgress(getProgressInfo("generating", "正在生成 PDF..."));

      const blob = await exportReportPdf(
        {
          html: fullHtml,
          file_name: `${config.reportName}.pdf`,
          landscape: config.pageSize === "a4-landscape",
          page_width: config.pageSize === "unlimited" ? 210 : undefined,
          page_height: config.pageSize === "unlimited" ? 5000 : undefined,
        },
        token,
        abortControllerRef.current.signal
      );

      // Step 3: 下载
      setProgress(getProgressInfo("done", "导出完成！"));
      downloadBlob(blob, `${config.reportName}.pdf`);
    } catch (error) {
      // 如果是用户取消操作，不显示错误
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Export failed:", error);
      setProgress({
        status: "error",
        percent: 0,
        message: "导出失败",
        error: error instanceof Error ? error.message : "未知错误",
      });
    }
  }, [
    config,
    fundName,
    dateRange,
    getContentHtml,
    getToken,
    tocItems,
    selectedModulesCount,
  ]);

  // 重试
  const handleRetry = useCallback(() => {
    setProgress(getProgressInfo("idle"));
    handleExport();
  }, [handleExport]);

  const footer = !isExporting ? (
    <>
      <Button variant="outline" onClick={handleClose}>
        取消
      </Button>
      <Button variant="primary" onClick={handleExport}>
        开始导出
      </Button>
    </>
  ) : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="导出报告"
      footer={footer}
      width="520px"
    >
      {isExporting ? (
        <ExportProgress
          progress={progress}
          onRetry={handleRetry}
          onClose={handleClose}
        />
      ) : (
        <ExportForm
          config={config}
          onChange={handleConfigChange}
          templates={templates}
          selectedModulesCount={selectedModulesCount}
        />
      )}
    </Modal>
  );
}

/**
 * 将内容包装为完整 HTML 文档
 */
function wrapHtml(content: string, config: ExportConfig): string {
  const pageNumberStyle = config.includePageNumber
    ? `
      @page {
        @bottom-center {
          content: counter(page);
          font-size: 12px;
          color: #666666;
        }
      }
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${config.reportName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
        }
        ${pageNumberStyle}
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
}
