"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { ExportProgress as ExportProgressType } from "./types";

interface ExportProgressProps {
  progress: ExportProgressType;
  onRetry?: () => void;
  onClose?: () => void;
}

export function ExportProgress({
  progress,
  onRetry,
  onClose,
}: ExportProgressProps) {
  const { status, percent, message, error } = progress;

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Status Icon */}
      <div className="flex justify-center">
        {status === "done" ? (
          <CheckCircle2 className="w-12 h-12 text-[var(--color-success-foreground)]" />
        ) : status === "error" ? (
          <AlertCircle className="w-12 h-12 text-red-500" />
        ) : (
          <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
        )}
      </div>

      {/* Progress Bar */}
      {status !== "error" && (
        <Progress value={percent} showLabel className="w-full" />
      )}

      {/* Status Message */}
      <div className="text-center">
        <p
          className={`text-sm ${
            status === "error"
              ? "text-red-500"
              : "text-[var(--muted-foreground)]"
          }`}
        >
          {message}
        </p>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Action Buttons */}
      {status === "error" && onRetry && (
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={onRetry}>
            重试
          </Button>
        </div>
      )}

      {status === "done" && onClose && (
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            完成
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * 获取导出状态的进度信息
 */
export function getProgressInfo(
  status: ExportProgressType["status"],
  customMessage?: string
): ExportProgressType {
  switch (status) {
    case "preparing":
      return {
        status: "preparing",
        percent: 10,
        message: customMessage || "正在准备导出内容...",
      };
    case "generating":
      return {
        status: "generating",
        percent: 50,
        message: customMessage || "正在生成 PDF...",
      };
    case "done":
      return {
        status: "done",
        percent: 100,
        message: customMessage || "导出完成！",
      };
    case "error":
      return {
        status: "error",
        percent: 0,
        message: customMessage || "导出失败",
      };
    default:
      return {
        status: "idle",
        percent: 0,
        message: "",
      };
  }
}
