"use client";

import { Card } from "@/components/ui/card";
import { PasswordChangeForm } from "@/components/features/settings";
import { useUserStore } from "@/stores";
import { Lock, Smartphone, Mail, Shield } from "lucide-react";

export default function AccountPage() {
  const { token, profile } = useUserStore();

  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">请先登录</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">账户设置</h1>
        <p className="text-[var(--muted-foreground)]">管理您的账户安全设置</p>
      </div>

      {/* 修改密码 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">修改密码</h2>
        </div>
        <PasswordChangeForm token={token} />
      </Card>

      {/* 绑定手机号（预留） */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">绑定手机号</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--foreground)]">
              {profile?.phone
                ? `已绑定：${profile.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}`
                : "未绑定"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              用于账户安全验证和找回密码
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] rounded cursor-not-allowed"
          >
            暂不可用
          </button>
        </div>
      </Card>

      {/* 绑定邮箱（预留） */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">绑定邮箱</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--foreground)]">
              {profile?.email ? `已绑定：${profile.email}` : "未绑定"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              用于接收通知和找回密码
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] rounded cursor-not-allowed"
          >
            暂不可用
          </button>
        </div>
      </Card>

      {/* 双因素认证（预留） */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">双因素认证</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--foreground)]">未开启</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              开启后登录时需要额外验证，提高账户安全性
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] rounded cursor-not-allowed"
          >
            暂不可用
          </button>
        </div>
      </Card>
    </div>
  );
}
