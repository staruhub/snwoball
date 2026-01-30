我需要将位于 `/Volumes/Ventoy/Playground/ratel-mind-web` 的 Vite + React Router 项目迁移到当前的 Next.js 15 项目中（`apps/frontend`），实现以下具体任务：

## 核心目标

将 ratel-mind-web 的所有页面和组件迁移到当前 Next.js 项目的 `/ratel/*` 路由下，同时保持原有的 React Router 路由结构和 Vite 环境变量配置。

## 具体迁移任务

### 第一步：分析源项目结构
请先检查 `/Volumes/Ventoy/Playground/ratel-mind-web` 项目：
1. 查看 `package.json` 确认依赖版本（React、React Router、Vite 等）
2. 查看 `src/routers/index.tsx` 了解完整的路由配置
3. 查看 `src/components/LeftSidebar.tsx` 了解侧边栏菜单结构
4. 查看 `vite.config.ts` 确认路径别名配置（特别是 `@ratel` 别名）
5. 查看 `.env` 文件确认环境变量配置

### 第二步：迁移以下页面到 `apps/frontend/ratel-mind-web/src/pages/`

1. **主页** (`/ratel/home`)
   - 源路径：`/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/Home/`
   - 包含子路由：
     - `/ratel/home/ai-search` - AI 搜索页面
     - `/ratel/home/hot-list` - 热门榜单页面

2. **基金页面** (`/ratel/fund`)
   - 源路径：`/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/Fund/`
   - 包含基金查询、展示、对比功能

3. **资讯页面** (`/ratel/news`)
   - 源路径：`/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/News/`

4. **配置广场** (`/ratel/config-plaza`)
   - 源路径：`/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/ConfigPlaza/`
   - 包含子路由：
     - `/ratel/config-plaza/create/basic` - 基本信息页
     - `/ratel/config-plaza/create/select` - 选择配置页
     - `/ratel/config-plaza/portfolio/:id` - 组合详情页

5. **报告广场** (`/ratel/report-plaza`)
   - 源路径：`/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/ReportPlaza/`
   - 包含编辑器相关路由

6. **基金报告** (`/ratel/reports`)
   - **特殊处理**：此页面不需要迁移，而是创建一个 iframe 容器页面
   - 参考现有实现：`apps/frontend/ratel-mind-web/src/pages/Reports/index.tsx`
   - iframe 应加载 Snowball 的 `/workspace` 路由
   - 通过 URL 参数传递 JWT Token：`?token=${localStorage.getItem('access_token')}`

### 第三步：迁移共享组件和资源

1. 将 `/Volumes/Ventoy/Playground/ratel-mind-web/src/components/` 中的所有组件复制到 `apps/frontend/ratel-mind-web/src/components/`
2. 将 `/Volumes/Ventoy/Playground/ratel-mind-web/src/assets/` 中的所有资源文件复制到 `apps/frontend/ratel-mind-web/src/assets/`
3. 将 `/Volumes/Ventoy/Playground/ratel-mind-web/src/styles/` 中的样式文件复制到 `apps/frontend/ratel-mind-web/src/styles/`
4. 将 `/Volumes/Ventoy/Playground/ratel-mind-web/src/utils/` 中的工具函数复制到 `apps/frontend/ratel-mind-web/src/utils/`

### 第四步：配置路由和别名

1. 在 `apps/frontend/ratel-mind-web/src/routers/index.tsx` 中配置所有路由（保持与源项目一致）
2. 在 `apps/frontend/next.config.ts` 中添加 webpack 别名配置，支持 `@ratel` 路径别名
3. 确保 `apps/frontend/ratel-mind-web/vite.config.ts` 中的 `base: '/ratel/'` 配置正确

### 第五步：环境变量配置

1. 在 `apps/frontend/.env.local` 中添加：
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8003
NEXT_PUBLIC_SNOWBALL_URL=http://localhost:3000
```

2. 在 `apps/frontend/next.config.ts` 中添加 `import.meta.env` polyfill，将 `VITE_*` 环境变量映射到 `NEXT_PUBLIC_*`

### 第六步：API 配置适配

1. 检查 `apps/frontend/ratel-mind-web/src/config/api.ts`，确保 API 基础 URL 指向 `http://localhost:8003`（Web API）
2. 确保所有 API 请求都携带 JWT Token（从 `localStorage.getItem('access_token')` 获取）
3. 处理 401 响应，跳转到登录页

### 第七步：侧边栏导航更新

确认 `apps/frontend/ratel-mind-web/src/components/LeftSidebar.tsx` 包含以下菜单项：
- 主页 (`/ratel/home`)
- 基金 (`/ratel/fund`)
- 资讯 (`/ratel/news`)
- 配置广场 (`/ratel/config-plaza`)
- 报告广场 (`/ratel/report-plaza`)
- 基金报告 (`/ratel/reports`) - 标记为 iframe 页面

## 技术约束

1. **保持原有技术栈**：迁移后的代码仍使用 React Router 7 + Vite 环境变量（通过 Next.js polyfill）
2. **路径别名**：必须支持 `@ratel` 别名（映射到 `apps/frontend/ratel-mind-web/src`）
3. **认证机制**：使用 localStorage 存储 JWT Token（key: `access_token`）
4. **API 端点**：所有 API 请求指向 `http://localhost:8003`（开发环境）或 `https://www.beansinfo.com`（生产环境）
5. **样式隔离**：确保迁移的样式不影响 Snowball 的 Next.js 页面

## 验证清单

完成迁移后，请验证：
- [ ] 所有页面路由可以正常访问（`/ratel/home`, `/ratel/fund` 等）
- [ ] 侧边栏导航正确显示所有菜单项
- [ ] API 请求正确携带 JWT Token
- [ ] `/ratel/reports` 页面的 iframe 正确加载 Snowball 工作台
- [ ] 认证过期时能正确跳转到登录页
- [ ] 样式和资源文件正确加载
- [ ] `@ratel` 路径别名正常工作

## 注意事项

1. **不要修改** `/Volumes/Ventoy/Playground/ratel-mind-web` 源项目的代码
2. **不要修改** Snowball 的现有路由（`/workspace`, `/reports` 等）
3. **不要修改** 后端 API 代码，仅需确认 CORS 配置包含 `http://localhost:3000` 和 `http://localhost:5173`
4. 如果遇到依赖冲突，优先使用当前 Next.js 项目的依赖版本（React 19）
5. 迁移过程中保持代码整洁，避免重复代码

请按照以上步骤逐步执行迁移，每完成一个步骤后向我汇报进度和遇到的问题。