"use client";

import { InputGroup } from "@/components/ui/input-group";
import { SelectGroup } from "@/components/ui/select-group";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { ExportConfig, ExportTemplate } from "./types";

interface ExportFormProps {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
  templates: ExportTemplate[];
  selectedModulesCount?: number;
}

const EXPORT_TYPE_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word (V2.0)", disabled: true },
  { value: "ppt", label: "PPT (V2.0)", disabled: true },
  { value: "excel", label: "Excel (V2.0)", disabled: true },
];

const PAGE_SIZE_OPTIONS = [
  { value: "a4-portrait", label: "A4 纵向" },
  { value: "a4-landscape", label: "A4 横向" },
  { value: "unlimited", label: "无限制（单页）" },
];

const EXPORT_SCOPE_OPTIONS = [
  { value: "all", label: "全部模块" },
  { value: "selected", label: "选中模块" },
];

export function ExportForm({
  config,
  onChange,
  templates,
  selectedModulesCount = 0,
}: ExportFormProps) {
  const updateConfig = <K extends keyof ExportConfig>(
    key: K,
    value: ExportConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const templateOptions = templates.map((t) => ({
    value: t.id,
    label: t.isSystem ? `${t.name}（系统）` : t.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* 报告名称 */}
      <InputGroup
        label="报告名称"
        value={config.reportName}
        onChange={(value) => updateConfig("reportName", value)}
        placeholder="请输入报告名称"
      />

      {/* 导出模板 */}
      <SelectGroup
        label="导出模板"
        value={config.templateId}
        options={templateOptions}
        onChange={(value) => updateConfig("templateId", value)}
      />

      {/* 导出类型 */}
      <RadioGroup
        label="导出类型"
        value={config.exportType}
        options={EXPORT_TYPE_OPTIONS}
        onChange={(value) =>
          updateConfig("exportType", value as ExportConfig["exportType"])
        }
      />

      {/* 导出尺寸 */}
      <RadioGroup
        label="导出尺寸"
        value={config.pageSize}
        options={PAGE_SIZE_OPTIONS}
        onChange={(value) =>
          updateConfig("pageSize", value as ExportConfig["pageSize"])
        }
      />

      {/* 导出范围 */}
      <div className="flex flex-col gap-2">
        <RadioGroup
          label="导出范围"
          value={config.exportScope}
          options={EXPORT_SCOPE_OPTIONS}
          onChange={(value) =>
            updateConfig("exportScope", value as ExportConfig["exportScope"])
          }
        />
        {config.exportScope === "selected" && (
          <span className="text-xs text-[var(--muted-foreground)] ml-6">
            {selectedModulesCount > 0
              ? `已选择 ${selectedModulesCount} 个模块`
              : "请先在画布中选择模块"}
          </span>
        )}
      </div>

      {/* 选项复选框 */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[var(--foreground)]">
          其他选项
        </span>
        <div className="flex flex-col gap-2 ml-1">
          <Checkbox
            checked={config.includeCover}
            onChange={(checked) => updateConfig("includeCover", checked)}
            label="包含封面"
          />
          <Checkbox
            checked={config.includeToc}
            onChange={(checked) => updateConfig("includeToc", checked)}
            label="包含目录"
          />
          <Checkbox
            checked={config.includePageNumber}
            onChange={(checked) => updateConfig("includePageNumber", checked)}
            label="包含页码"
          />
        </div>
      </div>
    </div>
  );
}
