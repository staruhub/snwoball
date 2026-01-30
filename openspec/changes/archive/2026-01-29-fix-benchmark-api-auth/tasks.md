## 1. 配置修改

- [x] 1.1 在 AdminAuthenticationMiddleware 的 exclude_paths 中添加 `/api/v1/fund/benchmarks/active`

## 2. 验证

- [x] 2.1 重启 Admin 服务
- [x] 2.2 测试 GET /api/v1/fund/benchmarks/active 无需认证即可访问
- [x] 2.3 验证前端 FundDetailPanel 基准选择功能正常
