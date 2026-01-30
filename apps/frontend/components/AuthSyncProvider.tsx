'use client';

import { useAuthSync } from '@/hooks/useAuthSync';

/**
 * 认证状态同步 Provider
 * 监听 localStorage 变化，实现多 Tab 登录状态同步和 ratel-mind-web 集成
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}
