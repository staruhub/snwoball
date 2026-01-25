"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronDown, Eye, EyeOff, Edit } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { FormField, Input, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getModuleTree,
  updateModule,
  type Module,
  type UpdateModuleRequest,
} from "@/lib/api/admin";

interface ModuleNodeProps {
  module: Module;
  level: number;
  onEdit: (module: Module) => void;
}

function ModuleNode({ module, level, onEdit }: ModuleNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = module.children && module.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-3 hover:bg-[var(--muted)] border-b border-[var(--border)]`}
        style={{ paddingLeft: `${level * 24 + 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-[var(--background)] rounded"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <span className="text-lg">{module.icon || "📁"}</span>
        <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
          {module.module_name}
        </span>

        <Badge variant="default" size="sm">
          {module.module_code}
        </Badge>

        {module.path && (
          <span className="text-xs text-[var(--muted-foreground)]">{module.path}</span>
        )}

        <StatusBadge status={module.status === 1 ? "active" : "inactive"} />

        {module.is_visible ? (
          <Eye className="w-4 h-4 text-[var(--muted-foreground)]" />
        ) : (
          <EyeOff className="w-4 h-4 text-[var(--muted-foreground)]" />
        )}

        <button
          onClick={() => onEdit(module)}
          className="p-1.5 hover:bg-[var(--background)] rounded"
        >
          <Edit className="w-4 h-4 text-[var(--muted-foreground)]" />
        </button>
      </div>

      {hasChildren && expanded && (
        <div>
          {module.children.map((child) => (
            <ModuleNode key={child.id} module={child} level={level + 1} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeHidden, setIncludeHidden] = useState(true);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    module_name: "",
    description: "",
    icon: "",
    path: "",
    status: 1,
    is_visible: true,
  });

  // 从认证 Hook 获取 token
  const { token, requireAuth } = useAuth();

  // 认证检查
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  const fetchModules = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getModuleTree(token, includeHidden);
      setModules(response.items);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    } finally {
      setLoading(false);
    }
  }, [token, includeHidden]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      module_name: module.module_name,
      description: module.description || "",
      icon: module.icon || "",
      path: module.path || "",
      status: module.status,
      is_visible: module.is_visible,
    });
    setEditModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!editingModule || !token) return;

    setActionLoading(true);
    try {
      const data: UpdateModuleRequest = {
        module_name: formData.module_name,
        description: formData.description || undefined,
        icon: formData.icon || undefined,
        path: formData.path || undefined,
        status: formData.status,
        is_visible: formData.is_visible,
      };
      await updateModule(token, editingModule.id, data);
      setEditModalOpen(false);
      toast.success("模块更新成功");
      fetchModules();
    } catch (error) {
      console.error("Failed to update module:", error);
      toast.error("更新模块失败");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Modules</h1>
          <p className="text-[var(--muted-foreground)]">Manage system modules and menu structure</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">Show hidden</span>
          <Switch checked={includeHidden} onChange={setIncludeHidden} />
        </div>
      </div>

      {/* Module Tree */}
      <div className="bg-[var(--card)] border border-[var(--border)]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
            Loading...
          </div>
        ) : modules.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
            No modules found
          </div>
        ) : (
          modules.map((module) => (
            <ModuleNode key={module.id} module={module} level={0} onEdit={handleEdit} />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Module"
        width="480px"
        footer={
          <>
            <button
              onClick={() => setEditModalOpen(false)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--muted)]"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={actionLoading}
              className="px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              {actionLoading ? "Saving..." : "Update"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Module Name" required>
            <Input
              value={formData.module_name}
              onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
              placeholder="Enter module name"
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </FormField>

          <FormField label="Icon">
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Enter icon (emoji or icon class)"
            />
          </FormField>

          <FormField label="Path">
            <Input
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="Enter route path"
            />
          </FormField>

          <FormField label="Visible in Menu">
            <Switch
              checked={formData.is_visible}
              onChange={(checked) => setFormData({ ...formData, is_visible: checked })}
            />
          </FormField>

          <FormField label="Status">
            <Switch
              checked={formData.status === 1}
              onChange={(checked) => setFormData({ ...formData, status: checked ? 1 : 0 })}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
