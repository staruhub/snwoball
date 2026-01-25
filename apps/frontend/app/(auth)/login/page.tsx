"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    phone?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { phone?: string; password?: string } = {};

    // 验证手机号
    if (!phone) {
      errors.phone = "请输入手机号";
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      errors.phone = "请输入正确的手机号格式";
    }

    // 验证密码
    if (!password) {
      errors.password = "请输入密码";
    } else if (password.length < 6) {
      errors.password = "密码至少6位";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login({ phone, password });
    } catch {
      // 错误已经在 useAuth 中处理
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-8">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
        登录
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          label="手机号"
          type="tel"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            if (formErrors.phone) {
              setFormErrors((prev) => ({ ...prev, phone: undefined }));
            }
          }}
          placeholder="请输入手机号"
          error={formErrors.phone}
          disabled={isLoading}
          required
        />

        <InputGroup
          label="密码"
          type="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (formErrors.password) {
              setFormErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          placeholder="请输入密码"
          error={formErrors.password}
          disabled={isLoading}
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            忘记密码？
          </Link>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full h-11"
        >
          登录
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        还没有账号？{" "}
        <Link
          href="/register"
          className="text-[var(--primary)] hover:underline"
        >
          立即注册
        </Link>
      </div>
    </div>
  );
}
