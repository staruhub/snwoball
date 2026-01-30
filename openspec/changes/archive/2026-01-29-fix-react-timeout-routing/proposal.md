## Why

前端应用存在两个关键问题：
1. API 请求超时错误：`PerformanceMetricsPanel` 组件在切换页面后无法正确加载数据，控制台显示 `[恢复基金] ⚠️ 没有保存的基金ID`
2. 路由访问被拒绝：`/ratel/reports?tab=*` 路由通过 iframe 嵌入 Snowball 服务，但由于服务配置或 sandbox 限制导致无法访问

## What Changes

### 问题 1 修复：API 请求超时
- **修复** `PerformanceMetricsPanel.tsx` 中 `useEffect` 的依赖数组问题，避免闭包陷阱
- **优化** 基金 ID 恢复逻辑，确保在组件重新挂载时正确恢复状态
- **添加** 请求取消机制，避免组件卸载后的状态更新

### 问题 2 修复：路由访问被拒绝
- **检查** Snowball 服务配置（端口 3010）
- **优化** iframe sandbox 属性，添加必要的权限
- **添加** 错误边界和加载失败提示

## Impact

- Affected specs: `ratel-frontend`
- Affected code:
  - `apps/frontend/ratel-mind-web/src/pages/Fund/components/PerformanceMetricsPanel.tsx`
  - `apps/frontend/ratel-mind-web/src/pages/Fund/index.tsx`
  - `apps/frontend/ratel-mind-web/src/pages/Reports/index.tsx`
  - `apps/frontend/.env.local`
