"use client";

// 强制动态渲染，因为使用了客户端功能
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Upload, Download, Eye } from "lucide-react";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { FormField, Input, Textarea } from "@/components/ui/form";
import { Dropdown, SelectDropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getAdminTemplates,
  getAdminTemplate,
  createAdminTemplate,
  updateAdminTemplate,
  publishAdminTemplate,
  deleteAdminTemplate,
  type AdminTemplate,
  type AdminTemplateDetail,
  type CreateAdminTemplateRequest,
  type UpdateAdminTemplateRequest,
} from "@/lib/api/admin";

const TEMPLATE_TYPES = [
  { value: "report", label: "Report" },
  { value: "email", label: "Email" },
  { value: "notification", label: "Notification" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "0", label: "Draft" },
  { value: "1", label: "Published" },
  { value: "2", label: "Unpublished" },
];

function getStatusBadge(status: number) {
  switch (status) {
    case 0:
      return <Badge variant="default">Draft</Badge>;
    case 1:
      return <Badge variant="success">Published</Badge>;
    case 2:
      return <Badge variant="warning">Unpublished</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [status, setStatus] = useState("");

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplateDetail | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState<AdminTemplate | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    template_name: "",
    template_code: "",
    template_type: "report",
    description: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 从认证 Hook 获取 token
  const { token, requireAuth, isLoading } = useAuth();

  // 认证检查
  useEffect(() => {
    if (isLoading) return;
    requireAuth("/admin/login");
  }, [requireAuth, isLoading]);

  const fetchTemplates = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getAdminTemplates(token, {
        page,
        page_size: pageSize,
        keyword,
        template_type: templateType || undefined,
        status: status ? parseInt(status) : undefined,
      });
      setTemplates(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, keyword, templateType, status]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      template_name: "",
      template_code: "",
      template_type: "report",
      description: "",
      content: "",
    });
    setErrors({});
    setFormOpen(true);
  };

  const handleEdit = async (template: AdminTemplate) => {
    if (!token) return;
    try {
      const detail = await getAdminTemplate(token, template.id);
      setEditingTemplate(detail);
      setFormData({
        template_name: detail.template_name,
        template_code: detail.template_code,
        template_type: detail.template_type,
        description: detail.description || "",
        content: detail.content || "",
      });
      setErrors({});
      setFormOpen(true);
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast.error("加载模板失败");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.template_name) newErrors.template_name = "Template name is required";
    if (!editingTemplate && !formData.template_code) newErrors.template_code = "Template code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validate() || !token) return;

    setActionLoading(true);
    try {
      if (editingTemplate) {
        const data: UpdateAdminTemplateRequest = {
          template_name: formData.template_name,
          description: formData.description || undefined,
          content: formData.content || undefined,
        };
        await updateAdminTemplate(token, editingTemplate.id, data);
      } else {
        const data: CreateAdminTemplateRequest = {
          template_name: formData.template_name,
          template_code: formData.template_code,
          template_type: formData.template_type,
          description: formData.description || undefined,
          content: formData.content || undefined,
        };
        await createAdminTemplate(token, data);
      }
      setFormOpen(false);
      toast.success(editingTemplate ? "模板更新成功" : "模板创建成功");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("保存模板失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (template: AdminTemplate, action: "publish" | "unpublish") => {
    if (!token) return;
    try {
      await publishAdminTemplate(token, template.id, action);
      toast.success(action === "publish" ? "模板发布成功" : "模板已取消发布");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to publish template:", error);
      toast.error("操作失败");
    }
  };

  const handleDelete = (template: AdminTemplate) => {
    setDeletingTemplate(template);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTemplate || !token) return;
    setActionLoading(true);
    try {
      await deleteAdminTemplate(token, deletingTemplate.id);
      setDeleteModalOpen(false);
      setDeletingTemplate(null);
      toast.success("模板删除成功");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("删除模板失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTemplates();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Templates</h1>
          <p className="text-[var(--muted-foreground)]">Manage system templates</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search templates..."
            className="pl-10"
          />
        </div>
        <SelectDropdown
          value={templateType}
          options={[{ value: "", label: "All Types" }, ...TEMPLATE_TYPES]}
          onChange={setTemplateType}
          className="w-40"
        />
        <SelectDropdown
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
          className="w-40"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)]"
        >
          Search
        </button>
      </form>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-40 text-[var(--muted-foreground)]">
            Loading...
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-40 text-[var(--muted-foreground)]">
            No templates found
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-[var(--card)] border border-[var(--border)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">
                    {template.template_name}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {template.template_code}
                  </p>
                </div>
                <Dropdown
                  trigger={
                    <button className="p-1.5 hover:bg-[var(--muted)] rounded">
                      <MoreHorizontal className="w-4 h-4 text-[var(--muted-foreground)]" />
                    </button>
                  }
                  items={[
                    {
                      key: "edit",
                      label: "Edit",
                      icon: <Edit className="w-4 h-4" />,
                      onClick: () => handleEdit(template),
                    },
                    {
                      key: "preview",
                      label: "Preview",
                      icon: <Eye className="w-4 h-4" />,
                      onClick: () => toast.info("预览功能即将上线"),
                    },
                    {
                      key: "publish",
                      label: template.status === 1 ? "Unpublish" : "Publish",
                      icon: template.status === 1 ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />,
                      onClick: () => handlePublish(template, template.status === 1 ? "unpublish" : "publish"),
                    },
                    {
                      key: "delete",
                      label: "Delete",
                      icon: <Trash2 className="w-4 h-4" />,
                      danger: true,
                      disabled: template.status === 1,
                      onClick: () => handleDelete(template),
                    },
                  ]}
                />
              </div>

              <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
                {template.description || "No description"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">
                    {template.template_type}
                  </Badge>
                  {getStatusBadge(template.status)}
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  v{template.version}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={setPage}
      />

      {/* Template Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingTemplate ? "Edit Template" : "Create Template"}
        width="640px"
        footer={
          <>
            <button
              onClick={() => setFormOpen(false)}
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
              {actionLoading ? "Saving..." : editingTemplate ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Template Name" required error={errors.template_name}>
            <Input
              value={formData.template_name}
              onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
              placeholder="Enter template name"
              error={!!errors.template_name}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Template Code" required={!editingTemplate} error={errors.template_code}>
              <Input
                value={formData.template_code}
                onChange={(e) => setFormData({ ...formData, template_code: e.target.value })}
                placeholder="Enter template code"
                disabled={!!editingTemplate}
                error={!!errors.template_code}
              />
            </FormField>

            <FormField label="Type">
              <SelectDropdown
                value={formData.template_type}
                options={TEMPLATE_TYPES}
                onChange={(value) => setFormData({ ...formData, template_type: value })}
              />
            </FormField>
          </div>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={2}
            />
          </FormField>

          <FormField label="Content">
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter template content"
              rows={8}
              className="font-mono text-sm"
            />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Template"
        message={`确定要删除模板 "${deletingTemplate?.template_name}" 吗？此操作无法撤销。`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
        requireInput={deletingTemplate?.template_name || ""}
        requireInputLabel={`请输入模板名称 "${deletingTemplate?.template_name}" 以确认删除`}
      />
    </div>
  );
}
