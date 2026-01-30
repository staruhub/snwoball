## Why

项目当前使用 5 个端口（3000, 3010, 5173, 8002, 8003），其中 3010 端口仅用于开发环境的 iframe 测试，完全可以用 3000 替代。优化端口配置可以减少开发环境复杂度，同时保持后端服务分离的灵活性。

## What Changes

- **移除 3010 端口依赖**: 将 `NEXT_PUBLIC_SNOWBALL_URL` 从 `localhost:3010` 改为 `localhost:3000`
- **更新 CORS 配置**: 从 Web API 的 CORS 允许列表中移除 `localhost:3010`
- **清理未使用代码**: 删除 `apps/backend/modules/admin/models/admin_models.py`（165 行未使用的模型定义）
- **保持服务分离**: 不合并 Admin API (8002) 和 Web API (8003)，保持独立扩展能力

## Capabilities

### New Capabilities

无需新增能力，这是一个配置优化和代码清理变更。

### Modified Capabilities

无需修改现有 spec 级别的行为要求。

## Impact

### 前端配置
- `apps/frontend/.env.local` - 更新 `NEXT_PUBLIC_SNOWBALL_URL` 环境变量

### 后端配置
- `apps/backend/modules/web/profiles/application-local.yaml` - 更新 CORS origins 列表

### 代码清理
- `apps/backend/modules/admin/models/admin_models.py` - 删除未使用的模型文件（Role, RolePermission, UserRole, SystemModule 从未被导入）

### 不受影响
- API 调用方式保持不变（直接请求，无 Next.js rewrites）
- Token 同步机制保持不变（localStorage + Zustand）
- Ratel Mind Web 集成保持不变（/ratel/[[...slug]] 路由）
