## Why

当前 Snowball 和 ratel-mind-web 有两套独立的登录页面：
- Snowball 登录页: `/login` (`apps/frontend/app/login/page.tsx`)
- ratel-mind-web 登录页: `/ratel/login` (`apps/frontend/ratel-mind-web/src/pages/Login/index.tsx`)

这导致用户体验不一致，且维护成本高。ratel-mind-web 的登录页已包含更完善的功能（验证码验证、主题支持、syncToSnowballStore 同步等），应作为统一入口。

## What Changes

### 路由变更

1. **修改 `/login` 路由行为**
   - 将 `apps/frontend/app/login/page.tsx` 改为重定向到 `/ratel/login`
   - 保留原有的 redirect 查询参数传递

2. **更新认证守卫**
   - `apps/frontend/hooks/useAuth.ts` 的默认重定向改为 `/ratel/login`
   - `apps/frontend/app/(iframe)/workspace/layout.tsx` 的重定向改为 `/ratel/login`

3. **更新登出流程**
   - `apps/frontend/stores/useUserStore.ts` 的 logout 后重定向到 `/ratel/login`

### 保留的能力

- ratel-mind-web 登录页的完整功能:
  - JWT Token 存储 (`access_token`, `refresh_token`)
  - `syncToSnowballStore()` 同步到 Snowball zustand store
  - 滑动验证码验证
  - 主题切换支持
  - redirect 查询参数支持

### 删除的代码

- `apps/frontend/app/login/page.tsx` 的完整登录表单逻辑（保留文件但只做重定向）

## Impact

### 受影响的代码

**apps/frontend** (Snowball):
- `app/login/page.tsx` - 简化为重定向组件
- `hooks/useAuth.ts` - 更新默认重定向路径
- `app/(iframe)/workspace/layout.tsx` - 更新重定向路径
- `stores/useUserStore.ts` - 更新登出重定向路径

### 受影响的 Specs

- `specs/user-auth` - MODIFIED: 更新登录重定向场景

### 风险评估

- **低风险**: 仅路由变更，不影响核心认证逻辑
- **注意**: 确保 ratel-mind-web 登录成功后正确重定向（默认 `/ratel/fund` 或查询参数指定路径）
