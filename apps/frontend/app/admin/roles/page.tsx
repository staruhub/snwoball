"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { RoleTable } from "@/components/features/admin/role-table";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { FormField, Input, Textarea } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type Role,
  type CreateRoleRequest,
  type UpdateRoleRequest,
} from "@/lib/api/admin";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState("");

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    role_name: "",
    role_code: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 从认证 Hook 获取 token
  const { token, requireAuth } = useAuth();

  // 认证检查
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  const fetchRoles = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getRoles(token, { page, page_size: pageSize, keyword });
      setRoles(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, keyword]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({ role_name: "", role_code: "", description: "" });
    setErrors({});
    setFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      role_name: role.role_name,
      role_code: role.role_code,
      description: role.description || "",
    });
    setErrors({});
    setFormOpen(true);
  };

  const handleEditPermissions = (role: Role) => {
    // TODO: Implement permissions modal
    toast.info("权限编辑功能即将上线");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.role_name) newErrors.role_name = "Role name is required";
    if (!editingRole && !formData.role_code) newErrors.role_code = "Role code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validate() || !token) return;

    setActionLoading(true);
    try {
      if (editingRole) {
        const data: UpdateRoleRequest = {
          role_name: formData.role_name,
          description: formData.description || undefined,
        };
        await updateRole(token, editingRole.id, data);
      } else {
        const data: CreateRoleRequest = {
          role_name: formData.role_name,
          role_code: formData.role_code,
          description: formData.description || undefined,
        };
        await createRole(token, data);
      }
      setFormOpen(false);
      toast.success(editingRole ? "角色更新成功" : "角色创建成功");
      fetchRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error("保存角色失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (role: Role) => {
    setDeletingRole(role);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingRole || !token) return;
    setActionLoading(true);
    try {
      await deleteRole(token, deletingRole.id);
      setDeleteModalOpen(false);
      setDeletingRole(null);
      toast.success("角色删除成功");
      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("删除角色失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRoles();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Roles</h1>
          <p className="text-[var(--muted-foreground)]">Manage roles and permissions</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by role name or code..."
            className="pl-10"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)]"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border)]">
        <RoleTable
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEditPermissions={handleEditPermissions}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={setPage}
      />

      {/* Role Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingRole ? "Edit Role" : "Create Role"}
        width="480px"
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
              {actionLoading ? "Saving..." : editingRole ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Role Name" required error={errors.role_name}>
            <Input
              value={formData.role_name}
              onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
              placeholder="Enter role name"
              error={!!errors.role_name}
            />
          </FormField>

          <FormField label="Role Code" required={!editingRole} error={errors.role_code}>
            <Input
              value={formData.role_code}
              onChange={(e) => setFormData({ ...formData, role_code: e.target.value })}
              placeholder="Enter role code"
              disabled={!!editingRole}
              error={!!errors.role_code}
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
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Role"
        message={`确定要删除角色 "${deletingRole?.role_name}" 吗？此操作无法撤销。`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
        requireInput={deletingRole?.role_name || ""}
        requireInputLabel={`请输入角色名称 "${deletingRole?.role_name}" 以确认删除`}
      />
    </div>
  );
}
