"use client";

import { User, Construction } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar: string | null;
  token: string;
  onUpdate: (avatarUrl: string) => void;
}

/**
 * 头像上传组件 - 功能开发中
 * TODO: 后端头像上传功能完成后启用上传交互
 */
export function AvatarUpload({ currentAvatar }: AvatarUploadProps) {
  const displayImage = currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--muted)]">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-[var(--muted-foreground)]" />
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
          <Construction className="w-4 h-4" />
          <span>功能开发中</span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          头像上传功能即将上线
        </p>
      </div>
    </div>
  );
}
