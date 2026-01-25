"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  PieChart,
  ChevronUp,
  ChevronDown,
  Plus,
  Target,
  Layers,
  Activity,
} from "lucide-react";
import {
  moduleRegistry,
  MODULE_CATEGORIES,
  type ModuleDefinition,
  type ModuleCategory,
} from "@/lib/modules";

// 分类图标映射
const categoryIcons: Record<ModuleCategory, React.ReactNode> = {
  "product-info": <FileText className="w-5 h-5" />,
  "return-stats": <TrendingUp className="w-5 h-5" />,
  "risk-stats": <ShieldAlert className="w-5 h-5" />,
  "performance": <BarChart2 className="w-5 h-5" />,
  "portfolio": <PieChart className="w-5 h-5" />,
  "attribution": <Target className="w-5 h-5" />,
  "equity-strategy": <Layers className="w-5 h-5" />,
  "bond-strategy": <Activity className="w-5 h-5" />,
  "fof-analysis": <Layers className="w-5 h-5" />,
  "risk-monitor": <ShieldAlert className="w-5 h-5" />,
  "comparison": <BarChart2 className="w-5 h-5" />,
  "custom": <Plus className="w-5 h-5" />,
};

interface SidebarProps {
  onModuleAdd?: (moduleId: string) => void;
}

export function Sidebar({ onModuleAdd }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["product-info", "return-stats"])
  );
  const [groupedModules, setGroupedModules] = useState<
    Map<ModuleCategory, ModuleDefinition[]>
  >(new Map());

  // 加载模块分组
  useEffect(() => {
    setGroupedModules(moduleRegistry.getGroupedModules());
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleModuleClick = (moduleId: string) => {
    onModuleAdd?.(moduleId);
  };

  return (
    <aside className="flex flex-col w-[280px] h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
      {/* Header */}
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-[var(--primary)]" />
            <svg className="absolute inset-0" viewBox="0 0 24 24">
              <path
                d="M0 0L24 0L24 24L0 24L0 12L12 12L12 0L0 0Z"
                fill="#e5eeff"
              />
            </svg>
            <div className="absolute w-3 h-3 bg-[var(--sidebar-primary-foreground)] left-1.5 top-1.5" />
          </div>
          <span className="text-base font-medium text-[var(--sidebar-primary-foreground)]">
            基金报告
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col overflow-y-auto">
        {MODULE_CATEGORIES.map((category) => {
          const modules = groupedModules.get(category.id) || [];
          if (modules.length === 0) return null;

          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id}>
              {/* 分类标题 */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-2 w-full px-6 py-2 text-left hover:bg-[var(--muted)]"
              >
                <span className="text-[var(--sidebar-foreground)]">
                  {categoryIcons[category.id]}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--sidebar-foreground)]">
                  {category.label}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {modules.length}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
                )}
              </button>

              {/* 模块列表 */}
              {isExpanded && (
                <div className="pb-2">
                  {modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id)}
                      className="flex items-center gap-3 w-full px-6 pl-10 py-2 text-left text-[var(--sidebar-foreground)] hover:bg-[var(--muted)] group"
                    >
                      <span className="flex-1 text-sm">{module.name}</span>
                      <Plus className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--sidebar-border)]">
        <div className="flex-1 flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[var(--sidebar-foreground)]">
            投资经理
          </span>
          <span className="text-xs text-[var(--sidebar-foreground)]">
            manager@fund.com
          </span>
        </div>
        <ChevronUp className="w-6 h-6 text-[var(--sidebar-foreground)]" />
      </div>
    </aside>
  );
}
