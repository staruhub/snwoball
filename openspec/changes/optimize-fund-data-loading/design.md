## Context

当前基金数据加载通过 `lib/api/fund.ts` 提供纯函数式 API，每次调用都发起新请求。项目已有 `useDebounce` hook 可复用。工作台的 `globalSearch` 和 `searchFunds` 使用 Promise.all 并行请求并做了容错处理。

**约束**:
- 不引入新的外部依赖（如 SWR、React Query）
- 保持现有 API 层不变，在 hooks 层添加优化
- 兼容现有组件，新 hooks 为可选使用

## Goals / Non-Goals

**Goals:**
- 实现轻量级 SWR 缓存机制，减少重复请求
- 为搜索 API 添加 AbortController 支持，避免竞态条件
- 封装统一错误日志，便于问题定位和未来扩展

**Non-Goals:**
- 不替换或修改现有 `fetchWebApi` 实现
- 不引入服务端缓存或 HTTP 缓存头
- 不做持久化缓存（localStorage/IndexedDB）

## Decisions

### Decision 1: 缓存层架构

**选择**: 创建通用的 `useApiCache` hook + 领域特定 hooks（如 `useFunds`、`useBenchmarks`）

**理由**:
- 通用 hook 封装缓存逻辑（key 生成、TTL、去重、后台刷新）
- 领域 hooks 封装具体 API 调用，提供类型安全的接口
- 这种分层允许未来替换缓存实现而不影响业务代码

**备选方案**:
- 直接修改 `fetchWebApi` 添加缓存 → 侵入性强，难以按需控制
- 使用 React Context 共享缓存 → 增加复杂度，跨组件树共享不灵活

### Decision 2: 缓存 Key 策略

**选择**: 使用 `endpoint + JSON.stringify(params)` 作为缓存 key

**理由**:
- 简单可预测
- 相同参数自动去重
- 便于调试和手动失效

### Decision 3: 搜索请求取消

**选择**: 在 `useSearchFunds` hook 中集成 AbortController，结合现有 `useDebounce`

**理由**:
- 已有 `useDebounce` 可复用
- AbortController 是浏览器原生 API，无需依赖
- 在 hook 内部管理生命周期，组件无需关心

**实现要点**:
- `useDebounce` 控制请求频率
- 每次新请求前 abort 上一个请求
- `fetchWebApi` 需要接受可选的 AbortSignal 参数

### Decision 4: 错误日志封装

**选择**: 创建 `logApiError(context, error, options?)` 工具函数

**理由**:
- 统一错误格式，便于搜索和分析
- 可配置日志级别和是否上报
- 为未来接入 Sentry/LogRocket 等平台预留扩展点

**结构**:
```typescript
interface ApiErrorLogOptions {
  level?: 'warn' | 'error';
  silent?: boolean; // 是否静默（不打印 console）
  metadata?: Record<string, unknown>;
}
```

## Risks / Trade-offs

**内存占用** → 设置合理的缓存大小上限（如 50 个 key），使用 LRU 淘汰策略

**缓存一致性** → 提供 `invalidate(key)` 和 `invalidateAll()` 方法手动失效；关键操作后主动失效相关缓存

**AbortController 兼容性** → 现代浏览器均支持，不考虑 IE

**组件迁移成本** → 保持旧 API 可用，新 hooks 渐进式采用，不强制迁移

## File Structure

```
apps/frontend/
├── hooks/
│   ├── useApiCache.ts        # 通用缓存 hook
│   ├── useFunds.ts           # 基金数据 hooks (useFunds, useSearchFunds, useBenchmarks)
│   └── index.ts              # 导出
├── lib/
│   ├── api/
│   │   ├── config.ts         # 添加 AbortSignal 支持 (可选)
│   │   └── ...
│   └── utils/
│       └── apiLogger.ts      # 错误日志工具
```

## Cache Configuration

| API | TTL | 说明 |
|-----|-----|------|
| `getPublicFunds` | 5 min | 列表变化频率低 |
| `getActiveBenchmarks` | 30 min | 基准数据相对稳定 |
| `getFundProfile` | 10 min | 档案信息变化少 |
| `getFundOverview` | 5 min | 净值可能更新 |
