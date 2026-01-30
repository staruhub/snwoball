## Context

当前 `/ratel/fund` 页面在 Next.js 15 主应用中嵌入 Vite + React Router 构建的 `ratel-mind-web` 子应用。页面加载时存在以下问题：
1. 数据无法加载，持续显示 loading 状态
2. 同时发起 7+ 个重量级 API 请求影响首屏性能
3. 缺乏刷新机制导致用户无法主动更新数据

现有架构：
- 主应用 Next.js 使用 `webpack.DefinePlugin` 将 `NEXT_PUBLIC_API_BASE_URL` 注入为 `import.meta.env.VITE_API_BASE_URL`
- 子应用 `request.ts` 从 `API_CONFIG.BASE_URL` 获取基础 URL
- 认证 token 通过 localStorage 在两个应用间共享

## Goals / Non-Goals

**Goals:**
- 诊断并修复数据加载失败问题
- 实现分层数据加载：首屏只加载基金列表，分析数据按需加载
- 添加带节流的手动刷新机制
- 提供清晰的加载状态和错误反馈

**Non-Goals:**
- 不修改后端 API 结构
- 不引入新的状态管理库（使用现有 React useState/useRef）
- 不实现自动轮询刷新（仅手动刷新）
- 不做服务端渲染优化

## Decisions

### Decision 1: 分层数据加载策略

**选择**: 将 API 调用分为 Critical（关键）和 Deferred（延迟）两层

**Critical（首屏必需）**:
- `getFundList` / `getFundMetricsListWeb` - 基金列表

**Deferred（用户交互后加载）**:
- `getPerformanceComparison` - 选中基金后加载
- `getComprehensiveMetrics` - 选中基金后加载
- `getFactorRiskContribution` - 展开详情面板后加载
- `getReturnAttribution` - 展开详情面板后加载
- `getFactorHeatmap` - 展开详情面板后加载
- `getMultiFundComparison` - 用户主动触发对比后加载

**替代方案考虑**:
- 并行加载所有数据：首屏慢，带宽浪费
- 虚拟滚动 + 懒加载：改动太大，不符合当前需求

**理由**: 最小改动实现最大收益，用户体验提升明显

### Decision 2: 客户端缓存实现

**选择**: 使用 React `useRef` + 简单对象缓存，带 TTL（Time To Live）

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = useRef<Map<string, CacheEntry<any>>>(new Map());
```

**缓存策略**:
- 基金列表：TTL 5 分钟
- 业绩数据：TTL 10 分钟（变化较慢）
- 分析数据：TTL 30 分钟（计算密集型）

**替代方案考虑**:
- React Query / SWR：引入新依赖，学习成本
- Redux / Zustand：过度设计
- sessionStorage：页面刷新后丢失无影响

**理由**: 简单可控，无新依赖，满足需求

### Decision 3: 刷新节流机制

**选择**: 实现 RefreshButton 组件，带以下特性：

```typescript
interface RefreshConfig {
  minInterval: number;  // 最小刷新间隔（秒）
  cooldownTime: number; // 冷却时间（秒）
}

// 轻量级数据配置
const LIGHT_REFRESH_CONFIG = { minInterval: 5, cooldownTime: 3 };
// 重量级数据配置
const HEAVY_REFRESH_CONFIG = { minInterval: 30, cooldownTime: 10 };
```

**UI 反馈**:
- 按钮禁用状态 + 倒计时显示
- 最后更新时间戳
- Loading spinner

**替代方案考虑**:
- lodash throttle：仅函数节流，无 UI 反馈
- 后端限流：需要后端改动

**理由**: 前端控制更灵活，用户反馈更直观

### Decision 4: 诊断加载失败的调试机制

**选择**: 增强错误日志 + 控制台诊断工具

**调试步骤**:
1. 检查 Network Tab 是否有请求发出
2. 检查请求 URL 是否正确（应为 `http://localhost:8003/api/v1/...`）
3. 检查响应状态码（401 = token 问题，CORS = 跨域问题）
4. 检查 `import.meta.env.VITE_API_BASE_URL` 值

**增强日志**:
```typescript
// 在 api.ts 中添加启动诊断
if (IS_DEV) {
  console.log('[API Config] BASE_URL:', API_CONFIG.BASE_URL);
  console.log('[API Config] Environment:', import.meta.env);
}
```

## Risks / Trade-offs

1. **[缓存一致性风险]** → 提供手动刷新按钮，用户可随时获取最新数据

2. **[TTL 过长可能显示陈旧数据]** → 在 UI 上显示"最后更新时间"提示用户

3. **[首次加载仍有感知延迟]** → 可后续考虑 skeleton loading 优化（不在本次范围内）

4. **[节流可能阻止紧急刷新需求]** → 保留极端情况下的强制刷新能力（Shift + 点击跳过节流）

## 实现要点

### 文件修改清单

1. **`apps/frontend/ratel-mind-web/src/pages/Fund/index.tsx`**
   - 添加 `useDataCache` hook 管理缓存
   - 修改 `fetchFundData` 实现分层加载
   - 添加 `RefreshButton` 组件

2. **`apps/frontend/ratel-mind-web/src/hooks/useDataCache.ts`**（新建）
   - 实现通用缓存 hook

3. **`apps/frontend/ratel-mind-web/src/hooks/useThrottledRefresh.ts`**（新建）
   - 实现节流刷新 hook

4. **`apps/frontend/ratel-mind-web/src/config/api.ts`**
   - 添加启动诊断日志

5. **`apps/frontend/ratel-mind-web/src/components/RefreshButton.tsx`**（新建）
   - 刷新按钮 UI 组件
