"use client";

import { useState } from "react";
import { FormField, Select } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UserPreferences, PreferencesUpdateData, updatePreferences } from "@/lib/api/settings";
import { applyTheme, Theme } from "@/lib/utils/theme";

interface PreferencesFormProps {
  preferences: UserPreferences;
  token: string;
  onUpdate: (preferences: UserPreferences) => void;
}

const dateRangeOptions = [
  { value: "since_inception", label: "成立以来" },
  { value: "1y", label: "近1年" },
  { value: "3y", label: "近3年" },
  { value: "5y", label: "近5年" },
  { value: "ytd", label: "今年以来" },
];

const navTypeOptions = [
  { value: "adjusted", label: "复权净值" },
  { value: "unit", label: "单位净值" },
  { value: "cumulative", label: "累计净值" },
];

const themeOptions = [
  { value: "system", label: "跟随系统" },
  { value: "light", label: "浅色模式" },
  { value: "dark", label: "深色模式" },
];

export function PreferencesForm({ preferences, token, onUpdate }: PreferencesFormProps) {
  const [formData, setFormData] = useState<PreferencesUpdateData>({
    default_date_range: preferences.default_date_range,
    default_nav_type: preferences.default_nav_type,
    theme: preferences.theme,
    notify_login: preferences.notify_login,
    notify_report: preferences.notify_report,
    notify_system: preferences.notify_system,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (field: keyof PreferencesUpdateData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updated = await updatePreferences(token, formData);
      onUpdate(updated);
      setMessage({ type: "success", text: "保存成功" });

      // 应用主题变更
      if (formData.theme) {
        applyTheme(formData.theme as Theme);
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setMessage({ type: "error", text: err.message || "保存失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-3 text-sm rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 显示设置 */}
      <div>
        <h3 className="text-base font-medium text-[var(--foreground)] mb-4">显示设置</h3>
        <div className="space-y-4">
          <FormField label="默认日期范围">
            <Select
              value={formData.default_date_range}
              onChange={(e) => handleChange("default_date_range", e.target.value)}
              options={dateRangeOptions}
            />
          </FormField>

          <FormField label="默认净值类型">
            <Select
              value={formData.default_nav_type}
              onChange={(e) => handleChange("default_nav_type", e.target.value)}
              options={navTypeOptions}
            />
          </FormField>

          <FormField label="界面主题">
            <Select
              value={formData.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              options={themeOptions}
            />
          </FormField>
        </div>
      </div>

      {/* 通知设置 */}
      <div>
        <h3 className="text-base font-medium text-[var(--foreground)] mb-4">通知设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">登录通知</p>
              <p className="text-xs text-[var(--muted-foreground)]">账户登录时发送通知</p>
            </div>
            <Switch
              checked={formData.notify_login ?? true}
              onChange={(checked) => handleChange("notify_login", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">报告通知</p>
              <p className="text-xs text-[var(--muted-foreground)]">报告生成、导出完成时发送通知</p>
            </div>
            <Switch
              checked={formData.notify_report ?? true}
              onChange={(checked) => handleChange("notify_report", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">系统通知</p>
              <p className="text-xs text-[var(--muted-foreground)]">系统更新、维护等通知</p>
            </div>
            <Switch
              checked={formData.notify_system ?? true}
              onChange={(checked) => handleChange("notify_system", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </form>
  );
}
