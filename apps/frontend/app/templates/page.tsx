"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Star,
  Grid,
  List,
  Loader2,
  Eye,
  Copy,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import {
  type Template,
  type TemplateType,
  getTemplates,
  toggleTemplateFavorite,
  templateTypeLabels,
} from "@/lib/api/templates";
import { createReportFromTemplate } from "@/lib/api/reports";

type CategoryFilter = "all" | TemplateType;
type ViewMode = "card" | "list";

export default function TemplatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);

  // 筛选
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [showFavorites, setShowFavorites] = useState(false);

  // 预览弹窗
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [creating, setCreating] = useState(false);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "weekly", label: "周报" },
    { id: "monthly", label: "月报" },
    { id: "quarterly", label: "季报" },
    { id: "annual", label: "年报" },
    { id: "special", label: "专项" },
  ];

  useEffect(() => {
    loadTemplates();
  }, [keyword, category, page, pageSize, showFavorites]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        keyword: keyword || undefined,
        type: category === "all" ? undefined : category,
        favoriteOnly: showFavorites,
      };
      const result = await getTemplates(params);
      setTemplates(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = async (template: Template) => {
    setCreating(true);
    try {
      const report = await createReportFromTemplate(template.id, {
        name: `${template.name} - 副本`,
      });
      router.push(`/editor/${report.id}`);
    } catch (error) {
      console.error("Failed to create report from template:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleFavorite = async (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleTemplateFavorite(template.id);
      loadTemplates();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            模板中心
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            选择模板快速创建专业的基金分析报告
          </p>
        </div>
        <button
          onClick={() => router.push("/editor/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-sm hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          空白报告
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-[var(--card)] border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 搜索 */}
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="搜索模板..."
            className="w-64"
          />

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-sm border transition-colors ${
                  category === cat.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 收藏筛选 */}
          <button
            onClick={() => {
              setShowFavorites(!showFavorites);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${
              showFavorites
                ? "bg-amber-50 text-amber-600 border-amber-300"
                : "text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
            }`}
          >
            <Star className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
            收藏
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
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-[var(--muted)] text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--card)] border border-[var(--border)]">
          <FileText className="w-16 h-16 text-[var(--muted-foreground)] mb-4" />
          <p className="text-lg text-[var(--foreground)]">
            {showFavorites ? "暂无收藏模板" : "暂无模板"}
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {showFavorites ? "收藏您喜欢的模板以便快速访问" : "系统模板即将上线"}
          </p>
        </div>
      ) : viewMode === "card" ? (
        /* 卡片视图 */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm transition-all cursor-pointer overflow-hidden"
              onClick={() => handlePreview(template)}
            >
              {/* 预览图 */}
              <div className="aspect-[4/3] bg-[var(--muted)] flex items-center justify-center">
                {template.previewUrl ? (
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-[var(--muted-foreground)]" />
                )}
              </div>

              {/* 收藏按钮 */}
              <button
                onClick={(e) => handleToggleFavorite(template, e)}
                className={`absolute top-2 right-2 p-1.5 rounded bg-white/80 backdrop-blur-sm transition-colors ${
                  template.isFavorite
                    ? "text-amber-500"
                    : "text-gray-400 hover:text-amber-500"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${template.isFavorite ? "fill-current" : ""}`}
                />
              </button>

              {/* 操作按钮 - hover 显示 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 text-sm hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4" />
                  预览
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  disabled={creating}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm hover:opacity-90 disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                  使用
                </button>
              </div>

              {/* 信息 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-1">
                    {template.name}
                  </h3>
                  <Badge variant="info" size="sm">
                    {templateTypeLabels[template.type]}
                  </Badge>
                </div>
                {template.description && (
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span>{template.moduleCount ? `${template.moduleCount} 个模块` : ""}</span>
                  <span>{formatDate(template.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 列表视图 */
        <div className="bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  模板名称
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  类型
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  描述
                </th>
                <th className="text-left p-3 text-sm font-medium text-[var(--muted-foreground)]">
                  更新时间
                </th>
                <th className="w-32 p-3 text-center text-sm font-medium text-[var(--muted-foreground)]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)]"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm text-[var(--foreground)]">
                        {template.name}
                      </span>
                      {template.isFavorite && (
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="info" size="sm">
                      {templateTypeLabels[template.type]}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)] max-w-xs truncate">
                    {template.description || "-"}
                  </td>
                  <td className="p-3 text-sm text-[var(--muted-foreground)]">
                    {formatDate(template.updatedAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        disabled={creating}
                        className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded disabled:opacity-50"
                        title="使用此模板"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleToggleFavorite(template, e)}
                        className={`p-1.5 rounded ${
                          template.isFavorite
                            ? "text-amber-500"
                            : "text-[var(--muted-foreground)] hover:text-amber-500"
                        }`}
                        title={template.isFavorite ? "取消收藏" : "收藏"}
                      >
                        <Star
                          className={`w-4 h-4 ${template.isFavorite ? "fill-current" : ""}`}
                        />
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

      {/* 预览弹窗 */}
      <Modal
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name || "模板预览"}
        width="800px"
        footer={
          <>
            <button
              onClick={() => setPreviewTemplate(null)}
              className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--muted)]"
            >
              关闭
            </button>
            <button
              onClick={() => {
                if (previewTemplate) {
                  handleUseTemplate(previewTemplate);
                }
              }}
              disabled={creating}
              className="px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              {creating ? "创建中..." : "使用此模板"}
            </button>
          </>
        }
      >
        {previewTemplate && (
          <div className="space-y-4">
            {/* 预览图 */}
            <div className="aspect-video bg-[var(--muted)] flex items-center justify-center rounded overflow-hidden">
              {previewTemplate.previewUrl ? (
                <img
                  src={previewTemplate.previewUrl}
                  alt={previewTemplate.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-[var(--muted-foreground)]">
                  <FileText className="w-16 h-16 mb-2" />
                  <span className="text-sm">暂无预览图</span>
                </div>
              )}
            </div>

            {/* 模板信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-[var(--muted-foreground)]">类型</span>
                <p className="text-[var(--foreground)]">
                  {templateTypeLabels[previewTemplate.type]}
                </p>
              </div>
              <div>
                <span className="text-sm text-[var(--muted-foreground)]">模块数量</span>
                <p className="text-[var(--foreground)]">
                  {previewTemplate.moduleCount || "-"} 个
                </p>
              </div>
              <div>
                <span className="text-sm text-[var(--muted-foreground)]">创建时间</span>
                <p className="text-[var(--foreground)]">
                  {formatDate(previewTemplate.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm text-[var(--muted-foreground)]">更新时间</span>
                <p className="text-[var(--foreground)]">
                  {formatDate(previewTemplate.updatedAt)}
                </p>
              </div>
            </div>

            {previewTemplate.description && (
              <div>
                <span className="text-sm text-[var(--muted-foreground)]">描述</span>
                <p className="text-[var(--foreground)] mt-1">
                  {previewTemplate.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
