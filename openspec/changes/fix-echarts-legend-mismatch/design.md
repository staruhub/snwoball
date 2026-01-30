## Context

FundDetailPanel 组件使用 ECharts 渲染收益率和回撤图表。当前实现存在配置不同步问题：

- **数据层**：`fetchPerformanceData` 函数在无基准时将 `benchmark_returns`、`excess_returns` 等字段设为空数组
- **渲染层**：`getReturnsChartOption` 和 `getDrawdownChartOption` 使用 `if (!hideBenchmark)` 条件决定是否添加基准相关的 Series
- **问题**：Legend 配置固定显示 3 项（基金、基准、超额），未同步 Series 的条件逻辑

当 `selectedBenchmark = null` 时：
```
hideBenchmark = true
  ↓
数据层：benchmark_returns = []
  ↓
渲染层：跳过基准 series（只添加 1 个 series）
  ↓
Legend：仍显示 3 项
  ↓
⚠️ ECharts 警告："基准 series not exists"
```

## Goals / Non-Goals

**Goals:**
- 消除 ECharts 控制台警告："基准 series not exists" 和 "超额收益 series not exists"
- 使 Legend.data 与 Series.name 完全匹配，符合 ECharts 规范
- 保持现有的双层防御策略（数据层清洗 + 渲染层条件判断）

**Non-Goals:**
- 不改变数据处理逻辑（`fetchPerformanceData` 保持不变）
- 不改变 Series 渲染逻辑（条件判断保持不变）
- 不改变图表的视觉表现或用户交互

## Decisions

### 决策 1：在 Legend 配置中添加条件渲染逻辑

**选择方案 A：条件渲染 Legend**
- Legend 配置使用与 Series 相同的 `hideBenchmark` 条件判断
- 无基准时：`legend.data = [fundDisplayName]`
- 有基准时：`legend.data = [fundDisplayName, selectedBenchmark?.name || '基准', '超额收益']`

**替代方案 B：添加空 Series（不推荐）**
- 保持 Legend 固定 3 项，在无基准时添加空数据的 Series
- 缺点：违反 ECharts 最佳实践，增加不必要的空对象，影响性能

**替代方案 C：数据驱动 Legend（不推荐）**
- 根据数据数组长度动态生成 Legend
- 缺点：跨越架构层，增加复杂度，数据层和 UI 层耦合

**选择理由：**
1. **架构一致性**：Legend 和 Series 都在 UI 渲染层，使用相同的状态源 `hideBenchmark`
2. **单一数据源**：符合 React 最佳实践，避免状态分散
3. **可维护性**：逻辑简单清晰，未来修改成本低
4. **ECharts 规范**：Legend.data 与 Series.name 完全匹配

### 决策 2：修改位置

修改两个图表配置函数中的 Legend 配置：

1. `getReturnsChartOption`（收益率图表）- 行 1339-1348
2. `getDrawdownChartOption`（回撤图表）- 行 1514-1522

保持 Series 配置不变（已有正确的条件判断）。

## Risks / Trade-offs

**[风险] 修改 Legend 配置可能影响现有图表交互**
- 缓解：只修改 `data` 数组，保持 `textStyle`、`top` 等其他配置不变
- 缓解：修改后进行完整的场景测试（有基准、无基准、切换）

**[风险] `selectedBenchmark?.name` 可能为空**
- 缓解：已有后备方案 `|| '基准'`，确保 Legend 始终有有效文本

**[权衡] 增加了 Legend 配置的复杂度**
- 好处：消除控制台警告，提升开发体验
- 好处：符合 ECharts 规范，避免潜在的渲染问题
- 代价：Legend 配置从静态数组变为条件表达式（复杂度增加可忽略）
