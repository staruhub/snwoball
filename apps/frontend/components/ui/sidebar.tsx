"use client";

import {
  FileText,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  PieChart,
  ChevronUp,
} from "lucide-react";

interface NavItem {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  isSection?: boolean;
}

const navItems: NavItem[] = [
  { label: "产品信息", isSection: true },
  { icon: <FileText className="w-6 h-6" />, label: "产品表头" },
  { label: "基础分析", isSection: true },
  { icon: <TrendingUp className="w-6 h-6" />, label: "收益统计", active: true },
  { icon: <ShieldAlert className="w-6 h-6" />, label: "风险统计" },
  { icon: <BarChart2 className="w-6 h-6" />, label: "业绩表现" },
  { label: "股票策略", isSection: true },
  { icon: <PieChart className="w-6 h-6" />, label: "持仓分析" },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col w-[280px] h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
      {/* Header */}
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-[var(--primary)]" />
            <svg className="absolute inset-0" viewBox="0 0 24 24">
              <path d="M0 0L24 0L24 24L0 24L0 12L12 12L12 0L0 0Z" fill="#e5eeff" />
            </svg>
            <div className="absolute w-3 h-3 bg-[var(--sidebar-primary-foreground)] left-1.5 top-1.5" />
          </div>
          <span className="text-base font-medium text-[var(--sidebar-primary-foreground)]">
            基金报告
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col">
        {navItems.map((item, index) =>
          item.isSection ? (
            <div
              key={index}
              className="px-6 py-2 text-sm font-medium text-[var(--sidebar-foreground)]"
            >
              {item.label}
            </div>
          ) : (
            <button
              key={index}
              className={`flex items-center gap-3 px-6 py-3 w-full text-left border-l-2 ${
                item.active
                  ? "bg-[var(--secondary)] text-[var(--sidebar-accent-foreground)] border-l-[var(--primary)]"
                  : "text-[var(--sidebar-foreground)] border-l-transparent hover:bg-[var(--muted)]"
              }`}
            >
              <span className={item.active ? "text-[var(--sidebar-accent-foreground)]" : "text-[var(--sidebar-foreground)]"}>
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </button>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4">
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
