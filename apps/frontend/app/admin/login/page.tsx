import { redirect } from 'next/navigation';

// 强制动态渲染
export const dynamic = "force-dynamic";

/**
 * Admin 登录页面 - 重定向到统一的 ratel 登录
 * 保留此页面以保持路由兼容性
 */
export default function AdminLoginPage() {
  // 服务端重定向到 ratel 登录页
  redirect('/ratel/login?redirect=/admin');
}
