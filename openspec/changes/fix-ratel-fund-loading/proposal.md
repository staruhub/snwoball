## Why

用户访问 `/ratel/fund` 页面时出现持续加载无数据的问题，且页面性能因同时发起多个重量级 API 请求而受影响。需要诊断加载失败的根因，优化数据加载策略，并提供手动刷新机制以平衡用户体验与后端负载。

## What Changes

- **诊断与修复数据加载失败**：检查 API 基础 URL 配置、CORS、401 认证错误和网络连通性
- **实现分层数据加载策略**：优先加载关键数据（基金列表），延迟加载重量级分析数据（业绩对比、因子风险等）
- **添加客户端缓存机制**：避免重复请求相同数据，提升响应速度
- **实现节流刷新按钮**：防止用户快速重复刷新造成后端压力，提供清晰的加载状态和数据新鲜度反馈
- **区分轻量级与重量级数据刷新**：轻量级实时数据可自动刷新，重量级分析数据仅手动刷新

## Capabilities

### New Capabilities

- `fund-data-loading`: 基金页面数据加载策略优化，包括分层加载、缓存机制和刷新控制

### Modified Capabilities

- `ratel-frontend`: 增加数据加载诊断能力、分层加载实现和刷新节流机制

## Impact

- **代码文件**：
  - `apps/frontend/ratel-mind-web/src/pages/Fund/index.tsx` - 主要修改，添加分层加载和刷新逻辑
  - `apps/frontend/ratel-mind-web/src/services/fund.ts` - 可能需要添加缓存包装器
  - `apps/frontend/ratel-mind-web/src/utils/request.ts` - 可能需要增强错误诊断
  - `apps/frontend/ratel-mind-web/src/config/api.ts` - 验证 API 配置
  - `apps/frontend/next.config.ts` - 验证环境变量注入
- **API 依赖**：后端端口 8003 的基金相关 API 端点
- **用户体验**：首屏加载更快，刷新行为更可控
