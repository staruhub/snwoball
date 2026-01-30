"use client";

// 强制动态渲染，因为使用了客户端功能
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  RotateCcw,
  MoreHorizontal,
  FileText,
  Clock,
  ArrowLeft,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getTrashReports,
  restoreReport,
  permanentlyDeleteReport,
  type Report,
} from "@/lib/api/reports";

function formatDate(dateStr: string) {
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
}

export default function TrashPage() {
  const router = useRouter();
  const { requireAuth, isLoading, isAuthenticated } = useAuth();

  // 数据状态
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // 选择状态
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 弹窗状态
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingReport, setDeletingReport] = useState<Report | null>(null);
  const [batchDeleteModalOpen, setBatchDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 认证检查
  useEffect(() => {
    if (isLoading) return;
    requireAuth();
  }, [requireAuth, isLoading]);

  const fetchReports = useCallback(async () => {
    // 认证检查未完成或未登录时不发起请求
    if (isLoading || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await getTrashReports({ page, pageSize });
      setReports(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch trash reports:", error);
      toast.error("加载回收站失败");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, isLoading, isAuthenticated]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 重置选择状态
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [page]);

  const handleRestore = async (report: Report) => {
    try {
      await restoreReport(report.id);
      toast.success("报告已还原");
      fetchReports();
    } catch (error) {
      console.error("Failed to restore report:", error);
      toast.error("还原失败");
    }
  };

  const handleBatchRestore = async () => {
    if (selectedIds.size === 0) {
      toast.warning("请先选择要还原的报告");
      return;
    }

    setActionLoading(true);
    try {
      const restorePromises = Array.from(selectedIds).map((id) =>
        restoreReport(id)
      );
      await Promise.all(restorePromises);
      setSelectedIds(new Set());
      setSelectAll(false);
      toast.success(`成功还原 ${selectedIds.size} 个报告`);
      fetchReports();
    } catch (error) {
      console.error("Failed to batch restore reports:", error);
      toast.error("批量还原失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = (report: Report) => {
    setDeletingReport(report);
    setDeleteModalOpen(true);
  };

  const confirmPermanentDelete = async () => {
    if (!deletingReport) return;
    setActionLoading(true);
    try {
      await permanentlyDeleteReport(deletingReport.id);
      setDeleteModalOpen(false);
      setDeletingReport(null);
      toast.success("报告已永久删除");
      fetchReports();
    } catch (error) {
      console.error("Failed to permanently delete report:", error);
      toast.error("删除失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatchPermanentDelete = () => {
    if (selectedIds.size === 0) {
      toast.warning("请先选择要删除的报告");
      return;
    }
    setBatchDeleteModalOpen(true);
  };

  const confirmBatchPermanentDelete = async () => {
    setActionLoading(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        permanentlyDeleteReport(id)
      );
      await Promise.all(deletePromises);
      setBatchDeleteModalOpen(false);
      setSelectedIds(new Set());
      setSelectAll(false);
      toast.success(`成功删除 ${selectedIds.size} 个报告`);
      fetchReports();
    } catch (error) {
      console.error("Failed to batch delete reports:", error);
      toast.error("批量删除失败");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
    setSelectAll(newSelectedIds.size === reports.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(reports.map((r) => r.id)));
      setSelectAll(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/reports")}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              回收站
            </h1>
            <p className="text-[var(--muted-foreground)]">
              已删除的报告将在此处保留 30 天
            </p>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-[var(--muted)] rounded-md">
          <span className="text-sm text-[var(--foreground)]">
            已选择 {selectedIds.size} 项
          </span>
          <button
            onClick={() => {
              setSelectedIds(new Set());
              setSelectAll(false);
            }}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            取消选择
          </button>
          <button
            onClick={handleBatchRestore}
            disabled={actionLoading}
            className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
          >
            <RotateCcw className="w-4 h-4" />
            还原选中
          </button>
          <button
            onClick={handleBatchPermanentDelete}
            disabled={actionLoading}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            永久删除
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-60 text-[var(--muted-foreground)]">
          Loading...
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--muted-foreground)]">
          <Trash2 className="w-12 h-12 mb-3" />
          <p className="text-sm">回收站为空</p>
          <p className="text-xs mt-1">删除的报告会显示在这里</p>
        </div>
      ) : (
        /* Table View */
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="w-10 px-4 py-3 text-left">
                  <div
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                      selectAll
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-[var(--border)] bg-white hover:border-[var(--primary)]"
                    }`}
                  >
                    {selectAll && <Check className="w-3 h-3 text-white" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  报告名称
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  关联基金
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  删除时间
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className={`hover:bg-[var(--muted)] transition-colors ${
                    selectedIds.has(report.id) ? "bg-[var(--muted)]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div
                      onClick={() => toggleSelect(report.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        selectedIds.has(report.id)
                          ? "bg-[var(--primary)] border-[var(--primary)]"
                          : "border-[var(--border)] bg-white hover:border-[var(--primary)]"
                      }`}
                    >
                      {selectedIds.has(report.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--foreground)]">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {report.fundName || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                      <Clock className="w-3 h-3" />
                      {report.deletedAt ? formatDate(report.deletedAt) : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown
                      trigger={
                        <button className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        {
                          key: "restore",
                          label: "还原",
                          icon: <RotateCcw className="w-4 h-4" />,
                          onClick: () => handleRestore(report),
                        },
                        {
                          key: "delete",
                          label: "永久删除",
                          icon: <Trash2 className="w-4 h-4" />,
                          danger: true,
                          onClick: () => handlePermanentDelete(report),
                        },
                      ]}
                      align="right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={setPage}
        />
      )}

      {/* Permanent Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmPermanentDelete}
        title="永久删除报告"
        message={
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">此操作不可撤销</span>
            </div>
            <p>确定要永久删除报告 &quot;{deletingReport?.name}&quot; 吗？</p>
          </div>
        }
        confirmText="永久删除"
        variant="danger"
        loading={actionLoading}
      />

      {/* Batch Permanent Delete Confirm Modal */}
      <ConfirmModal
        open={batchDeleteModalOpen}
        onClose={() => setBatchDeleteModalOpen(false)}
        onConfirm={confirmBatchPermanentDelete}
        title="永久删除报告"
        message={
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">此操作不可撤销</span>
            </div>
            <p>确定要永久删除选中的 {selectedIds.size} 个报告吗？</p>
          </div>
        }
        confirmText="永久删除"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
