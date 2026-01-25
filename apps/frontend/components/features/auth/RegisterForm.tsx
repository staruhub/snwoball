"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";
import type { UserRegisterRequest } from "@/lib/api/auth";

interface FormData {
  phone: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
  nickname: string;
}

interface FormErrors {
  phone?: string;
  password?: string;
  confirmPassword?: string;
  inviteCode?: string;
  nickname?: string;
}

interface RegisterFormProps {
  onSubmit: (data: UserRegisterRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  showLoginLink?: boolean;
}

/**
 * 注册表单组件
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
  error = null,
  onClearError,
  showLoginLink = true,
}: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
    nickname: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.phone) {
      errors.phone = "请输入手机号";
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = "请输入正确的手机号格式";
    }

    if (!formData.password) {
      errors.password = "请输入密码";
    } else if (formData.password.length < 6) {
      errors.password = "密码至少6位";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "请确认密码";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "两次输入的密码不一致";
    }

    if (!formData.inviteCode) {
      errors.inviteCode = "请输入邀请码";
    }

    if (formData.nickname && formData.nickname.length < 2) {
      errors.nickname = "昵称至少2个字符";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onClearError?.();

    if (!validateForm()) return;

    try {
      await onSubmit({
        phone: formData.phone,
        password: formData.password,
        invite_code: formData.inviteCode,
        nickname: formData.nickname || undefined,
      });
    } catch {
      // 错误由父组件处理
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          label="手机号"
          type="tel"
          value={formData.phone}
          onChange={(value) => updateField("phone", value)}
          placeholder="请输入手机号"
          error={formErrors.phone}
          disabled={isLoading}
          required
        />

        <InputGroup
          label="密码"
          type="password"
          value={formData.password}
          onChange={(value) => updateField("password", value)}
          placeholder="请输入密码（至少6位）"
          error={formErrors.password}
          disabled={isLoading}
          required
        />

        <InputGroup
          label="确认密码"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
          placeholder="请再次输入密码"
          error={formErrors.confirmPassword}
          disabled={isLoading}
          required
        />

        <InputGroup
          label="邀请码"
          type="text"
          value={formData.inviteCode}
          onChange={(value) => updateField("inviteCode", value)}
          placeholder="请输入邀请码"
          error={formErrors.inviteCode}
          disabled={isLoading}
          required
        />

        <InputGroup
          label="昵称"
          type="text"
          value={formData.nickname}
          onChange={(value) => updateField("nickname", value)}
          placeholder="请输入昵称（选填）"
          error={formErrors.nickname}
          disabled={isLoading}
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full h-11"
        >
          注册
        </Button>
      </form>

      {showLoginLink && (
        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          已有账号？{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline">
            立即登录
          </Link>
        </div>
      )}
    </div>
  );
}
