## Why

前端存在两个认证相关的 bug：(1) Admin token 和 ratel user token 在 Zustand store 中冲突，导致 admin 路由使用错误的 token 调用 API 返回 401；(2) 登录失败时的 401 响应触发了 token refresh 逻辑，导致用户看不到真正的登录错误信息而被重定向。这两个问题严重影响了 admin 功能的可用性和用户登录体验。

## What Changes

- **Admin/User token 隔离**：修改 `useUserStore` 的 hydration 逻辑，区分 admin 和 user token 存储
- **Admin token 独立存储**：引入 `admin_access_token` 和 `admin_refresh_token` localStorage key
- **路由感知的 token 同步**：hydration 时检测当前路由，admin 路由不同步 ratel token
- **Login 端点 401 特殊处理**：`fetchWebApi` 对认证端点（`/auth/login`, `/admin-auth/login` 等）跳过 token refresh 逻辑
- **Token refresh 前置条件检查**：只在有有效 access_token 时才尝试 refresh

## Capabilities

### New Capabilities

（无新能力）

### Modified Capabilities

- `user-auth`: 增加 token 隔离存储需求，login 失败不触发 refresh 的需求
- `admin-system`: 增加 admin 认证独立管理的需求（admin token 与 user token 分离）

## Impact

- **受影响文件**：
  - `apps/frontend/stores/useUserStore.ts` - hydration 逻辑
  - `apps/frontend/lib/api/config.ts` - `fetchWebApi` 401 处理
  - `apps/frontend/lib/api/auth.ts` - login 函数可能需要传递 `skipRefresh` 选项
  - `apps/frontend/app/admin/layout.tsx` - admin 认证检查逻辑
- **存储变化**：新增 `admin_access_token`, `admin_refresh_token` localStorage keys
- **向后兼容**：现有 ratel user 认证流程不受影响
