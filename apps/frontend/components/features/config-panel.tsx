"use client";

import { X, Lock, Plus } from "lucide-react";
import { IconButton, Button } from "../ui/button";
import { Tabs } from "../ui/tabs";
import { InputGroup } from "../ui/input-group";
import { SelectGroup } from "../ui/select-group";
import { Switch } from "../ui/switch";
import { useState } from "react";

interface ConfigPanelProps {
  onClose?: () => void;
}

export function ConfigPanel({ onClose }: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("global");
  const [reportTitle, setReportTitle] = useState("2024年度基金分析报告");
  const [reportTemplate, setReportTemplate] = useState("standard");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dataFrequency, setDataFrequency] = useState("daily");
  const [returnType, setReturnType] = useState("cumulative");

  return (
    <aside className="flex flex-col w-80 h-full bg-[var(--card)] border-l border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center gap-2 h-12 px-4 py-2 border-b border-[var(--border)]">
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
            { id: "global", label: "全局设置" },
            { id: "module", label: "模块设置" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col gap-5 p-4 overflow-auto">
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

        {/* Section 3 - 当前模块 */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-[var(--muted-foreground)]">
            当前模块: 区间收益
          </span>
          <SelectGroup
            label="数据频率"
            value={dataFrequency}
            onChange={setDataFrequency}
            options={[
              { value: "daily", label: "日频" },
              { value: "weekly", label: "周频" },
            ]}
          />
          <SelectGroup
            label="收益类型"
            value={returnType}
            onChange={setReturnType}
            options={[
              { value: "cumulative", label: "累计收益" },
              { value: "annual", label: "年化收益" },
            ]}
          />
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="text-xs text-[var(--muted-foreground)]">
              参数已锁定
            </span>
            <div className="flex-1" />
            <Button variant="ghost" className="text-xs px-2 py-1">
              解锁
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
