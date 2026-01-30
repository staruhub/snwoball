import { redirect } from 'next/navigation';

// 强制动态渲染
export const dynamic = "force-dynamic";

/**
 * 根路径重定向
 * 服务端直接重定向到登录页，登录状态由客户端处理
 */
export default function RootPage() {
  // 服务端统一重定向到登录页
  // 如果已登录，登录页会重定向到基金页
  redirect('/ratel/login');
}
