## Why

当前基金数据加载实现虽然功能正确，但缺少前端层面的性能优化机制。多个组件可能重复请求相同的基金/基准列表数据，搜索输入时缺少防抖和请求取消机制导致"后发先至"问题，错误处理分散且缺乏统一的可观测性。这些问题会随着功能扩展和用户增长逐渐影响体验和可维护性。

## What Changes

- 为基金列表、基准列表等 API 添加 hooks 层缓存，支持请求去重和 SWR（Stale-While-Revalidate）模式
- 为搜索类 API 添加防抖机制和 AbortController 取消支持，避免过期请求覆盖最新结果
- 封装统一的 API 错误日志方法，增强错误可观测性，为未来接入日志平台做准备
- 保持现有 API 层（`fetchWebApi`、`getPublicFunds` 等）不变，在 hooks 层添加优化逻辑

## Capabilities

### New Capabilities

- `fund-data-caching`: 基金数据前端缓存机制，包括请求去重、内存缓存、TTL 失效、后台刷新策略
- `api-error-logging`: 统一的 API 错误日志封装，支持错误分类、上下文记录、降级策略配置

### Modified Capabilities

无。本次变更属于实现层优化，不涉及现有 spec 的需求级别变更。

## Impact

**受影响的代码**:
- `apps/frontend/hooks/` - 新增缓存相关 hooks
- `apps/frontend/lib/api/` - 可能增加 AbortController 支持
- 使用基金搜索的组件（如工作台搜索）- 迁移到新 hooks

**依赖**:
- 无新增外部依赖，使用 React 内置的 hooks 和浏览器原生 AbortController

**API 变更**:
- 无 breaking changes，新 hooks 为可选使用
