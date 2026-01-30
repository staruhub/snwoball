## Why

前端调用 `/api/v1/fund/benchmarks/active` 获取基准列表时返回 400 Bad Request 错误，导致基金详情面板无法正常显示基准对比功能。根本原因是 AdminAuthenticationMiddleware 未将此公开接口排除在认证检查之外。

## What Changes

- 将 `/api/v1/fund/benchmarks/active` 添加到 AdminAuthenticationMiddleware 的 exclude_paths 列表中
- 确保其他公开的基金相关 API 端点也被正确排除

## Capabilities

### New Capabilities

无

### Modified Capabilities

- `cross-app-auth`: 修改认证中间件的路径排除配置，允许基准列表接口公开访问

## Impact

- **受影响文件**: `apps/backend/modules/admin/admin_bootstrap.py`
- **受影响 API**: `GET /api/v1/fund/benchmarks/active`
- **前端影响**: FundDetailPanel.tsx 中的基准选择功能将恢复正常
- **风险评估**: 低风险，仅修改认证排除列表，不涉及业务逻辑变更
