"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Search, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import {
  getTemplates,
  getTemplateTypeLabel,
  type Template,
  type TemplateType,
} from "@/lib/api/templates";
import { createReportFromTemplate } from "@/lib/api/reports";
import { useWorkspaceStore } from "@/stores";

interface TemplateSelectModalProps {
  open: boolean;
  onClose: () => void;
}

const templateTypes: { value: TemplateType | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "weekly", label: "周报" },
  { value: "monthly", label: "月报" },
  { value: "quarterly", label: "季报" },
  { value: "annual", label: "年报" },
  { value: "special", label: "专项" },
];

export function TemplateSelectModal({ open, onClose }: TemplateSelectModalProps) {
  const router = useRouter();
  const { addReport } = useWorkspaceStore();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TemplateType | "all">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // 加载模板列表
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open, selectedType]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params: { type?: TemplateType; keyword?: string } = {};
      if (selectedType !== "all") {
        params.type = selectedType;
      }
      if (searchQuery) {
        params.keyword = searchQuery;
      }
      const result = await getTemplates(params);
      setTemplates(result.items);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索时重新加载
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        loadTemplates();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    setCreating(true);
    try {
      const newReport = await createReportFromTemplate(selectedTemplate.id, {
        name: `${selectedTemplate.name} - ${new Date().toLocaleDateString("zh-CN")}`,
      });
      addReport(newReport);
      onClose();
      router.push(`/editor/${newReport.id}`);
    } catch (error) {
      console.error("Failed to create report from template:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="选择模板"
      width="700px"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateFromTemplate}
            className={!selectedTemplate || creating ? "opacity-50 cursor-not-allowed" : ""}
          >
            {creating ? "创建中..." : "使用模板"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* 搜索和筛选 */}
        <div className="flex gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索模板..."
            className="flex-1"
          />
        </div>

        {/* 类型筛选 */}
        <div className="flex gap-2 flex-wrap">
          {templateTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedType === type.value
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="border border-[var(--border)] max-h-80 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
              <LayoutTemplate className="w-10 h-10 mb-2" />
              <p className="text-sm">未找到模板</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? "bg-[var(--primary)]/10"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded">
                    <LayoutTemplate className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {template.name}
                      </span>
                      <Badge variant="info" size="sm">
                        {getTemplateTypeLabel(template.type)}
                      </Badge>
                    </div>
                    {template.description && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                        {template.description}
                      </p>
                    )}
                  </div>
                  {template.moduleCount && (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {template.moduleCount} 模块
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 选中模板信息 */}
        {selectedTemplate && (
          <div className="p-4 bg-[var(--muted)] rounded">
            <div className="flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-[var(--foreground)]">
                {selectedTemplate.name}
              </span>
            </div>
            {selectedTemplate.description && (
              <p className="text-sm text-[var(--muted-foreground)]">
                {selectedTemplate.description}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
