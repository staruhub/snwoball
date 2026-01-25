"use client";

import { LoginHistoryItem } from "@/lib/api/settings";
import { Monitor, Smartphone, Tablet, CheckCircle, XCircle } from "lucide-react";

interface LoginHistoryTableProps {
  items: LoginHistoryItem[];
  loading: boolean;
}

export function LoginHistoryTable({ items, loading }: LoginHistoryTableProps) {
  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLoginTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      password: "密码登录",
      wechat: "微信登录",
      sms: "短信登录",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        暂无登录记录
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              登录时间
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              登录方式
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              设备
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              IP 地址
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
              状态
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[var(--border)] hover:bg-[var(--muted)]/50 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                {formatTime(item.login_time)}
              </td>
              <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                {getLoginTypeLabel(item.login_type)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  {getDeviceIcon(item.device_type)}
                  <span>
                    {item.browser || "-"} / {item.os || "-"}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">
                {item.ip_address || "-"}
              </td>
              <td className="py-3 px-4 text-center">
                {item.status === 1 ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
