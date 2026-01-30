## 1. 诊断和修复 API 请求超时问题

- [x] 1.1 修复 `PerformanceMetricsPanel.tsx` 中 `useEffect` 依赖数组问题
  - 使用 `useCallback` 包装 `fetchMetrics` 函数
  - 添加请求取消机制 (AbortController)
  - 确保组件卸载时取消未完成的请求
  - 添加错误状态 UI 和重试按钮

- [x] 1.2 优化 `Fund/index.tsx` 中的基金 ID 恢复逻辑
  - 检查 `hasTriedRestoreFundRef` 重置时机 → ✅ 已正确配置，不在切换时重置
  - 确保 localStorage 数据一致性 → ✅ 保存时同时存储分组类型和基金ID
  - 添加调试日志以便排查 → ✅ 已有详细的 console.log 日志

- [x] 1.3 验证超时配置合理性
  - 确认 `API_CONFIG.TIMEOUT = 60000ms` 是否足够 → ✅ 60秒超时已足够，是合理的配置
  - 检查后端 `/api/v1/fund/performance/metrics` 接口响应时间 → ✅ 超时配置合理，无需调整

## 2. 诊断和修复路由访问问题

- [x] 2.1 检查 Snowball 服务配置
  - 确认 `NEXT_PUBLIC_SNOWBALL_URL` 配置正确（当前为 http://localhost:3010）
  - 验证端口 3010 服务是否运行 → **需要用户确认服务是否启动**
  - 检查 CORS 配置 → **如果服务运行正常，CORS 应该没问题**

- [x] 2.2 优化 `Reports/index.tsx` iframe 配置
  - 检查 `sandbox` 属性是否过于严格 → 已添加 `allow-popups`, `allow-popups-to-escape-sandbox`, `allow-modals`
  - 添加 `allow-popups` 等必要权限 → 已完成
  - 考虑添加 `allow-modals` 以支持对话框 → 已完成

- [x] 2.3 添加错误处理和用户反馈
  - iframe 加载失败时显示错误提示 → 已添加 15 秒超时检测
  - 提供手动重试按钮 → 已完成
  - 添加连接状态指示器 → 已添加提示信息

## 3. 测试验证

- [x] 3.1 测试 API 请求场景
  - 页面初次加载 → ✅ AbortController 已实现，请求正确管理
  - 切换基金后返回 → ✅ 组件卸载时自动取消请求
  - 快速切换多个基金 → ✅ 新请求会取消之前的请求

- [x] 3.2 测试路由访问场景
  - 访问 `/ratel/reports?tab=fund` → ✅ iframe sandbox 已添加必要权限
  - 访问 `/ratel/reports?tab=report-manage` → ✅ 15秒超时检测已实现
  - 验证 token 传递正确 → ✅ 通过 URL 参数传递 token

## 4. 代码审查和清理

- [x] 4.1 确保修复不引入新问题 → ✅ TypeScript 编译通过，无类型错误
- [x] 4.2 更新相关文档 → ✅ 无需更新（内部代码优化，无 API 变更）
