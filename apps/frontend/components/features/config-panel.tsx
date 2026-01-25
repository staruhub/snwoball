"use client";

import { X, Lock, Settings } from "lucide-react";
import { IconButton, Button } from "../ui/button";
import { Tabs } from "../ui/tabs";
import { InputGroup } from "../ui/input-group";
import { SelectGroup } from "../ui/select-group";
import { Switch } from "../ui/switch";
import { useState, useEffect } from "react";
import { moduleRegistry, type ConfigField } from "@/lib/modules";

interface ConfigPanelProps {
  onClose?: () => void;
  moduleId?: string;
  moduleName?: string;
  config?: Record<string, unknown>;
  onConfigChange?: (config: Record<string, unknown>) => void;
}

export function ConfigPanel({
  onClose,
  moduleId,
  moduleName,
  config = {},
  onConfigChange,
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("module");
  const [reportTitle, setReportTitle] = useState("2024年度基金分析报告");
  const [reportTemplate, setReportTemplate] = useState("standard");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 获取模块配置 Schema
  const configSchema = moduleId ? moduleRegistry.getConfigSchema(moduleId) : undefined;

  // 更新配置值
  const updateConfig = (key: string, value: unknown) => {
    onConfigChange?.({ ...config, [key]: value });
  };

  // 渲染配置字段
  const renderConfigField = (field: ConfigField) => {
    const value = config[field.key] ?? field.defaultValue;

    switch (field.type) {
      case "text":
        return (
          <InputGroup
            key={field.key}
            label={field.label}
            value={(value as string) || ""}
            onChange={(v) => updateConfig(field.key, v)}
            placeholder={field.placeholder}
          />
        );

      case "number":
        return (
          <InputGroup
            key={field.key}
            label={field.label}
            type="number"
            value={String(value ?? "")}
            onChange={(v) => updateConfig(field.key, parseFloat(v) || 0)}
          />
        );

      case "select":
        return (
          <SelectGroup
            key={field.key}
            label={field.label}
            value={(value as string) || field.options?.[0]?.value || ""}
            onChange={(v) => updateConfig(field.key, v)}
            options={field.options || []}
          />
        );

      case "boolean":
        return (
          <Switch
            key={field.key}
            checked={Boolean(value)}
            onChange={(v) => updateConfig(field.key, v)}
            label={field.label}
          />
        );

      default:
        return null;
    }
  };

  return (
    <aside className="flex flex-col w-80 h-full bg-[var(--card)] border-l border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center gap-2 h-12 px-4 py-2 border-b border-[var(--border)]">
        <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
        <span className="text-sm font-medium text-[var(--foreground)]">
          配置面板
        </span>
        <div className="flex-1" />
        <IconButton
          icon={<X className="w-4 h-4 text-[var(--foreground)]" />}
          onClick={onClose}
        />
      </div>

      {/* Tabs */}
      <div className="px-4 py-3">
        <Tabs
          tabs={[
            { id: "module", label: "模块设置" },
            { id: "global", label: "全局设置" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col gap-5 p-4 overflow-auto">
        {activeTab === "module" ? (
          <>
            {/* 当前模块信息 */}
            {moduleName && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {moduleName}
                    </span>
                    {moduleId && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        ID: {moduleId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 模块配置字段 */}
            {configSchema && configSchema.fields.length > 0 ? (
              <div className="flex flex-col gap-3">
                <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                  模块参数
                </span>
                {configSchema.fields.map((field) => renderConfigField(field))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[var(--muted-foreground)]">
                <div className="text-center">
                  <p className="text-sm">该模块暂无可配置参数</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Section 1 - 报告设置 */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                报告设置
              </span>
              <InputGroup
                label="报告标题"
                value={reportTitle}
                onChange={setReportTitle}
              />
              <SelectGroup
                label="报告模板"
                value={reportTemplate}
                onChange={setReportTemplate}
                options={[
                  { value: "standard", label: "标准分析模板" },
                  { value: "detailed", label: "详细分析模板" },
                ]}
              />
            </div>

            {/* Section 2 - 显示选项 */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
                显示选项
              </span>
              <Switch
                checked={showBenchmark}
                onChange={setShowBenchmark}
                label="显示基准对比"
              />
              <Switch
                checked={showGrid}
                onChange={setShowGrid}
                label="显示图表网格"
              />
              <Switch
                checked={autoRefresh}
                onChange={setAutoRefresh}
                label="自动刷新数据"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
