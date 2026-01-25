"use client";

import { CircleCheck, Download, Save, ArrowLeft } from "lucide-react";
import { InputGroup } from "../ui/input-group";
import { Button, IconButton } from "../ui/button";

interface HeaderBarProps {
  reportName: string;
  onReportNameChange?: (value: string) => void;
  onExport?: () => void;
  onSave?: () => void;
  onBack?: () => void;
}

export function HeaderBar({
  reportName,
  onReportNameChange,
  onExport,
  onSave,
  onBack,
}: HeaderBarProps) {
  return (
    <header className="flex items-center gap-6 h-16 px-8 py-3 bg-[var(--card)] border-b border-[var(--border)]">
      {onBack && (
        <IconButton
          icon={<ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />}
          onClick={onBack}
          className="mr-2"
        />
      )}
      <InputGroup
        value={reportName}
        onChange={onReportNameChange}
        className="w-80"
      />

      <div className="flex items-center gap-1.5">
        <CircleCheck className="w-4 h-4 text-[var(--color-success-foreground)]" />
        <span className="text-xs text-[var(--muted-foreground)]">已保存</span>
      </div>

      <div className="flex-1" />

      <Button
        variant="outline"
        icon={<Download className="w-4 h-4" />}
        onClick={onExport}
      >
        导出
      </Button>

      <Button
        variant="primary"
        icon={<Save className="w-4 h-4" />}
        onClick={onSave}
      >
        保存
      </Button>
    </header>
  );
}
