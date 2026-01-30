## Context

当前系统存在两个问题：

1. **根路由重定向问题**
   - `apps/frontend/app/page.tsx` 使用 Next.js 服务端 `redirect("/workspace")` 无条件重定向
   - 未登录用户访问 `/` 会经历：`/` → `/workspace` → `/ratel/login` 多次跳转
   - 用户期望：未登录直接到 `/ratel/login`，已登录直接到 `/ratel/fund`

2. **验证码无限重试问题**
   - `SliderCaptcha` 组件使用 `useState` 存储 `retryCount`
   - `useCallback` 闭包捕获的 `retryCount` 始终为初始值 0
   - `setTimeout` 调用时保留旧函数引用，导致重试计数逻辑失效
   - 后端不可用时触发无限重试循环

## Goals / Non-Goals

**Goals:**
- 优化根路由逻辑，减少页面跳转次数
- 修复验证码组件的闭包陷阱问题
- 保持现有认证机制不变

**Non-Goals:**
- 不修改 ratel-mind-web 的登录流程
- 不修改 workspace layout 的认证检查逻辑
- 不改变 token 存储方式

## Decisions

### Decision 1: 根路由使用客户端组件

**选择**：将 `app/page.tsx` 从服务端组件改为客户端组件，使用 zustand store 检查认证状态

**原因**：
- 认证状态存储在 localStorage，服务端无法访问
- zustand store 提供 `_hasHydrated` 标志，可安全判断 hydration 完成
- 与 workspace layout 保持一致的认证检查模式

**替代方案**：
- 使用 middleware 检查 cookie：需要后端配合设置 httpOnly cookie，改动较大
- 保持服务端重定向到 workspace：不解决多跳问题

### Decision 2: 使用 useRef 替代 useState 存储重试次数

**选择**：将 `retryCount` 从 `useState` 改为 `useRef`

**原因**：
- `useRef` 的 `.current` 属性变更不会触发重渲染
- 回调函数内访问 `retryCountRef.current` 始终获取最新值
- 无需将 ref 加入 `useCallback` 依赖数组

**替代方案**：
- 使用 functional update `setRetryCount(prev => prev + 1)`：仍需处理 setTimeout 闭包问题
- 移除 `useCallback`：可能导致不必要的重渲染

## Risks / Trade-offs

**[Risk] 根路由闪烁** → 在 hydration 完成前显示 loading 状态，与现有 workspace 行为一致

**[Risk] 验证码重试状态不可见** → `useRef` 不触发渲染，但重试次数本身不需要展示给用户

**[Trade-off] 客户端路由判断** → 首次访问需要等待 JS 加载，但相比多次服务端重定向仍更快
