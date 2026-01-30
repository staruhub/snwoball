## 1. 根因分析与验证

- [x] 1.1 在 `index.tsx` 的 `fetchFundData` 函数中添加调试日志，确认 `type`、`selectedGroupId` 和转换后 `fundType` 的值
- [x] 1.2 检查 `dataCacheRef` 的缓存键是否正确隔离不同分组的数据

## 2. 修复数据源头的 fundType 判断逻辑

- [x] 2.1 在 `index.tsx` 的 `fetchFundData` 函数中，修改 fundType 判断条件，确保只有 `type === 'self-selected' && selectedGroupId === 'portfolio'` 时才设置 `fundType: '组合基金'`
- [x] 2.2 对于非组合基金场景，确保使用 `getFundTypeLabel(fund.fund_type)` 正确映射 fundType

## 3. 添加缓存清理逻辑

- [x] 3.1 在 `selectedGroupId` 变化的 `useEffect` 中，删除 `dataCacheRef.current` 中对应分组的缓存数据
- [x] 3.2 确保切换分组时 fundData 被重置为空数组，分页重置为 1

## 4. 添加防御性错误处理

- [x] 4.1 在 `FundDetailPanel.tsx` 的 `fetchFullFundDetail` 函数中，当组合基金 API 返回 404 时，自动回退到普通基金 API
- [x] 4.2 添加 console.warn 日志记录回退行为，便于后续排查

## 5. 测试验证

- [ ] 5.1 测试场景：从自选组合基金分组切换到公募分组，选择基金，确认不再出现 404 错误
- [ ] 5.2 测试场景：在公募分组中选择多个基金，确认 fundType 显示正确
- [ ] 5.3 测试场景：在自选组合基金分组中选择组合基金，确认组合基金 API 正常工作
- [ ] 5.4 清理调试日志代码
