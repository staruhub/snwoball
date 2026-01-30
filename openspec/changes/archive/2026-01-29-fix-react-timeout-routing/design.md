## Context

前端应用使用双框架架构：
- **Next.js**: 主应用框架，处理路由和页面渲染
- **Vite (ratel-mind-web)**: 嵌入的 React SPA，通过 dynamic import 加载

Reports 页面通过 iframe 嵌入另一个 Next.js 应用 (Snowball)，存在跨源通信和认证同步的复杂性。

## Goals / Non-Goals

**Goals:**
- 修复 API 请求超时问题，确保组件生命周期正确管理
- 修复路由访问问题，确保 iframe 正确加载
- 保持现有架构不变，最小化修改范围

**Non-Goals:**
- 重构双框架架构
- 更改 iframe 嵌入方案
- 修改后端 API

## Decisions

### 决策 1: 使用 AbortController 管理请求生命周期

**问题:** `PerformanceMetricsPanel` 组件在卸载后可能仍有未完成的请求，导致状态更新错误。

**解决方案:**
```tsx
useEffect(() => {
  const controller = new AbortController();

  const fetchMetrics = async () => {
    try {
      const data = await getComprehensiveMetrics(
        fundInfo.id,
        benchmarkId,
        startDate,
        endDate,
        { signal: controller.signal }
      );
      setMetricsData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('加载综合指标失败:', error);
      }
    }
  };

  if (fundInfo) {
    fetchMetrics();
  }

  return () => controller.abort();
}, [fundInfo, currentBenchmark, startDate, endDate]);
```

### 决策 2: 优化 iframe sandbox 属性

**当前配置:**
```tsx
sandbox="allow-same-origin allow-scripts allow-forms"
```

**建议配置:**
```tsx
sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
```

**原因:**
- `allow-popups`: 允许 iframe 内的页面打开新窗口
- `allow-popups-to-escape-sandbox`: 允许弹出窗口逃离 sandbox 限制
- `allow-modals`: 允许 iframe 显示 modal 对话框

### 决策 3: 添加 iframe 加载错误处理

```tsx
const [loadError, setLoadError] = useState(false);

const handleIframeError = () => {
  setLoadError(true);
};

// 在 render 中
{loadError ? (
  <div className="flex flex-col items-center justify-center h-full">
    <p>无法加载报告中心</p>
    <button onClick={() => window.location.reload()}>重试</button>
  </div>
) : (
  <iframe ... onError={handleIframeError} />
)}
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| AbortController 可能不被所有请求库支持 | 检查 `request.ts` 是否支持 signal 参数 |
| 放宽 sandbox 可能带来安全风险 | 仅添加必要的权限，不使用 `allow-top-navigation` |
| iframe 错误检测不可靠 | 结合 `onLoad` 和超时检测 |

## Migration Plan

1. 先修复 `PerformanceMetricsPanel.tsx` 的请求生命周期问题
2. 验证修复效果
3. 再优化 `Reports/index.tsx` 的 iframe 配置
4. 全面测试所有路由

## Open Questions

- [ ] 后端 `/api/v1/fund/performance/metrics` 接口的平均响应时间是多少？
- [ ] Snowball 服务 (端口 3010) 是否需要额外配置 CORS？
- [ ] 是否需要添加请求重试机制？
