## 1. 根路由重定向修复

- [x] 1.1 将 `apps/frontend/app/page.tsx` 改为客户端组件（添加 "use client"）
- [x] 1.2 使用 zustand store 获取认证状态和 hydration 标志
- [x] 1.3 实现条件重定向逻辑（未登录 → `/ratel/login`，已登录 → `/ratel/fund`）
- [x] 1.4 添加 hydration 期间的 loading 状态

## 2. 验证码重试逻辑修复

- [x] 2.1 将 `SliderCaptcha` 组件的 `retryCount` 从 `useState` 改为 `useRef`
- [x] 2.2 更新 `handleGenerateCaptcha` 函数使用 `retryCountRef.current`
- [x] 2.3 移除 `useCallback` 对 `retryCount` 的依赖

## 3. 验证

- [x] 3.1 测试未登录访问 `/` 直接跳转到 `/ratel/login`
- [x] 3.2 测试已登录访问 `/` 直接跳转到 `/ratel/fund`
- [x] 3.3 测试后端不可用时验证码重试最多 3 次后停止
