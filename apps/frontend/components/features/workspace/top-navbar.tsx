"use client";

import Link from "next/link";
import { GlobalSearch } from "./global-search";
import { NotificationPopover } from "./notification-popover";
import { UserDropdown } from "./user-dropdown";

interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className = "" }: TopNavbarProps) {
  return (
    <header
      className={`flex items-center justify-between h-14 px-6 bg-[var(--card)] border-b border-[var(--border)] ${className}`}
    >
      {/* 左侧 - Logo */}
      <div className="flex items-center gap-6">
        <Link href="/workspace" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="text-base font-semibold text-[var(--foreground)]">
            SnowballFund
          </span>
        </Link>
      </div>

      {/* 中间 - 全局搜索 */}
      <div className="flex-1 flex justify-center max-w-xl mx-8">
        <GlobalSearch className="w-full" />
      </div>

      {/* 右侧 - 通知和用户 */}
      <div className="flex items-center gap-2">
        <NotificationPopover />
        <UserDropdown />
      </div>
    </header>
  );
}
