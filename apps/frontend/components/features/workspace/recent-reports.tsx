"use client";

import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Edit, Copy, Trash2, Clock } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { type Report, duplicateReport, deleteReport } from "@/lib/api/reports";
import { useWorkspaceStore } from "@/stores";

interface RecentReportsProps {
  reports: Report[];
  className?: string;
}

export function RecentReports({ reports, className = "" }: RecentReportsProps) {
  const router = useRouter();
  const { addReport, removeReport } = useWorkspaceStore();

  const handleEdit = (reportId: string) => {
    router.push(`/editor/${reportId}`);
  };

  const handleDuplicate = async (report: Report) => {
    try {
      const newReport = await duplicateReport(report.id);
      addReport(newReport);
      router.push(`/editor/${newReport.id}`);
    } catch (error) {
      console.error("Failed to duplicate report:", error);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("确定要删除这个报告吗？")) return;

    try {
      await deleteReport(reportId);
      removeReport(reportId);
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) {
      return "今天";
    } else if (days === 1) {
      return "昨天";
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString("zh-CN");
    }
  };

  if (reports.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
          最近报告
        </h2>
        <div className="flex flex-col items-center justify-center py-12 bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
          <FileText className="w-12 h-12 mb-3" />
          <p className="text-sm">暂无报告</p>
          <p className="text-xs mt-1">点击「新建报告」开始创建</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[var(--foreground)]">
          最近报告
        </h2>
        <button
          onClick={() => router.push("/reports")}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          查看全部
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="group relative bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm transition-all cursor-pointer"
            onClick={() => handleEdit(report.id)}
          >
            {/* 卡片内容 */}
            <div className="p-4">
              {/* 头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--primary)]" />
                  <Badge
                    variant={report.status === "completed" ? "success" : "default"}
                  >
                    {report.status === "completed" ? "已完成" : "草稿"}
                  </Badge>
                </div>
                <Dropdown
                  trigger={
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  }
                  items={[
                    {
                      key: "edit",
                      label: "编辑",
                      icon: <Edit className="w-4 h-4" />,
                      onClick: () => handleEdit(report.id),
                    },
                    {
                      key: "duplicate",
                      label: "复制",
                      icon: <Copy className="w-4 h-4" />,
                      onClick: () => handleDuplicate(report),
                    },
                    {
                      key: "delete",
                      label: "删除",
                      icon: <Trash2 className="w-4 h-4" />,
                      danger: true,
                      onClick: () => handleDelete(report.id),
                    },
                  ]}
                  align="right"
                />
              </div>

              {/* 标题 */}
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-1 line-clamp-2">
                {report.name}
              </h3>

              {/* 关联基金 */}
              {report.fundName && (
                <p className="text-xs text-[var(--muted-foreground)] mb-2 truncate">
                  {report.fundName}
                </p>
              )}

              {/* 更新时间 */}
              <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <Clock className="w-3 h-3" />
                <span>{formatDate(report.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
