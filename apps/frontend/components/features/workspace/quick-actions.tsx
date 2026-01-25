"use client";

import { useRouter } from "next/navigation";
import { Plus, LayoutTemplate, Upload } from "lucide-react";
import { useWorkspaceStore } from "@/stores";

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = "" }: QuickActionsProps) {
  const router = useRouter();
  const { setTemplateModalOpen } = useWorkspaceStore();

  const actions = [
    {
      key: "new-report",
      icon: <Plus className="w-6 h-6" />,
      title: "新建报告",
      description: "从空白画布开始创建",
      color: "bg-blue-500",
      onClick: () => router.push("/editor/new"),
    },
    {
      key: "from-template",
      icon: <LayoutTemplate className="w-6 h-6" />,
      title: "从模板创建",
      description: "选择模板快速开始",
      color: "bg-purple-500",
      onClick: () => setTemplateModalOpen(true),
    },
    {
      key: "import",
      icon: <Upload className="w-6 h-6" />,
      title: "导入报告",
      description: "导入已有的报告文件",
      color: "bg-green-500",
      onClick: () => {
        // TODO: 实现导入功能
        console.log("Import report");
      },
    },
  ];

  return (
    <div className={className}>
      <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
        快捷入口
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.onClick}
            className="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-sm transition-all text-left"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg text-white ${action.color}`}
            >
              {action.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--foreground)]">
                {action.title}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
