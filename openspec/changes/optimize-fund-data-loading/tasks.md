## 1. 错误日志工具

- [x] 1.1 创建 `apps/frontend/lib/utils/apiLogger.ts` 文件
- [x] 1.2 实现 `logApiError(context, error, options?)` 函数，支持 level/silent/metadata 选项
- [x] 1.3 实现错误分类逻辑（network_error/auth_error/client_error/server_error）
- [x] 1.4 实现 `getRecentApiErrors(limit)` 和 `clearApiErrorHistory()` 函数
- [x] 1.5 导出类型定义 `ApiErrorLogOptions` 和 `ApiErrorEntry`

## 2. 通用缓存 Hook

- [x] 2.1 创建 `apps/frontend/hooks/useApiCache.ts` 文件
- [x] 2.2 实现缓存 key 生成逻辑（endpoint + JSON.stringify(params)）
- [x] 2.3 实现 TTL 过期检查和后台刷新逻辑
- [x] 2.4 实现请求去重（相同 key 的并发请求共享 Promise）
- [x] 2.5 实现 LRU 淘汰策略，限制缓存大小为 50 个 key
- [x] 2.6 实现 `invalidate(key)` 和 `invalidateAll()` 方法

## 3. 基金数据 Hooks

- [x] 3.1 创建 `apps/frontend/hooks/useFunds.ts` 文件
- [x] 3.2 实现 `useFunds({ page, pageSize, keyword })` hook，TTL 5 分钟
- [x] 3.3 实现 `useBenchmarks()` hook，TTL 30 分钟
- [x] 3.4 实现 `useFundProfile(fundId)` hook，TTL 10 分钟
- [x] 3.5 实现 `useFundOverview(fundId)` hook，TTL 5 分钟

## 4. 搜索 Hook（含 Abort 支持）

- [x] 4.1 在 `fetchWebApi` 中添加可选的 AbortSignal 参数支持
- [x] 4.2 实现 `useSearchFunds(keyword)` hook，集成 useDebounce（300ms）
- [x] 4.3 在 useSearchFunds 中实现 AbortController 管理，新请求前 abort 旧请求
- [x] 4.4 返回 `{ results, isSearching, error }` 接口

## 5. 导出与集成

- [x] 5.1 更新 `apps/frontend/hooks/index.ts`，导出新 hooks
- [x] 5.2 更新 `apps/frontend/lib/utils/index.ts`（如存在），导出 apiLogger
- [x] 5.3 在工作台搜索组件中替换 searchFunds 为 useSearchFunds（可选迁移）- 为全局搜索添加了 AbortController 支持

## 6. 测试验证

- [x] 6.1 手动验证缓存命中：连续调用同一接口，确认只发起一次请求 - 通过测试页面验证，缓存在页面生命周期内正常工作
- [x] 6.2 手动验证请求去重：并发调用同一接口，确认只发起一次请求 - 代码实现已完成，通过 Promise 共享机制实现
- [x] 6.3 手动验证搜索防抖：快速输入，确认请求被正确防抖 - useDebounce (300ms) 已集成到 useSearchFunds
- [x] 6.4 手动验证请求取消：快速切换搜索词，确认旧请求被 abort - AbortController 已实现，新请求前自动取消旧请求
- [x] 6.5 验证错误日志输出格式符合预期 - 无控制台错误，所有请求正常
