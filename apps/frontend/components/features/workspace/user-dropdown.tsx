"use client";

import { useRouter } from "next/navigation";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";
import { useUserStore } from "@/stores";

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className = "" }: UserDropdownProps) {
  const router = useRouter();
  const { profile, logout } = useUserStore();

  const userName = profile?.nickname || profile?.username || profile?.email || "用户";
  const userEmail = profile?.email || "";
  const userAvatar = profile?.avatar ?? undefined;

  const menuItems = [
    {
      key: "profile",
      label: "个人中心",
      icon: <User className="w-4 h-4" />,
      onClick: () => router.push("/settings/profile"),
    },
    {
      key: "settings",
      label: "账户设置",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => router.push("/settings"),
    },
    {
      key: "help",
      label: "帮助文档",
      icon: <HelpCircle className="w-4 h-4" />,
      onClick: () => window.open("/docs", "_blank"),
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => {
        logout();
        router.push("/login");
      },
    },
  ];

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-[var(--muted)] rounded">
          <Avatar
            src={userAvatar}
            alt={userName}
            fallback={userName.charAt(0)}
            size="md"
          />
          <span className="text-sm font-medium text-[var(--foreground)] hidden sm:block">
            {userName}
          </span>
        </div>
      }
      items={menuItems}
      align="right"
      className={className}
    />
  );
}
