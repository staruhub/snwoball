## Why

在 Ratel Fund 页面中，当用户切换到"公募"分组并选择基金时，系统错误地将普通公募基金判断为"组合基金"，导致调用组合基金 API (`/api/v1/fund/portfolio/{id}`) 返回 404 错误。根本原因是 `fundType` 属性在数据转换过程中被错误设置，导致 `itemType` 传递错误值给 `FundDetailPanel` 组件。

## What Changes

- **修复 `index.tsx` 中的 `fundType` 判断逻辑**：确保只有在自选入口下的组合基金分组才将 `fundType` 设置为 `'组合基金'`
- **在 `FundDetailPanel.tsx` 添加防御性检查**：当 `itemType === 'portfolio'` 时，增加额外校验逻辑，避免将普通基金误判为组合基金
- **修复缓存污染问题**：在切换分组时清理对应的缓存数据，避免不同分组间的数据混淆
- **增强 404 错误的回退处理**：当组合基金 API 返回 404 时，自动回退到普通基金 API

## Capabilities

### New Capabilities

（无新功能，仅为 bug 修复）

### Modified Capabilities

- `ratel-frontend`: 修复基金类型判断逻辑，增强 API 错误处理和缓存管理

## Impact

- **受影响文件**：
  - `apps/frontend/ratel-mind-web/src/pages/Fund/index.tsx` - 数据转换和缓存逻辑
  - `apps/frontend/ratel-mind-web/src/pages/Fund/components/FundDetailPanel.tsx` - 组合基金判断和 API 调用
- **受影响功能**：基金详情页面的数据加载、基金列表的类型显示
- **API 影响**：无后端变更，仅前端逻辑修复
- **用户影响**：修复后用户切换公募分组时不再遇到 404 错误
