"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ExportTemplate,
  ExportConfig,
  SYSTEM_TEMPLATES,
  DEFAULT_EXPORT_CONFIG,
} from "@/components/features/export/types";

const STORAGE_KEY = "export-templates";

/**
 * 验证模板数据结构是否有效
 */
function isValidTemplate(data: unknown): data is ExportTemplate {
  if (typeof data !== "object" || data === null) return false;
  const t = data as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.name === "string" &&
    typeof t.isSystem === "boolean" &&
    (t.config === undefined || typeof t.config === "object")
  );
}

/**
 * 安全解析 localStorage 中的模板数据
 */
function parseTemplates(stored: string): ExportTemplate[] {
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTemplate);
  } catch {
    return [];
  }
}

/**
 * 导出模板管理 Hook
 */
export function useExportTemplates() {
  const [userTemplates, setUserTemplates] = useState<ExportTemplate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载用户模板
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const validTemplates = parseTemplates(stored);
        setUserTemplates(validTemplates);
      }
    } catch (error) {
      console.error("Failed to load export templates:", error);
    }
    setIsLoaded(true);
  }, []);

  // 保存到 localStorage
  const saveToStorage = useCallback((templates: ExportTemplate[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error("Failed to save export templates:", error);
    }
  }, []);

  // 所有可用模板（系统 + 用户）
  const allTemplates: ExportTemplate[] = [...SYSTEM_TEMPLATES, ...userTemplates];

  // 根据 ID 获取模板
  const getTemplate = useCallback(
    (templateId: string): ExportTemplate | undefined => {
      return allTemplates.find((t) => t.id === templateId);
    },
    [allTemplates]
  );

  // 应用模板配置
  const applyTemplate = useCallback(
    (templateId: string, currentConfig: ExportConfig): ExportConfig => {
      const template = getTemplate(templateId);
      if (!template) return currentConfig;

      return {
        ...DEFAULT_EXPORT_CONFIG,
        ...template.config,
        reportName: currentConfig.reportName, // 保留报告名称
        templateId,
      };
    },
    [getTemplate]
  );

  // 保存新模板
  const saveTemplate = useCallback(
    (name: string, config: Partial<ExportConfig>): ExportTemplate => {
      const newTemplate: ExportTemplate = {
        id: `user-${Date.now()}`,
        name,
        isSystem: false,
        config,
      };

      const updated = [...userTemplates, newTemplate];
      setUserTemplates(updated);
      saveToStorage(updated);

      return newTemplate;
    },
    [userTemplates, saveToStorage]
  );

  // 删除用户模板
  const deleteTemplate = useCallback(
    (templateId: string): boolean => {
      const template = getTemplate(templateId);
      if (!template || template.isSystem) return false;

      const updated = userTemplates.filter((t) => t.id !== templateId);
      setUserTemplates(updated);
      saveToStorage(updated);

      return true;
    },
    [userTemplates, getTemplate, saveToStorage]
  );

  return {
    templates: allTemplates,
    systemTemplates: SYSTEM_TEMPLATES,
    userTemplates,
    isLoaded,
    getTemplate,
    applyTemplate,
    saveTemplate,
    deleteTemplate,
  };
}
