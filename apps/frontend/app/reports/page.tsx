"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Clock,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Download,
  Archive,
  RotateCcw,
  Loader2,
  Plus,
} from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { Tabs } from "@/components/ui/tabs";
import {
  type Report,
  type ReportListParams,
  getReports,
  duplicateReport,
  deleteReport,
} from "@/lib/api/reports";

type ViewMode = "card" | "table";
type SortField = "updatedAt" | "createdAt" | "name";
type SortOrder = "asc" | "desc";

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);

  // 筛选和排序
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "completed">("all");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // 批量操作
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchMode, setBatchMode] = useState(false);

  useEffect(() => {
    loadReports();
  }, [keyword, statusFilter, page, pageSize]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params: ReportListParams = {
        page,
        pageSize,
        keyword: keyword || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      };
      const result = await getReports(params);
      setReports(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // 排序（前端排序）
  const sortedReports = [...reports].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    if (sortField === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortField === "createdAt") {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    } else {
      aVal = new Date(a.updatedAt).getTime();
      bVal = new Date(b.updatedAt).getTime();
    }

    if (sortOrder === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const handleEdit = (reportId: string) => {
    router.push(`/editor/${reportId}`);
  };

  const handleDuplicate = async (report: Report) => {
    try {
      const newReport = await duplicateReport(report.id);
      router.push(`/editor/${newReport.id}`);
    } catch (error) {
      console.error("Failed to duplicate report:", error);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("确定要删除这个报告吗？")) return;
    try {
      await deleteReport(reportId);
      loadReports();
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个报告吗？`)) return;

    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteReport(id)));
      setSelectedIds(new Set());
      setBatchMode(false);
      loadReports();
    } catch (error) {
      console.error("Failed to batch delete reports:", error);
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
    if (selectedIds.size === sortedReports.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedReports.map(r => r.id)));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  const sortOptions = [
    { value: "updatedAt-desc", label: "最近更新" },
    { value: "updatedAt-asc", label: "最早更新" },
    { value: "createdAt-desc", label: "最近创建" },
    { value: "createdAt-asc", label: "最早创建" },
    { value: "name-asc", label: "名称 A-Z" },
    { value: "name-desc", label: "名称 Z-A" },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            报告管理
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            管理您创建的所有基金分析报告
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/reports/trash")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--muted)]"
          >
            <Trash2 className="w-4 h-4" />
            回收站
          </button>
          <button
            onClick={() => router.push("/editor/new")}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            新建报告
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[var(--card)] border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 搜索 */}
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="搜索报告..."
            className="w-64"
          />

          {/* 状态筛选 */}
          <Tabs
            tabs={[
              { id: "all", label: "全部" },
              { id: "draft", label: "草稿" },
              { id: "completed", label: "已完成" },
            ]}
            activeTab={statusFilter}
            onChange={(id) => setStatusFilter(id as typeof statusFilter)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* 排序 */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]">
                <ArrowUpDown className="w-4 h-4" />
                排序
              </button>
            }
            items={sortOptions.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => handleSortChange(opt.value),
            }))}
            align="right"
          />

          {/* 批量操作 */}
          <button
            onClick={() => {
              setBatchMode(!batchMode);
              setSelectedIds(new Set());
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] ${
              batchMode
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            批量操作
          </button>

          {/* 视图切换 */}
          <div className="flex border border-[var(--border)]">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 ${
                viewMode === "card"
                  ? "bg-[var(--muted)] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${
                viewMode === "table"
                  ? "bg-[var(--muted)] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 批量操作栏 */}
      {batchMode && (
        <div className="flex items-center justify-between bg-[var(--muted)] border border-[var(--border)] p-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.size === sortedReports.length && sortedReports.length > 0}
              onChange={toggleSelectAll}
              label={`已选中 ${selectedIds.size} 项`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--destructive)] border border-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--card)] border border-[var(--border)]">
          <FileText className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
          <p className="text-lg text-[var(--foreground)]">暂无报告</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            点击「新建报告」开始创建您的第一个分析报告
          </p>
        </div>
      ) : viewMode === "card" ? (
        /* 卡片视图 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedReports.map((report) => (
            <div
              key={report.id}
              className={`group relative bg-[var(--card)] border hover:shadow-sm transition-all ${
                batchMode && selectedIds.has(report.id)
                  ? "border-[var(--primary)]"
                  : "border-[var(--border)] hover:border-[var(--primary)]"
              } ${batchMode ? "" : "cursor-pointer"}`}
              onClick={() => (batchMode ? toggleSelect(report.id) : handleEdit(report.id))}
            >
              {batchMode && (
                <div className="absolute top-3 left-3 z-10">
                  <Checkbox
                    checked={selectedIds.has(report.id)}
                    onChange={() => toggleSelect(report.id)}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--primary)]" />
                    <Badge
                      variant={report.status === "completed" ? "success" : "default"}
                    >
                      {report.status === "completed" ? "已完成" : "草稿"}
                    </Badge>
                  </div>
                  {!batchMode && (
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
                  )}
                </div>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-1 line-clamp-2">
                  {report.name}
                </h3>
                {report.fundName && (
                  <p className="text-xs text-[var(--muted-foreground)] mb-2 truncate">
                    {report.fundName}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(report.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 表格视图 */
        <div className="bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                {batchMode && (
                  <th className="w-12 p-3">
                    <Checkbox
                      checked={selectedIds.size === sortedReports.length && sortedReports.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  报告名称
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  关联基金
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  状态
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  更新时间
                </th>
                <th className="w-20 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {sortedReports.map((report) => (
                <tr
                  key={report.id}
                  className={`border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)] ${
                    batchMode ? "" : "cursor-pointer"
                  }`}
                  onClick={() => (batchMode ? toggleSelect(report.id) : handleEdit(report.id))}
                >
                  {batchMode && (
                    <td className="p-3">
                      <Checkbox
                        checked={selectedIds.has(report.id)}
                        onChange={() => toggleSelect(report.id)}
                      />
                    </td>
                  )}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--foreground)]">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)]">
                    {report.fundName || "-"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={report.status === "completed" ? "success" : "default"}
                    >
                      {report.status === "completed" ? "已完成" : "草稿"}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)]">
                    {formatDate(report.updatedAt)}
                  </td>
                  <td className="p-3">
                    {!batchMode && (
                      <Dropdown
                        trigger={
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded"
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
                    )}
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
