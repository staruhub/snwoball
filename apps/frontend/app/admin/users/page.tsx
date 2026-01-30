"use client";

// 强制动态渲染，因为使用了客户端功能
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { UserTable } from "@/components/features/admin/user-table";
import { UserForm } from "@/components/features/admin/user-form";
import { ConfirmModal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/stores/useToastStore";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserStatus,
  resetAdminPassword,
  getAllRoles,
  type AdminUser,
  type Role,
  type CreateAdminUserRequest,
  type UpdateAdminUserRequest,
} from "@/lib/api/admin";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState("");

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 从认证 Hook 获取 token
  const { token, requireAuth, isLoading } = useAuth();

  // 认证检查
  useEffect(() => {
    if (isLoading) return;
    requireAuth("/admin/login");
  }, [requireAuth, isLoading]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getAdminUsers(token, { page, page_size: pageSize, keyword });
      setUsers(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [token, page, pageSize, keyword]);

  const fetchRoles = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getAllRoles(token);
      setRoles(response);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateAdminUserRequest | UpdateAdminUserRequest) => {
    if (!token) return;
    setActionLoading(true);
    try {
      if (editingUser) {
        await updateAdminUser(token, editingUser.id, data as UpdateAdminUserRequest);
      } else {
        await createAdminUser(token, data as CreateAdminUserRequest);
      }
      setFormOpen(false);
      toast.success(editingUser ? "用户更新成功" : "用户创建成功");
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("保存用户失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (user: AdminUser) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser || !token) return;
    setActionLoading(true);
    try {
      await deleteAdminUser(token, deletingUser.id);
      setDeleteModalOpen(false);
      setDeletingUser(null);
      toast.success("用户删除成功");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("删除用户失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = (user: AdminUser) => {
    setResettingUser(user);
    setResetPasswordModalOpen(true);
  };

  const confirmResetPassword = async () => {
    if (!resettingUser) return;
    setActionLoading(true);
    try {
      await resetAdminPassword(token || "", resettingUser.id);
      setResetPasswordModalOpen(false);
      setResettingUser(null);
      toast.success("密码已重置，新密码已发送至用户邮箱");
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error("重置密码失败");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      await updateAdminUserStatus(token || "", user.id, newStatus);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("更新状态失败");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Users</h1>
          <p className="text-[var(--muted-foreground)]">Manage admin users</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by username, nickname or email..."
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
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
          onToggleStatus={handleToggleStatus}
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

      {/* User Form Modal */}
      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        roles={roles}
        loading={actionLoading}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`确定要删除用户 "${deletingUser?.username}" 吗？此操作无法撤销。`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
        requireInput={deletingUser?.username || ""}
        requireInputLabel={`请输入用户名 "${deletingUser?.username}" 以确认删除`}
      />

      {/* Reset Password Confirm Modal */}
      <ConfirmModal
        open={resetPasswordModalOpen}
        onClose={() => setResetPasswordModalOpen(false)}
        onConfirm={confirmResetPassword}
        title="Reset Password"
        message={`确定要重置用户 "${resettingUser?.username}" 的密码吗？新密码将发送至用户邮箱。`}
        confirmText="Reset"
        loading={actionLoading}
      />
    </div>
  );
}
