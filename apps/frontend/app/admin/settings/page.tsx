"use client";

// 强制动态渲染，因为使用了客户端功能
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw } from "lucide-react";
import { FormField, Input, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getSystemConfig,
  batchUpdateConfigs,
  type ConfigGroup,
  type ConfigItem,
} from "@/lib/api/admin";

export default function SettingsPage() {
  const [configGroups, setConfigGroups] = useState<ConfigGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  // 从认证 Hook 获取 token
  const { token, requireAuth, isLoading } = useAuth();

  // 认证检查
  useEffect(() => {
    if (isLoading) return;
    requireAuth("/admin/login");
  }, [requireAuth, isLoading]);

  const fetchConfig = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getSystemConfig(token);
      setConfigGroups(response.groups);
      if (response.groups.length > 0 && !activeTab) {
        setActiveTab(response.groups[0].group_name);
      }
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /**
   * 验证 JSON 格式
   */
  const validateJson = (value: string): boolean => {
    if (!value.trim()) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (configKey: string, value: string, configType?: string) => {
    setChanges((prev) => ({ ...prev, [configKey]: value }));
    setHasChanges(true);

    // JSON 类型配置验证
    if (configType === "json") {
      if (!validateJson(value)) {
        setJsonErrors((prev) => ({ ...prev, [configKey]: "无效的 JSON 格式" }));
      } else {
        setJsonErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[configKey];
          return newErrors;
        });
      }
    }
  };

  const handleSave = async () => {
    // 检查是否有 JSON 错误
    if (Object.keys(jsonErrors).length > 0) {
      toast.error("请修正 JSON 格式错误后再保存");
      return;
    }

    const configs = Object.entries(changes).map(([config_key, config_value]) => ({
      config_key,
      config_value,
    }));

    if (configs.length === 0) return;
    if (!token) return;

    setSaving(true);
    try {
      await batchUpdateConfigs(token, configs);
      setChanges({});
      setHasChanges(false);
      fetchConfig();
      toast.success("设置保存成功");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("保存设置失败");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setChanges({});
    setHasChanges(false);
  };

  const getValue = (config: ConfigItem): string => {
    return changes[config.config_key] !== undefined
      ? changes[config.config_key]
      : config.config_value || "";
  };

  const renderConfigInput = (config: ConfigItem) => {
    const value = getValue(config);
    const isReadonly = config.is_readonly;
    const jsonError = jsonErrors[config.config_key];

    switch (config.config_type) {
      case "boolean":
        return (
          <Switch
            checked={value === "true" || value === "1"}
            onChange={(checked) =>
              handleChange(config.config_key, checked ? "true" : "false", config.config_type)
            }
            disabled={isReadonly}
          />
        );
      case "json":
        return (
          <div>
            <Textarea
              value={value}
              onChange={(e) => handleChange(config.config_key, e.target.value, config.config_type)}
              disabled={isReadonly}
              rows={4}
              className={`font-mono text-sm ${jsonError ? "border-red-500" : ""}`}
            />
            {jsonError && (
              <p className="mt-1 text-xs text-red-500">{jsonError}</p>
            )}
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(config.config_key, e.target.value, config.config_type)}
            disabled={isReadonly}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleChange(config.config_key, e.target.value, config.config_type)}
            disabled={isReadonly}
          />
        );
    }
  };

  const activeGroup = configGroups.find((g) => g.group_name === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Settings</h1>
          <p className="text-[var(--muted-foreground)]">Manage system configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2 text-[var(--foreground)] bg-[var(--muted)] disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
          Loading...
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {configGroups.map((group) => (
                <button
                  key={group.group_name}
                  onClick={() => setActiveTab(group.group_name)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    activeTab === group.group_name
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {group.group_name.charAt(0).toUpperCase() + group.group_name.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 bg-[var(--card)] border border-[var(--border)] p-6">
            {activeGroup ? (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-[var(--foreground)] capitalize">
                  {activeGroup.group_name} Settings
                </h2>

                <div className="space-y-6">
                  {activeGroup.items.map((config) => (
                    <div
                      key={config.config_key}
                      className="pb-6 border-b border-[var(--border)] last:border-0 last:pb-0"
                    >
                      <FormField
                        label={
                          <div className="flex items-center gap-2">
                            <span>{config.config_key}</span>
                            {config.is_readonly && (
                              <Badge variant="default" size="sm">
                                readonly
                              </Badge>
                            )}
                            {config.is_public && (
                              <Badge variant="info" size="sm">
                                public
                              </Badge>
                            )}
                          </div>
                        }
                      >
                        {renderConfigInput(config)}
                        {config.description && (
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {config.description}
                          </p>
                        )}
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
                Select a configuration group
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
