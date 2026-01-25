"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  RotateCcw,
  FileText,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  type Report,
  getTrashReports,
  restoreFromTrash,
  permanentlyDelete,
  emptyTrash,
} from "@/lib/api/reports";

export default function TrashPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrashReports();
  }, [page, pageSize]);

  const loadTrashReports = async () => {
    setLoading(true);
    try {
      const result = await getTrashReports({ page, pageSize });
      setReports(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load trash reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreFromTrash(id);
      loadTrashReports();
    } catch (error) {
      console.error("Failed to restore report:", error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("确定要永久删除这个报告吗？此操作不可撤销。")) return;
    try {
      await permanentlyDelete(id);
      loadTrashReports();
    } catch (error) {
      console.error("Failed to permanently delete report:", error);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm("确定要清空回收站吗？此操作将永久删除所有报告，不可撤销。")) return;
    try {
      await emptyTrash();
      loadTrashReports();
    } catch (error) {
      console.error("Failed to empty trash:", error);
    }
  };

  const handleBatchRestore = async () => {
    if (selectedIds.size === 0) return;
    try {
      await Promise.all(Array.from(selectedIds).map(id => restoreFromTrash(id)));
      setSelectedIds(new Set());
      loadTrashReports();
    } catch (error) {
      console.error("Failed to batch restore reports:", error);
    }
  };

  const handleBatchPermanentDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要永久删除选中的 ${selectedIds.size} 个报告吗？此操作不可撤销。`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map(id => permanentlyDelete(id)));
      setSelectedIds(new Set());
      loadTrashReports();
    } catch (error) {
      console.error("Failed to batch permanently delete reports:", error);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reports.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reports.map(r => r.id)));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/reports")}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              回收站
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              已删除的报告将在30天后自动永久删除
            </p>
          </div>
        </div>
        {reports.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--destructive)] border border-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
            清空回收站
          </button>
        )}
      </div>

      {/* 批量操作栏 */}
      {reports.length > 0 && (
        <div className="flex items-center justify-between bg-[var(--muted)] border border-[var(--border)] p-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.size === reports.length && reports.length > 0}
              onChange={toggleSelectAll}
              label={`已选中 ${selectedIds.size} 项`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchRestore}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              恢复
            </button>
            <button
              onClick={handleBatchPermanentDelete}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--destructive)] border border-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              永久删除
            </button>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--card)] border border-[var(--border)]">
          <Trash2 className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
          <p className="text-lg text-[var(--foreground)]">回收站为空</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            删除的报告会暂时保存在这里
          </p>
        </div>
      ) : (
        /* 表格视图 */
        <div className="bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="w-12 p-3">
                  <Checkbox
                    checked={selectedIds.size === reports.length && reports.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  报告名称
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  关联基金
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  删除时间
                </th>
                <th className="w-32 p-3 text-center text-sm font-medium text-[var(--muted-foreground)]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.has(report.id)}
                      onChange={() => toggleSelect(report.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm text-[var(--foreground)]">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)]">
                    {report.fundName || "-"}
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)]">
                    {formatDate(report.updatedAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleRestore(report.id)}
                        className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded"
                        title="恢复"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(report.id)}
                        className="p-1.5 text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white rounded"
                        title="永久删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {total > pageSize && (
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={setPage}
        />
      )}
    </div>
  );
}
