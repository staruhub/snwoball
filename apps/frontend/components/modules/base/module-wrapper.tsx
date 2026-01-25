"use client";

import { ReactNode, useState } from "react";
import {
  Lock,
  MoreHorizontal,
  Settings,
  Trash2,
  Copy,
  GripVertical,
} from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { ModuleDefinition, ModuleInstance } from "@/lib/modules/types";

interface ModuleWrapperProps {
  definition: ModuleDefinition;
  instance: ModuleInstance;
  children: ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onConfigOpen?: () => void;
  className?: string;
}

export function ModuleWrapper({
  definition,
  instance,
  children,
  isSelected = false,
  onSelect,
  onDelete,
  onDuplicate,
  onConfigOpen,
  className = "",
}: ModuleWrapperProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`
        flex flex-col bg-[var(--card)] border shadow-sm transition-all
        ${isSelected ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20" : "border-[var(--border)]"}
        ${className}
      `}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4">
        {/* 拖拽手柄 */}
        <GripVertical className="w-4 h-4 text-[var(--muted-foreground)] cursor-grab hover:text-[var(--foreground)]" />

        {/* 模块标题 */}
        <span className="text-base font-medium text-[var(--foreground)]">
          {definition.name}
        </span>

        <div className="flex-1" />

        {/* 操作按钮 */}
        <IconButton
          icon={<Settings className="w-4 h-4 text-[var(--foreground)]" />}
          onClick={(e) => {
            e.stopPropagation();
            onConfigOpen?.();
          }}
        />
        <IconButton
          icon={<Lock className="w-4 h-4 text-[var(--foreground)]" />}
        />

        {/* 更多菜单 */}
        <div className="relative">
          <IconButton
            icon={
              <MoreHorizontal className="w-4 h-4 text-[var(--foreground)]" />
            }
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          />

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--popover)] border border-[var(--border)] rounded shadow-lg z-10">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate?.();
                  setShowMenu(false);
                }}
              >
                <Copy className="w-4 h-4" />
                复制模块
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-[var(--muted)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setShowMenu(false);
                }}
              >
                <Trash2 className="w-4 h-4" />
                删除模块
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

// 加载状态占位
export function ModuleLoading() {
  return (
    <div className="flex items-center justify-center h-24 text-[var(--muted-foreground)]">
      加载中...
    </div>
  );
}

// 错误状态
export function ModuleError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-24 text-red-500">
      {message}
    </div>
  );
}

// 空状态
export function ModuleEmpty({ message = "暂无数据" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-24 text-[var(--muted-foreground)]">
      {message}
    </div>
  );
}
