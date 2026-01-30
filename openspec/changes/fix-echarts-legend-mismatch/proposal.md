## Why

ECharts 在 FundDetailPanel 组件中产生控制台警告："基准 series not exists" 和 "超额收益 series not exists"。根本原因是 Legend 配置固定显示 3 项（基金、基准、超额收益/回撤），而 Series 配置根据 `hideBenchmark` 条件动态添加（有基准时 3 项，无基准时 1 项），导致配置不同步。

## What Changes

- 修改收益率图表的 Legend 配置（`FundDetailPanel.tsx:1339-1348`），使其根据 `hideBenchmark` 条件动态显示：无基准时只显示基金名称，有基准时显示基金、基准、超额收益
- 修改回撤图表的 Legend 配置（`FundDetailPanel.tsx:1514-1522`），使其根据 `hideBenchmark` 条件动态显示：无基准时只显示基金回撤，有基准时显示基金回撤、基准回撤、超额回撤
- 确保 Legend.data 与 Series.name 完全匹配，符合 ECharts 规范

## Capabilities

### New Capabilities
<!-- 此修复不引入新功能 -->

### Modified Capabilities
<!-- 此修复不改变需求层面的行为，仅修复实现层的配置不同步问题 -->

## Impact

- 影响文件：`apps/frontend/ratel-mind-web/src/pages/Fund/components/FundDetailPanel.tsx`
- 影响范围：收益率图表和回撤图表的 Legend 渲染逻辑
- 用户体验：消除控制台警告，图表显示行为保持不变
- 风险：低风险，仅修改配置对象，不改变数据处理或业务逻辑
