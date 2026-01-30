## Context

Next.js 15 引入了更严格的预渲染行为。在构建时，即使组件标记为 `"use client"`，Next.js 仍会尝试预渲染页面。当组件使用以下 hooks 时会触发错误：

- `useSearchParams()` - 需要 Suspense 边界
- `usePathname()` - 在 layout 中使用时需要特殊处理

当前状态：
- `/admin/*` 已修复：采用 Server Component layout + Suspense + Client Component 模式
- `/help/*`、`/settings/*`、`/login`、`/register` 未修复，导致 Docker 构建失败

## Goals / Non-Goals

**Goals:**
- 修复所有 Next.js 15 prerendering 错误，使 Docker 构建成功
- 保持与 `/admin` 目录一致的修复模式
- 不改变任何用户可见的功能或行为

**Non-Goals:**
- 不重构页面的业务逻辑
- 不优化性能（除非是修复的副产品）
- 不添加新功能

## Decisions

### 1. 采用 Server Component + Suspense + Client Component 模式

**决定**: 将使用客户端 hooks 的 layout 拆分为：
- `layout.tsx` - Server Component，包含 Suspense 边界
- `*LayoutClient.tsx` - Client Component，包含所有客户端逻辑

**理由**:
- 与已修复的 `/admin/layout.tsx` 保持一致
- 这是 Next.js 15 官方推荐的模式
- 允许 Next.js 在构建时正确处理预渲染

**替代方案考虑**:
- 使用 `next.config.ts` 禁用预渲染 → 不推荐，是临时解决方案
- 使用 `dynamic = "force-dynamic"` 单独配置 → 不够，仍需要 Suspense 边界

### 2. 对使用 useSearchParams 的页面添加 Suspense 包装

**决定**: 对 `/login` 和 `/register` 页面：
- `page.tsx` - Server Component，包含 Suspense 边界
- `*Client.tsx` - Client Component，包含 useSearchParams 调用

**理由**:
- `useSearchParams()` 在 Next.js 15 中必须在 Suspense 边界内使用
- 保持代码结构一致性

### 3. 统一的 Loading Fallback 组件

**决定**: 每个拆分的组件使用简单的内联 Loading 组件

**理由**:
- 与 `/admin` 的实现保持一致
- 避免引入额外的共享组件依赖

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 拆分组件可能引入新 bug | 修改后进行本地测试，确保功能不变 |
| 增加文件数量 | 这是 Next.js 15 的推荐模式，是必要的复杂度 |
| Suspense fallback 可能导致闪烁 | 使用简单的 Loading 状态，与现有模式一致 |

## 实现模式参考

```tsx
// layout.tsx (Server Component)
import { ReactNode, Suspense } from "react";
import LayoutClient from "./LayoutClient";

export const dynamic = "force-dynamic";

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>Loading...</div>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LayoutClient>{children}</LayoutClient>
    </Suspense>
  );
}
```

```tsx
// LayoutClient.tsx (Client Component)
"use client";

import { usePathname } from "next/navigation";
// ... 所有客户端逻辑
```
