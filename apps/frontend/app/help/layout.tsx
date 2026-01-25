"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calculator,
  HelpCircle,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { href: "/help/getting-started", label: "快速入门", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/help/indicators", label: "指标说明", icon: <Calculator className="w-5 h-5" /> },
  { href: "/help/faq", label: "常见问题", icon: <HelpCircle className="w-5 h-5" /> },
  { href: "/help/contact", label: "联系客服", icon: <MessageCircle className="w-5 h-5" /> },
];

export default function HelpLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="text-lg font-semibold text-[var(--foreground)]">
                帮助中心
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-[var(--muted)] rounded"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-[var(--muted-foreground)]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 mb-1 rounded transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
