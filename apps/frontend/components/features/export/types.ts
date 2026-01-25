/**
 * PDF 导出模块类型定义
 */

export type ExportType = "pdf" | "word" | "ppt" | "excel";

export type PageSize = "a4-portrait" | "a4-landscape" | "unlimited";

export type ExportScope = "all" | "selected";

export interface ExportConfig {
  reportName: string;
  templateId: string;
  exportType: ExportType;
  pageSize: PageSize;
  exportScope: ExportScope;
  includeCover: boolean;
  includeToc: boolean;
  includePageNumber: boolean;
}

export interface ExportTemplate {
  id: string;
  name: string;
  isSystem: boolean;
  config: Partial<ExportConfig>;
}

export type ExportStatus = "idle" | "preparing" | "generating" | "done" | "error";

export interface ExportProgress {
  status: ExportStatus;
  percent: number;
  message: string;
  error?: string;
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  reportName: "基金分析报告",
  templateId: "system-default",
  exportType: "pdf",
  pageSize: "a4-portrait",
  exportScope: "all",
  includeCover: true,
  includeToc: true,
  includePageNumber: true,
};

export const SYSTEM_TEMPLATES: ExportTemplate[] = [
  {
    id: "system-default",
    name: "系统默认",
    isSystem: true,
    config: {},
  },
  {
    id: "system-simple",
    name: "简洁报告",
    isSystem: true,
    config: {
      includeCover: false,
      includeToc: false,
    },
  },
];
