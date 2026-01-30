## Context

### 当前状态
- 前端 `FundDetailPanel.tsx` 在加载时调用 `getActiveBenchmarks()` 获取基准列表
- 该请求发送到 `GET /api/v1/fund/benchmarks/active`
- Admin 服务的 `AdminAuthenticationMiddleware` 拦截所有请求进行认证检查
- 该端点未在 `exclude_paths` 中，导致返回 400 Bad Request

### 相关文件
- `apps/backend/modules/admin/admin_bootstrap.py:178-193` - 中间件配置
- `apps/backend/modules/fund/controller/benchmark_controller.py:74-82` - 端点定义（注释标记为"公开接口"）
- `apps/frontend/ratel-mind-web/src/services/benchmark.ts:66-75` - 前端调用

## Goals / Non-Goals

**Goals:**
- 允许 `/api/v1/fund/benchmarks/active` 接口公开访问，无需管理员认证
- 确保前端基金详情页面能正常获取基准列表数据

**Non-Goals:**
- 不修改其他基准管理接口的认证要求（增删改仍需认证）
- 不修改基准控制器的业务逻辑
- 不修改前端调用方式

## Decisions

### Decision 1: 添加单一路径到 exclude_paths

**选择**: 在 `exclude_paths` 列表中添加 `/api/v1/fund/benchmarks/active`

**理由**:
- 最小化改动，仅开放必要的公开接口
- 保持其他基准管理接口的安全性
- 与现有配置模式一致

**备选方案**:
- 使用 `exclude_prefixes` 添加 `/api/v1/fund/benchmarks` - 拒绝，会意外开放所有基准接口
- 在控制器层添加 `skip_auth` 装饰器 - 拒绝，需要修改更多代码

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 公开接口被滥用 | `/benchmarks/active` 仅返回只读数据，无敏感信息 |
| 遗漏其他需要公开的接口 | 后续可按需添加，保持最小权限原则 |

## Implementation

```python
# apps/backend/modules/admin/admin_bootstrap.py
app.add_middleware(
    AdminAuthenticationMiddleware,
    exclude_paths=[
        "/",
        "/health",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/v1/admin-auth/login",
        "/api/v1/admin-auth/refresh",
        "/api/v1/admin-auth/logout",
        "/api/v1/fund/benchmarks/active",  # <-- 添加此行
    ],
    exclude_prefixes=[
        "/static",
    ]
)
```
