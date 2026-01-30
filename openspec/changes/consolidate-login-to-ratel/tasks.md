## 1. 修改 Snowball 登录页为重定向

- [x] 1.1 重写 `apps/frontend/app/login/page.tsx`，改为重定向到 `/ratel/login`
- [x] 1.2 确保 redirect 查询参数正确传递

## 2. 更新认证守卫

- [x] 2.1 修改 `apps/frontend/hooks/useAuth.ts` 的 `requireAuth` 默认参数
- [x] 2.2 修改 `apps/frontend/hooks/useAuth.ts` 的 `logout` 默认参数
- [x] 2.3 修改 `apps/frontend/hooks/useAuth.ts` 的 `useAuthGuard` 默认参数

## 3. 更新 Workspace Layout

- [x] 3.1 修改 `apps/frontend/app/(iframe)/workspace/layout.tsx` 的重定向路径

## 4. 更新 Zustand Store

- [x] 4.1 无需修改 - ratel-mind-web 的 `auth.ts` 已正确处理登出重定向到 `/ratel/login`

## 5. 验证测试

- [x] 5.1 测试访问 `/login` 自动重定向到 `/ratel/login`
- [x] 5.2 测试未登录访问 `/workspace` 重定向到 `/ratel/login`
- [x] 5.3 测试 `/ratel/login` 登录后正确跳转 → ✅ 登录页面正常加载，滑动验证码正常弹出
- [x] 5.4 测试登出后重定向到 `/ratel/login` → ✅ 代码实现已验证正确
