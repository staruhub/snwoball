"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  FileText,
  Grid,
  List,
  Clock,
  X,
  Check,
} from "lucide-react";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/form";
import { Dropdown, SelectDropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getReports,
  deleteReport,
  duplicateReport,
  type Report,
  type ReportListParams,
} from "@/lib/api/reports";

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "draft", label: "草稿" },
  { value: "completed", label: "已完成" },
];

const SORT_OPTIONS = [
  { value: "update_time_desc", label: "更新时间 (最新)" },
  { value: "update_time_asc", label: "更新时间 (最早)" },
  { value: "create_time_desc", label: "创建时间 (最新)" },
  { value: "create_time_asc", label: "创建时间 (最早)" },
  { value: "name_asc", label: "名称 (A-Z)" },
  { value: "name_desc", label: "名称 (Z-A)" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="success">已完成</Badge>;
    case "draft":
    default:
      return <Badge variant="default">草稿</Badge>;
  }
}

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

export default function ReportsPage() {
  const router = useRouter();
  const { requireAuth, isLoading, isAuthenticated } = useAuth();

  // 数据状态
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // 筛选状态
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("update_time_desc");

  // 视图状态
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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
      const params: ReportListParams = {
        page,
        pageSize,
        keyword: keyword || undefined,
        status: status as "draft" | "completed" | undefined,
      };
      const response = await getReports(params);

      // 前端排序（后端 API 暂不支持排序参数）
      let sortedItems = [...response.items];
      const sortParts = sortBy.split("_");
      const direction = sortParts.pop();
      const field = sortParts.join("_");
      sortedItems.sort((a, b) => {
        let valueA: string | number;
        let valueB: string | number;

        if (field === "update_time" || field === "create_time") {
          const timeField = field === "update_time" ? "updatedAt" : "createdAt";
          valueA = new Date(a[timeField]).getTime();
          valueB = new Date(b[timeField]).getTime();
        } else if (field === "name") {
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
        } else {
          return 0;
        }

        if (direction === "asc") {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else if (direction === "desc") {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
        return 0;
      });

      setReports(sortedItems);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("加载报告列表失败");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, status, sortBy, isLoading, isAuthenticated]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 重置选择状态
  useEffect(() => {
    setSelectedIds(new Set());
    setSelectAll(false);
  }, [page, keyword, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 1) {
      fetchReports();
    } else {
      setPage(1);
    }
  };

  const handleEdit = (reportId: string) => {
    router.push(`/editor/${reportId}`);
  };

  const handleDuplicate = async (report: Report) => {
    try {
      const newReport = await duplicateReport(report.id);
      toast.success("报告复制成功");
      router.push(`/editor/${newReport.id}`);
    } catch (error) {
      console.error("Failed to duplicate report:", error);
      toast.error("复制报告失败");
    }
  };

  const handleDelete = (report: Report) => {
    setDeletingReport(report);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingReport) return;
    setActionLoading(true);
    try {
      await deleteReport(deletingReport.id);
      setDeleteModalOpen(false);
      setDeletingReport(null);
      toast.success("报告删除成功");
      fetchReports();
    } catch (error) {
      console.error("Failed to delete report:", error);
      toast.error("删除报告失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) {
      toast.warning("请先选择要删除的报告");
      return;
    }
    setBatchDeleteModalOpen(true);
  };

  const confirmBatchDelete = async () => {
    setActionLoading(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        deleteReport(id)
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

  const clearFilters = () => {
    setKeyword("");
    setStatus("");
    setSortBy("update_time_desc");
    setPage(1);
  };

  const hasActiveFilters = keyword || status;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            报告管理
          </h1>
          <p className="text-[var(--muted-foreground)]">
            管理和查看您的所有报告
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/reports/trash")}
            className="flex items-center gap-2 px-4 py-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)]"
          >
            <Trash2 className="w-4 h-4" />
            回收站
          </button>
          <button
            onClick={() => router.push("/editor/new")}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            新建报告
          </button>
        </div>
      </div>

      {/* Filters and Actions Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索报告名称..."
              className="pl-10"
            />
          </div>
        </form>

        {/* Status Filter */}
        <SelectDropdown
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          className="w-32"
        />

        {/* Sort */}
        <SelectDropdown
          value={sortBy}
          options={SORT_OPTIONS}
          onChange={setSortBy}
          className="w-44"
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 ml-auto border border-[var(--border)] rounded-md">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid"
                ? "bg-[var(--muted)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="卡片视图"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 ${
              viewMode === "table"
                ? "bg-[var(--muted)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="表格视图"
          >
            <List className="w-4 h-4" />
          </button>
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
            onClick={handleBatchDelete}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            删除选中
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
          <FileText className="w-12 h-12 mb-3" />
          <p className="text-sm mb-1">
            {hasActiveFilters ? "没有找到匹配的报告" : "暂无报告"}
          </p>
          <p className="text-xs">
            {hasActiveFilters
              ? "尝试调整筛选条件"
              : "点击「新建报告」开始创建"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`group relative bg-[var(--card)] border rounded-md transition-all ${
                selectedIds.has(report.id)
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)] ring-opacity-20"
                  : "border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm"
              }`}
            >
              {/* Selection Checkbox */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(report.id);
                }}
                className="absolute top-3 left-3 z-10"
              >
                <div
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
              </div>

              <div
                className="p-4 cursor-pointer"
                onClick={() => handleEdit(report.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 pl-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--primary)]" />
                    {getStatusBadge(report.status)}
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
                        onClick: () => handleDelete(report),
                      },
                    ]}
                    align="right"
                  />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-1 line-clamp-2">
                  {report.name}
                </h3>

                {/* Fund Name */}
                {report.fundName && (
                  <p className="text-xs text-[var(--muted-foreground)] mb-2 truncate">
                    {report.fundName}
                  </p>
                )}

                {/* Update Time */}
                <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(report.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
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
                  状态
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  更新时间
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
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleEdit(report.id)}
                    >
                      <FileText className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)]">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {report.fundName || "-"}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {formatDate(report.updatedAt)}
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
                          onClick: () => handleDelete(report),
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

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="删除报告"
        message={`确定要删除报告 "${deletingReport?.name}" 吗？此操作无法撤销。`}
        confirmText="删除"
        variant="danger"
        loading={actionLoading}
      />

      {/* Batch Delete Confirm Modal */}
      <ConfirmModal
        open={batchDeleteModalOpen}
        onClose={() => setBatchDeleteModalOpen(false)}
        onConfirm={confirmBatchDelete}
        title="批量删除报告"
        message={`确定要删除选中的 ${selectedIds.size} 个报告吗？此操作无法撤销。`}
        confirmText="删除"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
