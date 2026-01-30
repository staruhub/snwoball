## Why

将独立的 ratel-mind-web 项目（Vite + React Router）迁移并整合到 Snowball 的 Next.js 15 项目中，实现统一的代码库管理和部署。这样可以简化运维复杂度，同时通过 iframe 集成实现两个应用之间的认证共享和功能互通。

## What Changes

- **迁移 ratel-mind-web 源代码**：将所有页面、组件、样式、工具函数复制到 `apps/frontend/ratel-mind-web/src/` 目录
- **保持 React Router 路由结构**：在 `/ratel/*` 路由下保持原有的 React Router 7 路由配置不变
- **配置路径别名**：在 Next.js 的 webpack 配置中添加 `@ratel` 别名支持
- **环境变量适配**：创建 Vite 环境变量到 Next.js 环境变量的映射（`VITE_*` → `NEXT_PUBLIC_*`）
- **iframe 集成页面**：`/ratel/reports` 页面通过 iframe 加载 Snowball 的 `/workspace` 路由
- **认证机制共享**：两个应用使用相同的 localStorage JWT Token（key: `access_token`）

## Capabilities

### New Capabilities

- `ratel-page-migration`: 将 ratel-mind-web 的 8 个页面模块（Home、Fund、News、ConfigPlaza、ReportPlaza、FundCompare、FundPermission、UserFundGroup）迁移到 Next.js 项目，保持原有功能和路由结构

### Modified Capabilities

- `ratel-frontend`: 更新现有的 ratel-frontend 配置以支持完整的页面迁移和路由配置
- `iframe-embedding`: 扩展 iframe 嵌入机制以支持 `/ratel/reports` 页面加载 Snowball 工作台

## Impact

**代码变更**:
- `apps/frontend/ratel-mind-web/src/pages/` - 新增 8 个页面模块
- `apps/frontend/ratel-mind-web/src/components/` - 复制并适配共享组件
- `apps/frontend/ratel-mind-web/src/routers/index.tsx` - 完整路由配置
- `apps/frontend/next.config.ts` - 添加 webpack 别名和环境变量适配
- `apps/frontend/.env.local` - 环境变量配置

**依赖关系**:
- React 19.x（与当前 Next.js 项目一致）
- React Router DOM 7.x
- Tailwind CSS 4.x
- @tabler/icons-react
- echarts / echarts-for-react
- i18next / react-i18next

**API 端点**:
- 开发环境：`http://localhost:8003`（Web API）
- 生产环境：`https://www.beansinfo.com`

**CORS 配置**:
- 需确保后端 CORS 支持 `http://localhost:3000` 和 `http://localhost:5173`
