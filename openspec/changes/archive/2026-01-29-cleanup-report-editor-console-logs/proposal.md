## Why

ReportEditor 组件中存在 3 处 console.log 调试语句，这些是开发时的临时占位符。
生产代码中不应包含这类调试输出，它们会污染浏览器控制台并可能泄露内部实现细节。

## What Changes

- 移除 `handleSave` 函数中的 2 处 console.log
- 移除 `handleExport` 函数中的 1 处 console.log
- 保留 TODO 注释作为后续开发的提示

## Capabilities

### Modified Capabilities
- `report-editor`: 清理调试代码，保持功能不变

## Impact

- `apps/frontend/components/features/report-editor/ReportEditor.tsx`: 移除 3 处 console.log 语句
