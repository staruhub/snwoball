"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (): boolean => {
    if (!phone) {
      setPhoneError("请输入手机号");
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setPhoneError("请输入正确的手机号格式");
      return false;
    }
    setPhoneError(undefined);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePhone()) return;

    setIsLoading(true);

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            申请已提交
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            我们已收到您的密码重置申请，工作人员会尽快通过短信与您联系。
          </p>
          <Link href="/login">
            <Button className="w-full h-11">返回登录</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-8">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
        忘记密码
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        请输入您注册时使用的手机号，我们将协助您重置密码。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          label="手机号"
          type="tel"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            if (phoneError) setPhoneError(undefined);
          }}
          placeholder="请输入手机号"
          error={phoneError}
          disabled={isLoading}
          required
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full h-11"
        >
          提交申请
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        想起密码了？{" "}
        <Link href="/login" className="text-[var(--primary)] hover:underline">
          返回登录
        </Link>
      </div>
    </div>
  );
}
