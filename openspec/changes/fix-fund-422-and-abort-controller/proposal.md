## Why

基金详情页在用户选择短时间范围（如"近一月"）或查看新成立基金时，后端返回 HTTP 422 错误（"数据不足，无法计算"）被前端当作系统错误处理，显示错误 toast 和控制台错误日志，而这实际上是业务边界条件，应该优雅降级。同时，AbortController 的 signal 未正确传递到底层 fetch 请求，导致快速切换筛选条件时无法真正取消正在进行的网络请求，浪费带宽和后端资源。

## What Changes

- **业务错误识别**：在组件层识别 HTTP 422 + "数据不足" 的组合为业务边界条件
- **静默处理**：对此类错误不显示 toast，不记录为 console.error
- **友好提示**：在 UI 中显示引导信息："当前区间数据不足，无法计算指标，请尝试拉长时间范围"
- **AbortSignal 传递**：修改 services/fund.ts 的 API 函数支持 AbortSignal 参数
- **请求取消链条**：确保 signal 从组件 → 服务层 → request 工具完整传递

## Capabilities

### New Capabilities

（无新能力，本次是对现有能力的修复）

### Modified Capabilities

- `ratel-frontend`: 修改基金详情页的错误处理逻辑，区分业务错误和系统错误；修复 AbortController 的 signal 传递链条

## Impact

- **受影响文件**：
  - `apps/frontend/ratel-mind-web/src/pages/Fund/components/PerformanceMetricsPanel.tsx`
  - `apps/frontend/ratel-mind-web/src/pages/Fund/components/FundDetailPanel.tsx`
  - `apps/frontend/ratel-mind-web/src/services/fund.ts`
  - `apps/frontend/ratel-mind-web/src/utils/request.ts`（可能需要小改动支持外部 signal）
- **用户体验**：从看到错误提示变为看到友好引导
- **性能**：减少无效的网络请求，降低后端负载
