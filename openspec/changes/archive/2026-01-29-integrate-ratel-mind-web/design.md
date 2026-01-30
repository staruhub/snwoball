## Context

### 背景

Snowball 基金报告系统 (`apps/frontend`) 是一个功能完整的 Next.js 应用，提供报告编辑、模板管理等核心功能。ratel-mind-web 是基于 Vite + React 的主应用，提供基金查询、AI 搜索、组合管理等功能。两者共享同一后端 (`apps/backend`)，使用相同的 JWT 认证体系。

### 当前架构

**ratel-mind-web**:
- 框架: Vite 7 + React 19 + React Router 7
- 端口: 5173 (开发环境 Vite 默认)
- 路由基础路径: `/ratel/`
- 认证: localStorage 存储 JWT Token
- 侧边栏: `src/components/LeftSidebar.tsx`
- 布局: `src/layouts/RootLayout.tsx`

**Snowball (`apps/frontend`)**:
- 框架: Next.js 15 + React 19
- 端口: 3000 (开发环境)
- 认证: Zustand + localStorage 存储 JWT Token
- API 客户端: `lib/api/config.ts`

**共享后端 (`apps/backend`)**:
- 框架: FastAPI
- Web 服务端口: 8003 (本地) / 8103 (生产)
- 认证: JWT Bearer Token
- CORS: 当前配置为 `["*"]`

### 约束

- 两个前端应用需保持独立部署能力
- 不能破坏现有用户的登录状态
- 后端 API 无需修改，仅调整 CORS 配置
- 开发环境需支持热重载

### 利益相关者

- 前端开发: 需要理解两个项目的路由和状态管理
- 后端开发: 需要配置 CORS 支持多源
- 运维: 需要配置 Nginx 和多域名部署

## Goals / Non-Goals

### Goals

1. 用户在 ratel-mind-web 中可以无缝访问 Snowball 的报告功能
2. 保持统一的认证状态，避免重复登录
3. 认证过期时能正确处理，引导用户重新登录
4. 支持开发环境和生产环境的不同配置

### Non-Goals

1. 不在本次变更中合并两个前端代码库
2. 不修改后端认证逻辑
3. 不实现双向通信 (仅需 Snowball → ratel-mind-web 的认证过期通知)
4. 不实现 SSO 单点登录 (复用现有 JWT 机制)

## Decisions

### Decision 1: 使用 iframe 嵌入而非微前端

**选择**: iframe 嵌入

**理由**:
- Snowball 是完整的 Next.js 应用，改造为微前端成本高
- iframe 天然隔离 CSS 和 JS，避免样式冲突
- 两个应用可独立开发、测试、部署
- 实现简单，风险可控

**替代方案**:
- Module Federation: 需要大量配置，且 Next.js 支持有限
- 统一代码库: 工作量大，不符合当前迭代计划

### Decision 2: Token 通过 URL 参数传递

**选择**: 父窗口通过 iframe src 的 URL 参数传递 Token

**理由**:
- 实现简单，无需额外的通信机制
- 跨域场景下 postMessage 初始化时机难以控制
- Token 在传递后立即从 URL 中清除，降低泄露风险

**安全措施**:
- 生产环境强制 HTTPS
- CORS 配置限制具体域名，不使用 `*`
- Token 从 URL 读取后立即调用 `history.replaceState` 清除
- 考虑未来升级为 HttpOnly Cookie + CSRF Token 方案

**替代方案**:
- postMessage: 需要处理 iframe 加载时序，实现复杂
- 共享 Cookie: 跨域 Cookie 需要 SameSite=None，安全性更低

### Decision 3: iframe 内 Snowball 隐藏顶部导航

**选择**: 检测 `window.self !== window.top` 判断 iframe 环境，动态隐藏导航

**理由**:
- 避免双重导航栏，用户体验更一致
- ratel-mind-web 已有完整的导航框架
- 通过 CSS/条件渲染实现，不影响独立访问

**实现**:
```tsx
// apps/frontend/app/layout.tsx
const isIframe = typeof window !== 'undefined' && window.self !== window.top
return isIframe ? <IframeLayout>{children}</IframeLayout> : <FullLayout>{children}</FullLayout>
```

### Decision 4: 认证过期通过 postMessage 通知

**选择**: Snowball 在收到 401 响应时，通过 `window.parent.postMessage` 通知 ratel-mind-web

**理由**:
- 允许 ratel-mind-web 统一处理认证过期
- 避免在 iframe 内显示登录页造成混乱
- 消息格式简单: `{ type: 'AUTH_EXPIRED' }`

**实现**:
```typescript
// apps/frontend/lib/api/config.ts - 响应拦截器
if (response.status === 401 && window.self !== window.top) {
  window.parent.postMessage({ type: 'AUTH_EXPIRED' }, '*')
}
```

```typescript
// ratel-mind-web/src/layouts/RootLayout.tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'AUTH_EXPIRED') {
      logout() // 清除 Token 并跳转登录页
    }
  }
  window.addEventListener('message', handleMessage)
  return () => window.removeEventListener('message', handleMessage)
}, [])
```

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| URL 参数 Token 泄露 | 中 | 读取后立即清除; 生产环境强制 HTTPS; 限制 CORS 域名 |
| iframe 加载性能 | 低 | Snowball 使用 Next.js SSR, 首屏加载较快 |
| 跨域 Cookie 问题 | 低 | 当前使用 localStorage, 不依赖 Cookie |
| iframe 高度自适应 | 低 | 使用 `height: 100%` 填满容器; 必要时 postMessage 同步高度 |
| postMessage 安全性 | 中 | 验证 `event.origin` 为可信域名 |

## Migration Plan

### 阶段 1: 后端 CORS 配置 (无破坏性)

1. 更新 `application-local.yaml`:
   ```yaml
   api:
     cors_origins:
       - "http://localhost:3000"
       - "http://localhost:5173"
     host: 127.0.0.1
     port: 8003
   ```

2. 更新 `application-prod.yaml`:
   ```yaml
   api:
     cors_origins:
       - "https://reports.example.com"
       - "https://app.example.com"
   ```

### 阶段 2: Snowball 前端适配

1. 添加 `IframeAdapter` 组件检测嵌入环境
2. 修改 `layout.tsx` 根据环境切换布局
3. 更新 API 拦截器处理 401 响应

### 阶段 3: ratel-mind-web 集成

1. 添加 `/reports` 路由页面
2. 在 `LeftSidebar.tsx` 添加"报告中心"导航项
3. 在 `RootLayout.tsx` 添加 postMessage 监听
4. 配置环境变量 `VITE_SNOWBALL_URL`

### 阶段 4: 联调测试

1. 本地环境联调
2. 验证 Token 传递和 API 调用
3. 验证认证过期处理
4. 性能测试

### 回滚计划

- 阶段 1: 回滚 YAML 配置文件
- 阶段 2: 回滚 Snowball 代码变更
- 阶段 3: 从 ratel-mind-web 移除报告中心导航项和路由

各阶段独立可回滚，不影响现有功能。

## Open Questions

1. **生产域名确认**: `app.example.com` 和 `reports.example.com` 是占位符，需确认实际域名
2. **iframe 沙箱策略**: 是否需要限制 `sandbox` 属性？当前建议 `allow-same-origin allow-scripts allow-forms`
3. **Token 刷新**: 当 Snowball 内的 Token 即将过期时，是否需要通知 ratel-mind-web 刷新？
4. **移动端适配**: ratel-mind-web 侧边栏在移动端折叠，iframe 内容如何响应？
