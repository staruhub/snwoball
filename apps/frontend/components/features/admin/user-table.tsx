"use client";

import { MoreHorizontal, Edit, Trash2, Key, UserX, UserCheck } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge, StatusBadge } from "@/components/ui/badge";
import type { AdminUser } from "@/lib/api/admin";

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  loading?: boolean;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onResetPassword,
  onToggleStatus,
  loading = false,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        Loading...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Username
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Roles
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Last Login
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-[var(--muted-foreground)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-sm font-medium text-[var(--foreground)]">
                    {(user.nickname || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {user.nickname || user.username}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      @{user.username}
                    </p>
                  </div>
                  {user.is_superuser && (
                    <Badge variant="info" size="sm">
                      Super Admin
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                {user.email || "-"}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="default" size="sm">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--muted-foreground)]">-</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={user.status === 1 ? "active" : "inactive"} />
              </td>
              <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleString()
                  : "Never"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
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
                        onClick: () => onEdit(user),
                      },
                      {
                        key: "reset-password",
                        label: "Reset Password",
                        icon: <Key className="w-4 h-4" />,
                        onClick: () => onResetPassword(user),
                      },
                      {
                        key: "toggle-status",
                        label: user.status === 1 ? "Disable" : "Enable",
                        icon:
                          user.status === 1 ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          ),
                        onClick: () => onToggleStatus(user),
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4" />,
                        danger: true,
                        disabled: user.is_superuser,
                        onClick: () => onDelete(user),
                      },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
