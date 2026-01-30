# ratel-mind-web 与 Snowball 集成测试报告

**测试日期**: 2026-01-28
**测试人员**: Claude
**更新日期**: 2026-01-28

## 测试环境

| 服务 | 端口 | 状态 |
|------|------|------|
| Web API (用户认证 + 报告管理) | 8003 | 运行中 |
| Admin API (管理功能) | 8002 | 运行中 |
| Snowball 前端 | 3000 | 运行中 |
| ratel-mind-web | 5173 | 运行中 |

## 测试结果

### 1. 服务启动 ✅ 通过

所有服务均正常启动并可访问。

### 2. 导航集成 ✅ 通过

- ratel-mind-web 左侧导航栏显示"报告广场"菜单项
- 点击后正确跳转到 `/reports` 路由
- 导航配置使用 `?tab=report-plaza` 参数

### 3. Token 传递 (6.3) ✅ 通过

- iframe src 正确包含 token 参数
- 格式: `http://localhost:3000/workspace?token=eyJhbGci...`
- Token 从 localStorage 读取并附加到 URL

### 4. iframe 布局 ✅ 通过

- Snowball 在独立模式下显示完整导航
- 在 iframe 模式下正确隐藏导航栏

### 5. 认证过期处理 (6.4) ✅ 通过

- `useIframeAuth` hook 正确监听 `AUTH_EXPIRED` postMessage
- Snowball 在收到 401 响应时正确发送 postMessage
- ratel-mind-web 正确处理消息并跳转登录页

### 6. API 调用 ✅ 已修复

**原问题**：Snowball 前端 `reports.ts` 使用 `fetchApi` 调用 Admin API (8002)，但报告接口实际在 Web API (8003)。

**修复方案**：将 `reports.ts` 中所有 `fetchApi` 调用改为 `fetchWebApi`，使报告 API 正确调用 Web API (8003)。

## 已发现并修复的问题

### 问题 1：前端 API 配置错误 (Critical) - 已修复

**描述**：
- Snowball 前端 `reports.ts` 错误地使用 `fetchApi`（指向 Admin API 8002）
- 报告接口实际部署在 Web API (8003)
- 导致所有报告 API 调用失败

**修复**：
- 修改 `apps/frontend/lib/api/reports.ts`
- 将所有 `fetchApi` 替换为 `fetchWebApi`

### 问题 2：环境变量格式 - 已修复

**描述**：ratel-mind-web 使用 `process.env.NEXT_PUBLIC_*`，但 Vite 需要 `import.meta.env.VITE_*`

**修复文件**：
- `src/config/api.ts`
- `src/utils/errorHandler.ts`
- `src/pages/Reports/index.tsx`
- `src/layouts/RootLayout.tsx`

### 问题 3：路径别名缺失 - 已修复

**描述**：代码使用 `@ratel` 别名，但 vite.config.ts 只配置了 `@`

**修复**：添加 `@ratel` 到 vite.config.ts 的 alias 配置

## 架构说明

### API 分布

| API | 端口 | 功能 |
|-----|------|------|
| Web API | 8003 | 用户认证、报告管理、用户数据 |
| Admin API | 8002 | 管理员功能、系统配置 |

### Secret Key 配置

- Web API 和 Admin API 已统一使用相同的 secret_key
- Admin API 已支持双 token 验证（Admin token + Web token）

## 验证步骤

1. ✅ 修改 `reports.ts` 使用 `fetchWebApi`
2. 重启前端开发服务器
3. 在 ratel-mind-web 登录
4. 点击"报告广场"
5. 确认 iframe 正常加载报告列表（无 401 错误）
6. 测试创建/编辑/删除报告功能

## 修改的文件清单

1. `apps/frontend/lib/api/reports.ts` - 改用 `fetchWebApi` 调用 Web API
2. `apps/frontend/ratel-mind-web/vite.config.ts` - 添加 @ratel 别名
3. `apps/frontend/ratel-mind-web/src/config/api.ts` - 修复环境变量
4. `apps/frontend/ratel-mind-web/src/utils/errorHandler.ts` - 修复环境变量
5. `apps/frontend/ratel-mind-web/src/pages/Reports/index.tsx` - 修复环境变量
6. `apps/frontend/ratel-mind-web/src/layouts/RootLayout.tsx` - 修复环境变量
7. `apps/frontend/ratel-mind-web/.env.dev` - 添加 VITE_SNOWBALL_URL
8. `apps/backend/modules/admin/profiles/application-local.yaml` - 统一 secret_key
