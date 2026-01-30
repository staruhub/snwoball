## 1. 修改 Legend 配置

- [x] 1.1 修改收益率图表的 Legend 配置（`FundDetailPanel.tsx:1339-1348`），添加基于 `hideBenchmark` 的条件渲染逻辑
- [x] 1.2 修改回撤图表的 Legend 配置（`FundDetailPanel.tsx:1514-1522`），添加基于 `hideBenchmark` 的条件渲染逻辑

## 2. 验证修复

- [ ] 2.1 测试无基准场景：不选择基准，检查控制台无 ECharts 警告，Legend 只显示基金名称
- [ ] 2.2 测试有基准场景：选择一个基准，检查 Legend 显示基金、基准、超额收益/回撤三项
- [ ] 2.3 测试切换场景：在有基准和无基准之间切换，检查 Legend 动态变化是否正常
