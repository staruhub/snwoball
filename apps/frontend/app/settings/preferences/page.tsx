"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PreferencesForm } from "@/components/features/settings";
import { useUserStore } from "@/stores";
import { getPreferences, UserPreferences } from "@/lib/api/settings";

export default function PreferencesPage() {
  const { token, preferences, setPreferences } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!token) {
        setError("请先登录");
        setLoading(false);
        return;
      }

      try {
        const data = await getPreferences(token);
        setPreferences(data);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "获取偏好设置失败");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [token, setPreferences]);

  const handleUpdate = (updated: UserPreferences) => {
    setPreferences(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!preferences || !token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">请先登录</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">偏好设置</h1>
        <p className="text-[var(--muted-foreground)]">自定义您的使用偏好</p>
      </div>

      <Card className="p-6">
        <PreferencesForm
          preferences={preferences}
          token={token}
          onUpdate={handleUpdate}
        />
      </Card>
    </div>
  );
}
