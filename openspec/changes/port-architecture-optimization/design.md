## Context

当前项目使用 5 个端口：
- **3000**: Next.js 前端 (Snowball)
- **3010**: 开发环境 iframe 测试 URL（冗余）
- **5173**: Ratel Mind Web Vite 开发服务器
- **8002**: Admin API (FastAPI)
- **8003**: Web API (FastAPI)

项目采用 "Serviced Monolith" 架构：代码高度共享（91.4%），但通过多个 bootstrapper 暴露为独立服务。这种架构支持独立扩展和故障隔离。

3010 端口最初用于 iframe 测试时避免同源策略限制，但现在 Ratel Mind Web 已通过 `/ratel/[[...slug]]` 路由集成，iframe 也可以使用同一端口 3000。

## Goals / Non-Goals

**Goals:**
- 消除不必要的 3010 端口，简化开发环境配置
- 清理未使用的代码文件
- 保持现有 API 调用方式和 Token 同步机制不变

**Non-Goals:**
- 不合并 Admin API (8002) 和 Web API (8003) - 保持独立扩展能力
- 不添加 Next.js rewrites - 保持现有直接请求方式
- 不修改 API 调用代码 - 风险太高，收益有限

## Decisions

### Decision 1: 使用 3000 替代 3010

**选择**: 将 `NEXT_PUBLIC_SNOWBALL_URL` 从 `localhost:3010` 改为 `localhost:3000`

**理由**:
- 3010 端口仅用于开发环境的 iframe 嵌入测试
- iframe 嵌入的是 Snowball 前端页面，而 Snowball 本身就运行在 3000 端口
- 使用同一端口可以避免跨域问题，简化 CORS 配置

**备选方案考虑**:
- 保留 3010 端口 - 无实际价值，增加复杂度
- 使用 Next.js rewrites 代理 - 增加额外间接层，收益有限

### Decision 2: 保持后端服务分离

**选择**: 保留 Admin API (8002) 和 Web API (8003) 作为独立服务

**理由**:
- Admin API 和 Web API 服务不同的用户群体（管理员 vs 普通用户）
- 独立部署支持：
  - 不同的扩展策略（Admin API 低并发，Web API 高并发）
  - 独立的故障域（一个服务崩溃不影响另一个）
  - 不同的安全策略（Admin API 需要更严格的访问控制）

**备选方案考虑**:
- 合并为单一服务 - 会失去独立扩展和故障隔离能力

### Decision 3: 删除未使用的模型文件

**选择**: 删除 `apps/backend/modules/admin/models/admin_models.py`

**理由**:
- 该文件中的 Role, RolePermission, UserRole, SystemModule 模型从未被导入
- 实际使用的模型定义在 `modules/auth/models/admin_models.py`
- 保留未使用代码会造成混淆和维护负担

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| iframe 同源后可能暴露更多 API 端点 | iframe 页面已有路由保护，同源不会降低安全性 |
| 删除模型文件后发现仍有引用 | 删除前用 grep 验证无引用 |
| 开发环境配置变更导致团队混乱 | 更新 README 和团队文档 |
