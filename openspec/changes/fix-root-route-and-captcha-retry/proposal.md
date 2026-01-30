## Why

当前存在两个影响用户体验的问题：
1. 网站根路由 `/` 无条件重定向到 `/workspace`，导致未登录用户需要经过多次跳转才能到达登录页
2. 当后端服务不可用时，滑块验证码组件会进入无限重试循环，持续发送请求并在控制台输出大量错误

## What Changes

- **根路由逻辑修复**：将 `/` 路由从服务端无条件重定向改为客户端检查登录状态后分流
  - 未登录 → `/ratel/login`
  - 已登录 → `/ratel/fund`

- **验证码重试逻辑修复**：修复 `SliderCaptcha` 组件的 `useCallback` 闭包陷阱
  - 使用 `useRef` 替代 `useState` 追踪重试次数
  - 确保 `MAX_RETRY_COUNT = 3` 限制正确生效

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `user-auth`: 根路由的登录状态检查逻辑

## Impact

- **apps/frontend/app/page.tsx**：根路由组件，从服务端组件改为客户端组件
- **apps/frontend/ratel-mind-web/src/pages/Login/components/SliderCaptcha/index.tsx**：验证码组件重试逻辑
- **用户体验**：减少页面跳转次数，避免后端不可用时的无限循环错误
