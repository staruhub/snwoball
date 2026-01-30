## Context

当前 snowball 项目已经有 `apps/frontend/ratel-mind-web/` 目录结构，其中包含了从源项目迁移的大部分页面和组件。但目前存在以下问题：

1. **侧边栏导航被错误修改**：当前 LeftSidebar 使用 `/reports?tab=xxx` 参数化路由，而不是原有的独立路由（`/fund`、`/news` 等）
2. **路由配置存在冗余**：路由文件中同时存在独立路由和 `/reports` iframe 路由
3. **源项目有更新**：需要检查源项目是否有新增的组件或功能更新

**约束条件**：
- 保持 React Router 7 路由结构
- 保持 `@ratel` 路径别名
- `/ratel/reports` 仅用于 iframe 嵌入 Snowball 工作台
- 其他路由使用原生 React 组件

## Goals / Non-Goals

**Goals:**
- 恢复原有的独立路由结构（`/ratel/fund`、`/ratel/news`、`/ratel/config-plaza`、`/ratel/report-plaza`）
- 更新侧边栏导航指向正确的独立路由
- 确保 `/ratel/reports` 仅用于 iframe 功能（加载 Snowball 工作台）
- 同步源项目的最新组件和页面更新
- 配置正确的环境变量映射

**Non-Goals:**
- 不修改源项目 `/Volumes/Ventoy/Playground/ratel-mind-web` 的代码
- 不修改 Snowball 的现有路由（`/workspace`、`/reports`）
- 不修改后端 API 代码
- 不引入新的框架或技术栈

## Decisions

### 1. 路由架构

**决策**：保持 React Router 7 的标准路由配置，每个功能模块使用独立路由。

**理由**：
- 符合源项目的设计
- 更好的 URL 可读性和分享性
- 便于页面间独立状态管理
- 避免 iframe 方案的性能开销

**替代方案考虑**：
- 使用 Next.js App Router：需要重写所有页面，工作量大
- 全部使用 iframe + tab 参数：性能差，用户体验不佳

### 2. 环境变量适配

**决策**：在 `apps/frontend/next.config.ts` 中配置 webpack DefinePlugin，将 `VITE_*` 映射到 `process.env.NEXT_PUBLIC_*`。

**理由**：
- 最小化代码修改
- 保持与源项目代码的兼容性
- 支持开发/生产环境切换

### 3. 侧边栏导航结构

**决策**：恢复原有的独立路由导航，仅保留"基金报告"指向 `/reports` iframe 页面。

**导航项**：
- 主页 → `/home`
- 基金 → `/fund`
- 资讯 → `/news`
- 配置广场 → `/config-plaza`
- 报告广场 → `/report-plaza`
- 基金报告 → `/reports`（iframe）

### 4. iframe 集成策略

**决策**：`/ratel/reports` 页面通过 iframe 加载 Snowball 的 `/workspace` 路由，支持 tab 参数切换不同功能。

**参数传递**：
- `token`: JWT Token 用于认证
- `tab`: 可选，指定 Snowball 内部 tab（`report-manage` 等）

### 5. 样式隔离

**决策**：ratel-mind-web 使用独立的 Tailwind CSS 配置，通过 CSS 作用域确保不影响 Next.js 页面。

**实现方式**：
- ratel-mind-web 的样式文件仅在 `/ratel/*` 路由下加载
- 使用 Tailwind 的 prefix 或 scoped CSS

## Risks / Trade-offs

### [风险] 两个应用共享 localStorage Token
- **问题**：Token 失效时可能导致两边状态不一致
- **缓解**：使用 `useIframeAuth` hook 监听 Token 变化，同步登出状态

### [风险] 依赖版本冲突
- **问题**：源项目使用的依赖版本可能与 Next.js 项目冲突
- **缓解**：优先使用 Next.js 项目的依赖版本（React 19），必要时更新组件代码

### [风险] 环境变量加载时机
- **问题**：`import.meta.env` 在服务端渲染时不可用
- **缓解**：使用运行时检测，优先检查 `import.meta.env`，fallback 到 `process.env`

### [Trade-off] 代码重复 vs 维护成本
- **选择**：接受一定程度的代码复制（从源项目到目标项目）
- **原因**：避免 monorepo 的复杂配置，降低维护成本

## File Changes Summary

| 文件/目录 | 变更类型 | 说明 |
|----------|---------|------|
| `apps/frontend/ratel-mind-web/src/components/LeftSidebar.tsx` | 修改 | 恢复独立路由导航 |
| `apps/frontend/ratel-mind-web/src/routers/index.tsx` | 修改 | 确认路由配置正确 |
| `apps/frontend/next.config.ts` | 修改 | 添加环境变量映射 |
| `apps/frontend/.env.local` | 修改/创建 | 配置环境变量 |
| `apps/frontend/ratel-mind-web/src/pages/*` | 同步 | 检查并同步源项目更新 |
| `apps/frontend/ratel-mind-web/src/components/*` | 同步 | 检查并同步源项目更新 |
