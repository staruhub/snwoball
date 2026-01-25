"use client";

import { useRouter } from "next/navigation";
import { LayoutTemplate, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  type Template,
  getTemplateTypeLabel,
} from "@/lib/api/templates";
import { useWorkspaceStore } from "@/stores";

interface FavoriteTemplatesProps {
  templates: Template[];
  className?: string;
}

export function FavoriteTemplates({
  templates,
  className = "",
}: FavoriteTemplatesProps) {
  const router = useRouter();
  const { addReport } = useWorkspaceStore();

  const handleUseTemplate = async (template: Template) => {
    try {
      // 动态导入 createReportFromTemplate
      const { createReportFromTemplate } = await import("@/lib/api/reports");
      const newReport = await createReportFromTemplate(template.id, {
        name: `${template.name} - ${new Date().toLocaleDateString("zh-CN")}`,
      });
      addReport(newReport);
      router.push(`/editor/${newReport.id}`);
    } catch (error) {
      console.error("Failed to create report from template:", error);
    }
  };

  if (templates.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
          收藏模板
        </h2>
        <div className="flex flex-col items-center justify-center py-12 bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
          <Star className="w-12 h-12 mb-3" />
          <p className="text-sm">暂无收藏模板</p>
          <p className="text-xs mt-1">在模板库中收藏常用模板</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[var(--foreground)]">
          收藏模板
        </h2>
        <button
          onClick={() => router.push("/templates")}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          查看全部
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm transition-all"
          >
            {/* 卡片内容 */}
            <div className="p-4">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-purple-500" />
                  <Badge variant="info">
                    {getTemplateTypeLabel(template.type)}
                  </Badge>
                </div>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>

              {/* 标题 */}
              <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
                {template.name}
              </h3>

              {/* 描述 */}
              {template.description && (
                <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}

              {/* 模块数量 */}
              {template.moduleCount && (
                <p className="text-xs text-[var(--muted-foreground)] mb-3">
                  {template.moduleCount} 个模块
                </p>
              )}

              {/* 使用按钮 */}
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 transition-colors"
              >
                使用此模板
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
