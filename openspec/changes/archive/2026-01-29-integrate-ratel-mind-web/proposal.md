## Why

当前 Snowball 基金报告系统 (`apps/frontend`) 作为独立应用运行，需要与 ratel-mind-web 主应用进行整合，实现统一入口和用户体验。通过 iframe 内嵌方式，用户可以在 ratel-mind-web 的导航框架下无缝访问报告功能，同时保持两个系统的独立开发和部署能力。

## What Changes

### 新增能力

1. **ratel-mind-web 侧边栏集成**
   - 在 `LeftSidebar.tsx` 添加"报告中心"导航项
   - 创建 `/reports` 路由页面，通过 iframe 加载 Snowball 前端
   - 配置环境变量指向 Snowball 部署地址

2. **跨应用 JWT Token 传递**
   - ratel-mind-web 通过 URL 参数将 Token 传递给 iframe
   - Snowball 前端接收并存储 Token，用于后续 API 请求
   - 支持 postMessage 通信处理认证过期

3. **后端 CORS 配置增强**
   - 更新 `application-local.yaml` 和 `application-prod.yaml`
   - 支持多源跨域请求（ratel-mind-web + Snowball）
   - 配置允许 iframe 嵌入的安全策略

4. **Snowball 前端 iframe 模式适配**
   - 检测 iframe 嵌入环境，调整 UI 布局（隐藏重复导航）
   - 接收父窗口传递的认证 Token
   - 处理认证过期时通知父窗口

### 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                    ratel-mind-web (主应用)                   │
│  ┌─────────────┐  ┌───────────────────────────────────────┐ │
│  │  LeftSidebar │  │              Main Content              │ │
│  │             │  │  ┌─────────────────────────────────┐  │ │
│  │  • 首页     │  │  │                                 │  │ │
│  │  • 基金     │  │  │   Snowball 前端 (iframe)        │  │ │
│  │  • 资讯     │  │  │   - 报告列表                     │  │ │
│  │  • 组合     │  │  │   - 报告编辑器                   │  │ │
│  │  • 报告中心 │◄─┤  │   - 模板管理                     │  │ │
│  │             │  │  │                                 │  │ │
│  └─────────────┘  │  └─────────────────────────────────┘  │ │
│                   └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API 请求 (JWT)
                              ▼
                    ┌─────────────────────┐
                    │  apps/backend       │
                    │  (FastAPI 8003)     │
                    └─────────────────────┘
```

## Impact

### 受影响的代码

**ratel-mind-web** (外部仓库 `/Volumes/Ventoy/Playground/ratel-mind-web`):
- `src/components/LeftSidebar.tsx` - 添加报告中心导航项
- `src/routers/index.tsx` - 添加 `/reports` 路由
- `src/pages/Reports/index.tsx` - 新建 iframe 容器页面 (新文件)
- `src/pages/Reports/hooks/useIframeAuth.ts` - Token 传递和消息监听 (新文件)
- `.env.dev` / `.env.prod` - 添加 Snowball URL 环境变量

**apps/frontend** (Snowball):
- `app/layout.tsx` - 添加 iframe 模式检测和 Token 接收逻辑
- `lib/api/config.ts` - 确保 Token 拦截器正确处理 localStorage
- `components/IframeAdapter.tsx` - iframe 环境适配组件 (新文件)

**apps/backend**:
- `modules/web/profiles/application-local.yaml` - 更新 CORS 配置
- `modules/web/profiles/application-prod.yaml` - 更新 CORS 配置

### 受影响的 Specs

- `specs/user-auth` - MODIFIED: 添加跨应用认证场景

### 新增 Specs

- `specs/iframe-embedding` - 新增: iframe 嵌入规范
- `specs/cross-app-auth` - 新增: 跨应用认证规范

### 部署影响

- 开发环境: ratel-mind-web 运行在 5173 端口 (Vite 默认), Snowball 运行在 3000 端口
- 生产环境: 需要配置多子域名 (如 `app.example.com` 和 `reports.example.com`)
- Nginx 需要配置 `X-Frame-Options` 允许同源或特定域名 iframe 嵌入

### 风险评估

- **低风险**: 两个前端应用保持独立，不影响各自的核心功能
- **中等风险**: Token 通过 URL 传递存在安全隐患，需在生产环境限制 CORS 和使用 HTTPS
- **建议**: 后续可升级为 postMessage + HttpOnly Cookie 方案
