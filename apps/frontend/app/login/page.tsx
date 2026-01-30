"use client";

export const dynamic = "force-dynamic";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 登录页面 - 重定向到 ratel-mind-web 登录页
 * 所有认证流程统一使用 /ratel/login
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 获取 redirect 参数，如果存在则传递给 ratel 登录页
    const redirect = searchParams.get('redirect');
    const targetUrl = redirect
      ? `/ratel/login?redirect=${encodeURIComponent(redirect)}`
      : '/ratel/login';

    router.replace(targetUrl);
  }, [router, searchParams]);

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <span className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[var(--muted-foreground)]">正在跳转到登录页...</span>
      </div>
    </div>
  );
}
