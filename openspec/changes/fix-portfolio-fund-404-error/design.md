## Context

当前 Ratel Fund 页面存在一个 bug：当用户从"自选"入口的"组合基金"分组切换到"公募"分组时，第一个被自动选中的基金会被错误地调用组合基金 API，导致 404 错误。

问题的调用链：
1. `index.tsx` 中 `fetchFundData` 函数处理公募基金数据时，`fundType` 被错误设置为 `'组合基金'`
2. `FundDetailPanel` 接收到 `itemType='portfolio'`
3. `fetchFullFundDetail` 调用 `getPortfolioFund(id)` 而非 `getFundDetail(id)`
4. 后端返回 404，因为该 ID 是普通公募基金

**可能原因**：
- 数据缓存 `dataCacheRef` 在分组切换时未正确隔离
- 数据转换逻辑中 `fundType` 判断条件不够严格
- 后端返回的 `fund_type` 字段值异常

## Goals / Non-Goals

**Goals:**
- 修复公募基金被误判为组合基金的问题
- 确保分组切换时缓存数据正确隔离
- 增加防御性错误处理，提高系统健壮性

**Non-Goals:**
- 不修改后端 API
- 不重构整个基金类型判断体系
- 不改变现有的组合基金功能

## Decisions

### Decision 1: 在数据源头修复 fundType 判断逻辑

**选择**：在 `fetchFundData` 函数中增加更严格的条件判断，只有同时满足 `type === 'self-selected'` AND `selectedGroupId === 'portfolio'` 时才设置 `fundType: '组合基金'`。

**理由**：
- 从源头解决问题，避免错误数据传播到下游组件
- 修改范围小，风险可控
- 符合单一职责原则

**替代方案**：
- 在 `FundDetailPanel` 中根据 fund.id 格式判断 → 不够可靠，ID 格式可能变化
- 在后端返回时增加 `isPortfolio` 标记 → 需要后端配合，周期长

### Decision 2: 在 FundDetailPanel 添加防御性检查和错误回退

**选择**：当 `itemType === 'portfolio'` 但组合基金 API 返回 404 时，自动回退到普通基金 API。

**理由**：
- 提供双重保障，即使数据源有问题也能正常工作
- 改善用户体验，避免显示错误页面
- 日志记录有助于排查问题

**替代方案**：
- 仅显示错误信息 → 用户体验差
- 完全依赖前置判断 → 缺乏健壮性

### Decision 3: 分组切换时清理对应缓存

**选择**：在 `selectedGroupId` 变化的 `useEffect` 中，删除对应分组的缓存数据。

**理由**：
- 避免不同分组间的数据污染
- 确保每次切换分组都获取最新数据
- 实现简单，改动小

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 清理缓存可能导致额外 API 请求 | 仅清理当前切换的分组缓存，其他分组缓存保留；API 请求本身就是必要的 |
| 404 回退逻辑可能掩盖真实 bug | 添加 console.warn 日志，方便后续排查；这是临时防御措施 |
| 修改判断条件可能影响其他场景 | 严格限定修改范围，增加单元测试覆盖 |
