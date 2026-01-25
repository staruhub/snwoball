"use client";

import { OperationLogItem } from "@/lib/api/settings";
import { FileText, Download, Edit, Trash2, Plus, Eye } from "lucide-react";

interface OperationLogsTableProps {
  items: OperationLogItem[];
  loading: boolean;
}

export function OperationLogsTable({ items, loading }: OperationLogsTableProps) {
  const getOperationIcon = (type: string) => {
    if (type.includes("create") || type.includes("add")) {
      return <Plus className="w-4 h-4 text-green-500" />;
    }
    if (type.includes("edit") || type.includes("update")) {
      return <Edit className="w-4 h-4 text-blue-500" />;
    }
    if (type.includes("delete") || type.includes("remove")) {
      return <Trash2 className="w-4 h-4 text-red-500" />;
    }
    if (type.includes("export") || type.includes("download")) {
      return <Download className="w-4 h-4 text-purple-500" />;
    }
    if (type.includes("view") || type.includes("read")) {
      return <Eye className="w-4 h-4 text-gray-500" />;
    }
    return <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />;
  };

  const getOperationLabel = (type: string) => {
    const labels: Record<string, string> = {
      report_create: "创建报告",
      report_edit: "编辑报告",
      report_delete: "删除报告",
      report_export: "导出报告",
      fund_view: "查看基金",
      fund_add: "添加基金",
      fund_remove: "移除基金",
      export_pdf: "导出 PDF",
      export_excel: "导出 Excel",
    };
    return labels[type] || type;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        暂无操作记录
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              操作时间
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              操作类型
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              资源名称
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              详情
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                {formatTime(item.create_time)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  {getOperationIcon(item.operation_type)}
                  <span>{getOperationLabel(item.operation_type)}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                {item.resource_name || "-"}
              </td>
              <td className="py-3 px-4 text-sm text-[var(--muted-foreground)] max-w-xs truncate">
                {item.detail || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
