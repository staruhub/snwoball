## Context

当前系统有两套认证流程：
- **User 认证** (`/api/v1/auth/*`)：普通用户登录 ratel-mind-web，token 存储在 `access_token` localStorage key
- **Admin 认证** (`/api/v1/admin-auth/*`)：管理员登录 admin panel，后端使用 `scope: "admin"` 和 `token_prefix: "admin"` 生成专用 token

问题：
1. `useUserStore` 的 hydration 逻辑无条件读取 `access_token` 并设置 `isAuthenticated: true`，导致 admin 路由误用 ratel token
2. `fetchWebApi` 对所有 401 响应都尝试 token refresh，包括登录失败的 401，导致用户看不到错误信息

## Goals / Non-Goals

**Goals:**
- Admin token 和 User token 完全隔离存储
- Admin 路由只使用 admin token，不会被 ratel token 污染
- Login 端点的 401 错误直接返回给调用者，不触发 refresh/redirect
- 保持向后兼容，不影响现有 ratel 用户

**Non-Goals:**
- 不重构整个认证架构
- 不修改后端 token 生成逻辑
- 不引入新的状态管理库

## Decisions

### Decision 1: Admin token 独立存储 key

**选择**：使用 `admin_access_token` 和 `admin_refresh_token` 作为 admin 专用 localStorage key

**理由**：
- 物理隔离，避免任何覆盖可能
- 简单直接，不需要修改 store 结构
- 与现有 ratel-mind-web 的 `access_token` 完全独立

**替代方案**：
- 使用同一个 key 但加 scope 前缀 → 解析复杂，容易出错
- 使用 sessionStorage 区分 → 刷新页面会丢失状态

### Decision 2: 路由感知的 token 读取

**选择**：在 `useUserStore` 和 `fetchWebApi` 中根据当前路径判断使用哪个 token

```typescript
const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
const tokenKey = isAdminRoute ? 'admin_access_token' : 'access_token'
```

**理由**：
- 不需要修改 API 调用签名
- 自动根据上下文选择正确的 token

### Decision 3: 认证端点白名单跳过 refresh

**选择**：在 `fetchWebApi` 中维护一个认证端点列表，这些端点的 401 不触发 refresh

```typescript
const AUTH_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/send-code',
  '/api/v1/admin-auth/login',
  '/api/v1/auth/register',
]

const isAuthEndpoint = AUTH_ENDPOINTS.some(ep => url.includes(ep))
if (response.status === 401 && !isAuthEndpoint) {
  // 才尝试 refresh
}
```

**理由**：
- 集中管理，易于维护
- 不需要每个 login 调用都传递 `skipRefresh` 参数

**替代方案**：
- 让调用者传 `skipRefresh: true` → 容易遗漏，不够安全
- 检查是否有现有 token 再 refresh → 可能误判

### Decision 4: Admin store 与 User store 分离

**选择**：保持单一 `useUserStore`，但区分 admin 和 user 状态

```typescript
interface UserState {
  // User auth
  token: string | null
  isAuthenticated: boolean
  // Admin auth (新增)
  adminToken: string | null
  isAdminAuthenticated: boolean
}
```

**理由**：
- 避免创建新的 store，减少复杂度
- 在同一个 store 中管理，状态清晰

## Risks / Trade-offs

**[Risk] 路由判断的边界情况**
→ 如果用户直接访问 `/admin` (无尾随斜杠)，`startsWith('/admin')` 可能误判
→ Mitigation: 使用更精确的判断 `pathname.startsWith('/admin/') || pathname === '/admin'`

**[Risk] localStorage key 迁移**
→ 已登录的 admin 用户升级后需要重新登录
→ Mitigation: 这是可接受的行为，admin 用户数量少

**[Trade-off] 单 store vs 双 store**
→ 单 store 更简单但耦合度高；双 store 更清晰但增加复杂度
→ 选择单 store，因为 admin 和 user 不会同时活跃在同一页面

## 实现要点

### useUserStore.ts 修改

1. 新增 admin 相关状态字段
2. 修改 hydration 逻辑，根据路由读取不同 token
3. 新增 `setAdminToken`, `clearAdminToken` actions

### config.ts 修改

1. 新增 `AUTH_ENDPOINTS` 白名单
2. 修改 `fetchWebApi` 的 401 处理，检查是否为认证端点
3. 修改 `getAccessToken` 根据当前路由返回对应 token

### auth.ts 修改

1. `adminLogin` 成功后存储到 `admin_access_token`
2. `adminLogout` 清理 admin 专用 keys
