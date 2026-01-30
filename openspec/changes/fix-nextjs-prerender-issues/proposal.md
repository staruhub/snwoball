## Why

Next.js 15 在 Docker 构建时尝试预渲染页面，但使用了 `useSearchParams()` 或在 layout 中使用 `usePathname()` 的客户端组件会触发 prerendering 错误。`/admin/*` 目录已通过 Suspense 包装模式修复，但 `/help/*`、`/settings/*`、`/login`、`/register` 等页面仍存在此问题，导致 Docker 构建失败。

## What Changes

- 重构 `/help/layout.tsx` 为 Server Component + Client Component 模式（拆分为 `layout.tsx` + `HelpLayoutClient.tsx`）
- 重构 `/settings/layout.tsx` 为 Server Component + Client Component 模式（拆分为 `layout.tsx` + `SettingsLayoutClient.tsx`）
- 重构 `/login/page.tsx` 添加 Suspense 边界包装 `useSearchParams()` 调用
- 重构 `/register/page.tsx` 添加 Suspense 边界包装（如果使用了 `useSearchParams()`）

## Capabilities

### New Capabilities

无新增功能，这是纯架构重构。

### Modified Capabilities

无需修改现有 specs，这是实现层面的修复，不改变功能需求。

## Impact

- **受影响文件**:
  - `apps/frontend/app/help/layout.tsx` → 拆分为 Server + Client 组件
  - `apps/frontend/app/settings/layout.tsx` → 拆分为 Server + Client 组件
  - `apps/frontend/app/login/page.tsx` → 添加 Suspense 包装
  - `apps/frontend/app/register/page.tsx` → 检查并添加 Suspense 包装（如需要）
- **构建系统**: Docker 构建将能够成功完成
- **运行时行为**: 无变化，用户体验保持一致
