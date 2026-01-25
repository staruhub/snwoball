"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, Input } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminUser, Role, CreateAdminUserRequest, UpdateAdminUserRequest } from "@/lib/api/admin";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminUserRequest | UpdateAdminUserRequest) => Promise<void>;
  user?: AdminUser | null;
  roles: Role[];
  loading?: boolean;
}

export function UserForm({
  open,
  onClose,
  onSubmit,
  user,
  roles,
  loading = false,
}: UserFormProps) {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    email: "",
    is_superuser: false,
    role_ids: [] as number[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        nickname: user.nickname || "",
        email: user.email || "",
        is_superuser: user.is_superuser,
        role_ids: [], // TODO: need to get role IDs from user.roles
      });
    } else {
      setFormData({
        username: "",
        password: "",
        nickname: "",
        email: "",
        is_superuser: false,
        role_ids: [],
      });
    }
    setErrors({});
  }, [user, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isEdit && !formData.username) {
      newErrors.username = "Username is required";
    }
    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isEdit) {
      const data: UpdateAdminUserRequest = {
        nickname: formData.nickname || undefined,
        email: formData.email || undefined,
        is_superuser: formData.is_superuser,
        role_ids: formData.role_ids,
      };
      await onSubmit(data);
    } else {
      const data: CreateAdminUserRequest = {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname || undefined,
        email: formData.email || undefined,
        is_superuser: formData.is_superuser,
        role_ids: formData.role_ids,
      };
      await onSubmit(data);
    }
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Create User"}
      width="480px"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--muted)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Username" required={!isEdit} error={errors.username}>
          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            disabled={isEdit}
            placeholder="Enter username"
            error={!!errors.username}
          />
        </FormField>

        {!isEdit && (
          <FormField label="Password" required error={errors.password}>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter password"
              error={!!errors.password}
            />
          </FormField>
        )}

        <FormField label="Nickname">
          <Input
            value={formData.nickname}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nickname: e.target.value }))
            }
            placeholder="Enter nickname"
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter email"
            error={!!errors.email}
          />
        </FormField>

        <FormField label="Super Admin">
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_superuser}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_superuser: checked }))
              }
            />
            <span className="text-sm text-[var(--muted-foreground)]">
              Has all permissions
            </span>
          </div>
        </FormField>

        <FormField label="Roles">
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-[var(--input)] rounded">
            {roles.length > 0 ? (
              roles.map((role) => (
                <Checkbox
                  key={role.id}
                  checked={formData.role_ids.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  label={role.role_name}
                />
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No roles available</p>
            )}
          </div>
        </FormField>
      </div>
    </Modal>
  );
}
