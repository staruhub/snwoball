import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)]">Loading...</div>
    </div>
  );
}

/**
 * 登录页面 - 重定向到 ratel-mind-web 登录页
 * 所有认证流程统一使用 /ratel/login
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginClient />
    </Suspense>
  );
}
