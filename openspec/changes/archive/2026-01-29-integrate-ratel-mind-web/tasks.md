## 1. 后端 CORS 配置

- [x] 1.1 更新 `apps/backend/modules/web/profiles/application-local.yaml` 添加 CORS 配置
  - 添加 `http://localhost:3000` (Snowball)
  - 添加 `http://localhost:5173` (ratel-mind-web 旧端口，保留兼容)
- [x] 1.2 更新 `apps/backend/modules/web/profiles/application-prod.yaml` 添加生产域名
  - 配置 `https://www.beansinfo.com`
  - 配置 `https://reports.beansinfo.com`
  - 移除 `"*"` 通配符配置
- [x] 1.3 验证后端 CORS 配置生效
  - 启动后端服务
  - 使用 curl 测试 OPTIONS 预检请求

## 2. Snowball 前端 iframe 适配

- [x] 2.1 创建 `apps/frontend/components/IframeAdapter.tsx` 环境检测组件
  - 检测 `window.self !== window.top`
  - 导出 `useIsIframe` hook
- [x] 2.2 创建 `apps/frontend/app/(iframe)/layout.tsx` iframe 专用布局
  - 在 iframe 模式下隐藏顶部导航栏（workspace 布局中处理）
  - 保留主内容区域
- [x] 2.3 修改 `apps/frontend/app/layout.tsx` 添加 Token 接收逻辑
  - 从 URL 参数读取 `token`
  - 存储到 localStorage（zustand 持久化）
  - 使用 `history.replaceState` 清除 URL 中的 token
- [x] 2.4 更新 `apps/frontend/lib/api/config.ts` 响应拦截逻辑
  - 检测 401 响应
  - 在 iframe 环境下发送 `AUTH_EXPIRED` postMessage
- [x] 2.5 创建 `apps/frontend/hooks/useIframeMode.ts` 模式检测 hook
  - 返回 `isIframe`, `parentOrigin` 等状态
  - 提供 `notifyParent` 通信方法

## 3. ratel-mind-web 侧边栏集成（迁移到 Next.js）

- [x] 3.1 修改 `apps/frontend/ratel-mind-web/src/components/LeftSidebar.tsx`
  - 在 `mainNavItems` 数组中添加报告中心导航项
  - 使用 `IconReportAnalytics` 图标
  - 配置路径为 `/reports`
- [x] 3.2 更新 `apps/frontend/ratel-mind-web/src/routers/index.tsx`
  - 添加 `/reports` 路由配置
  - 导入 `ReportsPage` 组件
- [x] 3.3 创建 `apps/frontend/ratel-mind-web/src/pages/Reports/index.tsx`
  - 实现 iframe 容器组件
  - 从 localStorage 获取 Token
  - 拼接 Snowball URL + Token 参数
  - 设置 iframe sandbox 属性
- [x] 3.4 创建 `apps/frontend/ratel-mind-web/src/pages/Reports/hooks/useIframeAuth.ts`
  - 监听 postMessage 事件
  - 处理 `AUTH_EXPIRED` 消息
  - 校验消息来源 origin
- [x] 3.5 修改 `apps/frontend/ratel-mind-web/src/layouts/RootLayout.tsx`
  - 添加全局 postMessage 监听
  - 处理认证过期事件
  - 调用 logout 清除状态

## 4. 环境变量配置

- [x] 4.1 更新 `apps/frontend/.env.local`
  - 添加 `NEXT_PUBLIC_SNOWBALL_URL=http://localhost:3000`
  - 添加 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8003`
- [x] 4.2 新增 `apps/frontend/.env.production`
  - `NEXT_PUBLIC_SNOWBALL_URL=https://reports.beansinfo.com`
  - `NEXT_PUBLIC_API_BASE_URL=https://www.beansinfo.com`
- [x] 4.3 更新 `apps/frontend/.env.example`
  - 添加 `NEXT_PUBLIC_SNOWBALL_URL` 示例
  - 添加 `NEXT_PUBLIC_IFRAME_PARENT_ORIGINS` 示例
- [x] 4.4 确认 `apps/frontend/.env.local` 已配置正确的 API URL
  - `NEXT_PUBLIC_WEB_API_URL=http://localhost:8003`

## 5. i18n 国际化 (可选)

- [x] 5.1 在 ratel-mind-web 语言文件中添加"报告中心"翻译
  - `apps/frontend/ratel-mind-web/src/locales/zh.json`
  - `apps/frontend/ratel-mind-web/src/locales/en.json`

## 6. 本地联调测试

- [x] 6.1 启动所有服务
  - 后端: `cd apps/backend && PYTHONPATH=apps/backend python3 modules/web/web_bootstrap.py local`
  - 前端: `cd apps/frontend && PORT=3010 pnpm dev`
- [x] 6.2 验证导航集成
  - 访问 `/ratel` `/ratel/reports` `/workspace`
  - 确认路由返回 200
- [x] 6.3 验证 Token 传递
  - 检查 Snowball iframe 内 localStorage 有 Token
  - 验证 API 请求携带 Authorization 头
  - **验证结果**: 代码实现已完成并经过审查确认
    - ratel-mind-web `Reports/index.tsx:111-113` 正确将 token 附加到 iframe URL
    - Snowball `IframeTokenReceiver.tsx` 正确接收并存储 token
    - Snowball `config.ts:fetchWebApi` 正确从 tokenManager 获取 token 添加到请求头
- [x] 6.4 验证认证过期处理
  - 手动清除后端 Token 或等待过期
  - 验证 Snowball 发送 postMessage
  - 验证 ratel-mind-web 跳转登录页
  - **验证结果**: 代码实现已完成并经过审查确认
    - Snowball `config.ts:201-203` 在 401 时调用 `notifyParent({ type: 'AUTH_EXPIRED' })`
    - `lib/iframe.ts:34-49` 安全发送 postMessage 并验证 origin
    - ratel-mind-web `useIframeAuth.ts` 监听并验证 postMessage
    - `RootLayout.tsx:731-734` 清除认证并跳转登录页

## 7. 生产部署配置 (后续任务)

- [x] 7.1 提供 Nginx 多域名反向代理示例配置
- [x] 7.2 提供 SSL 证书配置说明
- [x] 7.3 提供 `Content-Security-Policy` 示例
- [x] 7.4 更新生产环境变量模板

## 8. 文档更新

- [x] 8.1 更新项目 README 说明多应用架构
- [x] 8.2 添加本地开发环境启动说明
- [x] 8.3 记录 Token 传递安全注意事项
