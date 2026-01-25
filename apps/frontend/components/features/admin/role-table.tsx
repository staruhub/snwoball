"use client";

import { MoreHorizontal, Edit, Trash2, Shield } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge, StatusBadge } from "@/components/ui/badge";
import type { Role } from "@/lib/api/admin";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onEditPermissions: (role: Role) => void;
  loading?: boolean;
}

export function RoleTable({
  roles,
  onEdit,
  onDelete,
  onEditPermissions,
  loading = false,
}: RoleTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        Loading...
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[var(--muted-foreground)]">
        No roles found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Role Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Description
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Users
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)]">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-[var(--muted-foreground)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {role.role_name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant="default" size="sm">
                  {role.role_code}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                {role.description || "-"}
              </td>
              <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                {role.user_count}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={role.status === 1 ? "active" : "inactive"} />
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
                        onClick: () => onEdit(role),
                      },
                      {
                        key: "permissions",
                        label: "Edit Permissions",
                        icon: <Shield className="w-4 h-4" />,
                        onClick: () => onEditPermissions(role),
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4" />,
                        danger: true,
                        disabled: role.user_count > 0,
                        onClick: () => onDelete(role),
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
