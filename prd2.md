# Snowball 与 ratel-mind-web 系统整合方案

我需要将现有的 Snowball 基金报告系统（`apps/frontend`）与 ratel-mind-web 系统进行整合。

## 整合方式

- **主应用**: ratel-mind-web（需要先拉取代码分析）
- **子模块**: Snowball 基金报告系统（通过 iframe 内嵌到 ratel-mind-web 中）
- **导航方式**: 点击 ratel-mind-web 左侧边栏的"报告中心"菜单项，在主内容区域通过 iframe 加载 Snowball 前端
- **认证方式**: 统一使用 `apps/backend` 的 JWT 认证，通过 URL 参数或 postMessage 传递 Token
- **部署方案**: 生产环境使用多子域名方案（如 `app.example.com` 和 `reports.example.com`）

## 技术栈确认

- **ratel-mind-web**: React 前端（版本和框架待确认，需分析代码）
- **Snowball (`apps/frontend`)**: Next.js 15 + React 19
- **后端**: FastAPI (`apps/backend`)
  - Web 服务默认端口: `8003`（根据 `application-local.yaml`）
  - 生产环境端口: `8103`（根据 `application-prod.yaml`）

## 具体任务

### 阶段 1: 拉取并分析 ratel-mind-web 代码

```bash
git clone https://github.com/quantdata03/ratel-mind-web.git
cd ratel-mind-web
```

**需要确认的信息**:

1. **项目结构**:
   - 查看 `package.json` 确认 React 版本、框架类型（CRA/Vite/Next.js）、启动脚本
   - 查看目录结构，确认是否使用路由库（React Router/Next.js Router）

2. **默认运行端口**:
   - 检查 `package.json` 的 `scripts.dev` 或 `scripts.start`
   - 检查 `.env` 或 `.env.example` 文件
   - 如果端口为 `3000`，需修改为 `3001` 以避免与 Snowball 冲突

3. **侧边栏组件路径**:
   - 搜索关键词: `sidebar`, `menu`, `navigation`, `layout`
   - 常见路径: `src/components/Sidebar.tsx`, `src/layouts/MainLayout.tsx`, `src/components/Navigation.tsx`

4. **路由配置**:
   - 如果使用 React Router，查找 `<Routes>` 或 `createBrowserRouter`
   - 如果使用 Next.js，查看 `pages/` 或 `app/` 目录结构

5. **API 配置**:
   - 查找 API 基础 URL 配置（通常在 `.env` 或 `src/config/api.ts`）
   - 确认当前后端 API 地址

### 阶段 2: 后端 CORS 配置

修改 `apps/backend/modules/web/profiles/application-local.yaml`:

```yaml
api:
  cors_origins:
    - "http://localhost:3000"  # Snowball 前端
    - "http://localhost:3001"  # ratel-mind-web 前端（端口待确认）
  host: 127.0.0.1
  port: 8003
```

修改 `apps/backend/modules/web/profiles/application-prod.yaml`:

```yaml
api:
  cors_origins:
    - "https://reports.example.com"  # Snowball 生产域名
    - "https://app.example.com"      # ratel-mind-web 生产域名
  host: 127.0.0.1
  port: 8103
```

### 阶段 3: ratel-mind-web 侧边栏集成

**步骤 3.1**: 在侧边栏组件中添加"报告中心"菜单项

假设侧边栏组件路径为 `src/components/Sidebar.tsx`（实际路径需根据代码分析确定）:

```tsx
// 示例代码，实际实现需根据项目结构调整
const menuItems = [
  { id: 'dashboard', label: '仪表盘', path: '/dashboard' },
  { id: 'reports', label: '报告中心', path: '/reports', isIframe: true },
  // ... 其他菜单项
];
```

**步骤 3.2**: 创建 iframe 容器页面

在 ratel-mind-web 中创建报告中心路由页面（路径根据项目框架调整）:

```tsx
// 示例: src/pages/Reports.tsx 或 app/reports/page.tsx
import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [iframeUrl, setIframeUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const snowballUrl = process.env.NEXT_PUBLIC_SNOWBALL_URL || 'http://localhost:3000';
    setIframeUrl(`${snowballUrl}/reports?token=${token}`);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src={iframeUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="报告中心"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}
```

### 阶段 4: Snowball 前端认证集成

**步骤 4.1**: 在 Snowball 中接收并存储 Token

修改 `apps/frontend/app/layout.tsx`:

```tsx
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 从 URL 参数获取 token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('auth_token', token);
      // 清除 URL 中的 token 参数（安全考虑）
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

**步骤 4.2**: 配置 API 请求携带 Token

修改或创建 `apps/frontend/lib/api-client.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003',
  timeout: 30000,
});

// 请求拦截器：自动添加 Authorization 头
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理 401 未授权
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，跳转回主应用登录页
      localStorage.removeItem('auth_token');
      window.parent.postMessage({ type: 'AUTH_EXPIRED' }, '*');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**步骤 4.3**: ratel-mind-web 监听认证过期消息

在 ratel-mind-web 的主布局组件中添加:

```tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'AUTH_EXPIRED') {
      // 清除本地 token，跳转到登录页
      localStorage.removeItem('auth_token');
      router.push('/login');
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### 阶段 5: 环境变量配置

**ratel-mind-web 的 `.env.local`** (文件路径待确认):

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:8003

# Snowball 前端地址
NEXT_PUBLIC_SNOWBALL_URL=http://localhost:3000
```

**Snowball 的 `apps/frontend/.env.local`**:

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:8003
```

### 阶段 6: 本地开发环境启动

```bash
# 终端 1: 启动后端服务
cd apps/backend
export PYTHONPATH="$(pwd):$PYTHONPATH"
python modules/web/web_bootstrap.py local  # 默认端口 8003

# 终端 2: 启动 Snowball 前端
cd apps/frontend
pnpm install
pnpm dev  # 默认端口 3000

# 终端 3: 启动 ratel-mind-web 前端
cd ratel-mind-web
npm install  # 或 pnpm install（根据项目配置）
npm run dev  # 端口待确认，建议配置为 3001
```

### 阶段 7: 生产环境部署配置

**多子域名方案**:

- **主应用**: `https://app.example.com` (ratel-mind-web)
- **报告模块**: `https://reports.example.com` (Snowball)

**Nginx 配置示例**:

```nginx
# app.example.com - ratel-mind-web
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# reports.example.com - Snowball
server {
    listen 80;
    server_name reports.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# API 后端
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:8103;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**生产环境变量**:

ratel-mind-web `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SNOWBALL_URL=https://reports.example.com
```

Snowball `apps/frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 待确认清单

完成阶段 1 代码分析后，需要明确:

- [ ] ratel-mind-web 的默认运行端口（建议 3001）
- [ ] ratel-mind-web 的侧边栏组件文件路径
- [ ] ratel-mind-web 的路由配置方式（React Router/Next.js Router）
- [ ] ratel-mind-web 的 API 配置文件路径
- [ ] 是否需要在 Snowball 中添加"返回主应用"按钮（iframe 模式下可选）
- [ ] 生产环境的具体域名（`app.example.com` 和 `reports.example.com` 仅为示例）

## 功能模块归属

**ratel-mind-web 负责**:

- 用户登录/注册（调用 `apps/backend` 的 `/api/auth/login`）
- JWT Token 管理（存储在 `localStorage`）
- 个人设置、用户信息管理
- 主导航和布局框架

**Snowball (`apps/frontend`) 负责**:

- 基金报告 CRUD（列表、详情、创建、编辑、删除）
- 报告编辑器（模块拖拽、配置、预览）
- 报告模板管理
- PDF/Word/Excel 导出（调用 `apps/backend` 的 `/api/report-export`）

**`apps/backend` 负责**:

- 统一认证和授权（JWT Token 签发、验证、刷新）
- 报告数据 CRUD API
- 报告导出服务（PDF/Word/Excel 生成）
- 基金数据查询和计算
