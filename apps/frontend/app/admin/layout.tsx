"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Shield,
  LayoutGrid,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
} from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/roles", label: "Roles", icon: <Shield className="w-5 h-5" /> },
  { href: "/admin/modules", label: "Modules", icon: <LayoutGrid className="w-5 h-5" /> },
  { href: "/admin/templates", label: "Templates", icon: <FileText className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, logout, profile } = useUserStore();

  // 认证检查：未登录时重定向到登录页（跳过登录页本身）
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  // 登录页面不显示侧边栏布局
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 未认证时显示加载状态（防止闪烁）
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--muted-foreground)]">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[var(--card)] border-r border-[var(--border)] transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <span className="text-lg font-semibold text-[var(--foreground)]">
              Admin
            </span>
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
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 mb-1 rounded transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.icon}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-[var(--border)] p-4">
          {!collapsed && profile && (
            <div className="mb-3 text-sm">
              <div className="font-medium text-[var(--foreground)]">
                {profile.nickname || profile.username}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {profile.email || profile.username}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
