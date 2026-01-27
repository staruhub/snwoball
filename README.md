# Snowball + Ratel Mind Web

本仓库包含 Snowball 基金报告系统（Next.js）与 ratel-mind-web（原 Vite）迁移后的集成版本。

## 架构概览

- **Snowball (Next.js)**：主应用，报告工作台与编辑器。
- **Ratel Mind Web (Next.js 内嵌 React Router)**：挂载在 `/ratel/*`，保留原有路由结构与 UI。
- **报告中心**：在 `/ratel/reports` 中以 iframe 方式加载 Snowball（默认 `/workspace`），通过 URL 参数传递 JWT。

## 本地开发

1. 启动后端（Web API）：
   ```bash
   cd apps/backend
   python modules/web/web_bootstrap.py local
   ```
2. 启动前端（Next.js）：
   ```bash
   cd apps/frontend
   pnpm dev
   ```
3. 访问：
   - Ratel Mind Web：`http://localhost:3000/ratel`
   - 报告中心：`http://localhost:3000/ratel/reports`
   - Snowball 工作台：`http://localhost:3000/workspace`

## 环境变量

参考 `apps/frontend/.env.example`：
- `NEXT_PUBLIC_API_BASE_URL`：ratel-mind-web API 基础地址
- `NEXT_PUBLIC_SNOWBALL_URL`：报告中心 iframe 指向地址

## Token 传递安全注意事项

- Token 通过 iframe URL 参数传递，接收后使用 `history.replaceState` 清除 URL 中的 token。
- 生产环境请使用 HTTPS，并通过 `NEXT_PUBLIC_IFRAME_PARENT_ORIGINS` 限制 postMessage 目标域名。
- 后端 CORS 已限制为白名单域名（见 `apps/backend/modules/web/profiles/application-*.yaml`）。

## 生产部署要点（示例）

```nginx
# app.beansinfo.com - 主应用
server {
  server_name app.beansinfo.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
  }
}

# reports.beansinfo.com - Snowball
server {
  server_name reports.beansinfo.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
  }

  add_header Content-Security-Policy \"frame-ancestors https://app.beansinfo.com\" always;
}
```

- SSL 证书可通过托管平台或自动化工具（如 Certbot）配置。
- 若需 iframe 嵌入，`Content-Security-Policy` 中应显式允许主应用域名。
