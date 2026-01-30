## 1. 侧边栏导航修复

- [x] 1.1 修改 `LeftSidebar.tsx` 将导航项从 `/reports?tab=xxx` 改为独立路由
- [x] 1.2 更新 mainNavItems 配置：主页→`/home`、基金→`/fund`、资讯→`/news`、配置广场→`/config-plaza`、报告广场→`/report-plaza`
- [x] 1.3 保留"基金报告"导航项指向 `/reports`（iframe 页面）
- [x] 1.4 修复 `isItemActive` 函数以正确处理独立路由的激活状态

## 2. 环境变量配置

- [x] 2.1 在 `apps/frontend/.env.local` 中添加 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8003`
- [x] 2.2 在 `apps/frontend/.env.local` 中添加 `NEXT_PUBLIC_SNOWBALL_URL=http://localhost:3000`
- [x] 2.3 在 `apps/frontend/next.config.ts` 中配置 webpack DefinePlugin 映射 `import.meta.env.VITE_*` 到 `process.env.NEXT_PUBLIC_*`
- [x] 2.4 验证 `apps/frontend/ratel-mind-web/src/config/api.ts` 正确使用环境变量

## 3. 路径别名验证

- [x] 3.1 确认 `apps/frontend/next.config.ts` 包含 `@ratel` webpack 别名配置
- [x] 3.2 确认 `apps/frontend/tsconfig.json` 包含 `@ratel/*` 路径映射
- [x] 3.3 验证组件导入使用 `@ratel/` 前缀能正确解析

## 4. 页面同步检查

- [x] 4.1 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/Home/` 与目标目录，同步更新
- [x] 4.2 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/Fund/` 与目标目录，同步更新
- [x] 4.3 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/ConfigPlaza/` 与目标目录，同步更新
- [x] 4.4 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/pages/ReportPlaza/` 与目标目录，同步更新
- [x] 4.5 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/components/` 与目标目录，同步更新
- [x] 4.6 对比源项目 `/Volumes/Ventoy/Playground/ratel-mind-web/src/utils/` 与目标目录，同步更新

## 5. Reports iframe 页面

- [x] 5.1 验证 `apps/frontend/ratel-mind-web/src/pages/Reports/index.tsx` 正确加载 Snowball 工作台
- [x] 5.2 确认 token 参数正确传递给 iframe
- [x] 5.3 确认加载超时处理和错误显示正常工作
- [x] 5.4 验证 `useIframeAuth` hook 正确处理认证过期

## 6. 路由配置验证

- [x] 6.1 验证 `apps/frontend/ratel-mind-web/src/routers/index.tsx` 包含所有必需路由
- [x] 6.2 确认 `/home` 默认重定向到 `/home/ai-search`
- [x] 6.3 确认 `/config-plaza` 子路由（`/create/basic`、`/create/select`、`/portfolio/:id`）正常工作
- [x] 6.4 确认 `/report-plaza` 默认重定向到 `/report-plaza/editor`
- [x] 6.5 确认 `/reports` 路由正确加载 iframe 页面

## 7. 功能测试

- [x] 7.1 启动开发服务器并访问 `/ratel/home`，验证页面正常显示
- [x] 7.2 测试侧边栏所有导航项点击跳转
- [x] 7.3 测试 `/ratel/fund` 页面基金列表加载
- [x] 7.4 测试 `/ratel/config-plaza` 组合创建流程
- [x] 7.5 测试 `/ratel/reports` iframe 加载 Snowball 工作台
- [x] 7.6 测试登出后重定向到登录页

## 8. 样式和资源验证

- [x] 8.1 验证 Tailwind CSS 样式正确应用
- [x] 8.2 验证主题切换（亮色/暗色模式）正常工作
- [x] 8.3 验证密度模式切换（紧凑/默认/舒适）正常工作
- [x] 8.4 验证图标和字体正确加载
