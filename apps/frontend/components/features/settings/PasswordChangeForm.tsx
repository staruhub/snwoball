"use client";

import { useState } from "react";
import { FormField, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/api/settings";

interface PasswordChangeFormProps {
  token: string;
}

/**
 * 验证密码强度：至少8位，包含大小写字母和数字
 */
function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "密码长度至少 8 位";
  if (!/[A-Z]/.test(password)) return "密码必须包含大写字母";
  if (!/[a-z]/.test(password)) return "密码必须包含小写字母";
  if (!/\d/.test(password)) return "密码必须包含数字";
  return null;
}

export function PasswordChangeForm({ token }: PasswordChangeFormProps) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "请输入当前密码";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "请输入新密码";
    } else {
      const passwordError = validatePasswordStrength(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "请确认新密码";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await changePassword(token, {
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      });
      setMessage({ type: "success", text: "密码修改成功" });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      const err = error as { message?: string };
      setMessage({ type: "error", text: err.message || "密码修改失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
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

      <FormField label="当前密码" required error={errors.oldPassword}>
        <Input
          type="password"
          value={formData.oldPassword}
          onChange={(e) => handleChange("oldPassword", e.target.value)}
          placeholder="请输入当前密码"
          error={!!errors.oldPassword}
        />
      </FormField>

      <FormField label="新密码" required error={errors.newPassword}>
        <Input
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          placeholder="至少8位，包含大小写字母和数字"
          error={!!errors.newPassword}
        />
      </FormField>

      <FormField label="确认新密码" required error={errors.confirmPassword}>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder="请再次输入新密码"
          error={!!errors.confirmPassword}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "修改中..." : "修改密码"}
        </Button>
      </div>
    </form>
  );
}
