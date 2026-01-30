## Context

基金详情页 (`/ratel/fund`) 使用 `FundDetailPanel` 和 `PerformanceMetricsPanel` 组件展示基金业绩数据。当用户选择短时间范围或查看新成立基金时，后端 API 返回 HTTP 422 错误。

当前错误处理链条：
```
API 422 → HttpError → errorHandler.handle() → message.error() → toast 弹出
```

这对于"数据不足"这种业务边界条件是不合适的。

## Goals / Non-Goals

**Goals:**
- 将 HTTP 422 + "数据不足" 识别为业务边界条件，而非系统错误
- 在组件 UI 中显示友好提示，而非错误 toast
- 使 AbortSignal 能正确传递并取消底层 fetch 请求
- 保持向后兼容，不影响其他 422 错误的处理

**Non-Goals:**
- 不修改后端 API 的错误码或返回格式
- 不重构整个错误处理系统
- 不处理其他类型的业务错误

## Decisions

### Decision 1: 在组件层处理 422 业务错误

**选择**：在 `FundDetailPanel` 和 `PerformanceMetricsPanel` 的 catch 块中特殊处理 422

**理由**：
- 服务层保持"纯净"，只负责数据获取
- 不同组件可能对"数据不足"有不同的展示需求
- 最小改动，风险最低

**替代方案**：
- 在服务层统一处理 → 需要定义特殊返回值类型，改动更大
- 在 request.ts 拦截 → 会影响所有 422 错误，不够精确

### Decision 2: 使用 HttpError.status 和 message 双重判断

**选择**：
```typescript
if (err instanceof HttpError && err.status === 422 && err.message.includes('数据不足')) {
  // 业务边界条件处理
}
```

**理由**：
- 仅依赖 status 可能误伤其他 422 错误
- 双重判断更精确，只捕获"数据不足"这种特定场景

### Decision 3: AbortSignal 逐层传递

**选择**：修改调用链，将 signal 显式传递

```
Component (创建 AbortController)
    ↓ signal
fetchMetrics(fundId, benchmarkId, start, end, signal)
    ↓ signal
getComprehensiveMetrics(fundId, benchmarkId, startDate, endDate, signal)
    ↓ { signal }
get<T>(endpoint, params, { signal })
    ↓ signal
fetch(url, { signal })  ← 真正取消
```

**理由**：
- `request.ts` 的 `RequestConfig extends RequestInit`，已支持 signal
- 只需在服务函数中接收并传递 signal 即可

### Decision 4: 组件增加 insufficientData 状态

**选择**：在组件中增加专门的状态来区分"数据不足"和"加载失败"

```typescript
const [insufficientData, setInsufficientData] = useState(false)
const [insufficientDataMessage, setInsufficientDataMessage] = useState<string | null>(null)
```

**理由**：
- 便于 UI 根据不同状态显示不同内容
- 与现有 `error` 状态分离，语义更清晰

## Risks / Trade-offs

**[Risk] 消息内容变化导致识别失败**
→ 后端消息如果从"数据不足，无法计算"改成其他措辞，前端识别会失效
→ Mitigation: 使用 `includes('数据不足')` 而非精确匹配，增加容错

**[Risk] 多组件需要重复相同逻辑**
→ FundDetailPanel 和 PerformanceMetricsPanel 都需要处理
→ Mitigation: 可以提取工具函数 `isInsufficientDataError(err)`，但当前只有两处，暂不抽象

**[Trade-off] 组件层处理 vs 服务层处理**
→ 组件层更灵活但有代码重复；服务层更统一但需要改变返回类型
→ 选择组件层，因为改动更小、更安全

## 实现要点

### PerformanceMetricsPanel.tsx 修改

1. 新增状态：
```typescript
const [insufficientData, setInsufficientData] = useState(false)
```

2. 修改 fetchMetrics 的 catch 块：
```typescript
} catch (err: any) {
  if (err.name === 'AbortError' || signal?.aborted) return

  // 判断是否为"数据不足"业务边界条件
  if (err instanceof HttpError && err.status === 422 && err.message?.includes('数据不足')) {
    console.warn('业务边界条件：', err.message)
    setInsufficientData(true)
    setError(null)  // 不是系统错误
    return
  }

  console.error('加载综合指标失败:', err)
  setInsufficientData(false)
  setError(err.message || '加载失败')
}
```

3. 修改 getComprehensiveMetrics 调用，传递 signal：
```typescript
const data = await getComprehensiveMetrics(fundId, benchmarkId, start, end, signal)
```

4. UI 渲染增加 insufficientData 分支：
```tsx
{insufficientData ? (
  <div className="flex items-center justify-center h-full">
    <div className="text-muted-foreground text-sm text-center">
      当前区间数据不足，无法计算指标<br />
      请尝试拉长时间范围
    </div>
  </div>
) : ...}
```

### services/fund.ts 修改

修改 `getComprehensiveMetrics` 和 `getPerformanceComparison` 函数签名：

```typescript
export const getComprehensiveMetrics = async (
  fundId: string | number,
  benchmarkId: string | number,
  startDate?: string,
  endDate?: string,
  signal?: AbortSignal  // 新增
): Promise<ComprehensiveMetricsData> => {
  const response = await get<ComprehensiveMetricsData>(
    '/api/v1/fund/performance/metrics',
    { fund_id: fundId, benchmark_id: benchmarkId, ... },
    {
      errorMessage: '获取综合业绩指标失败',
      signal,  // 传递
    }
  )
  return response.data
}
```
