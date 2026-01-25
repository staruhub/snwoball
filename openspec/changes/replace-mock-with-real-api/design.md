## Context

报告编辑器是 Snowball 系统的核心功能，需要支持：
- 创建、编辑、保存报告
- 从真实数据源加载基金列表
- 多模块配置的持久化存储

当前实现使用 Mock 数据和 `setTimeout` 模拟，无法在生产环境使用。

**约束条件**：
- 前端已有 `fetchApi` 和 `fetchWebApi` 通用请求函数
- 后端已有标准响应格式 `APIResponse`
- 已有 `getPublicFunds` API 可用于基金列表
- 需要遵循项目现有的模块化架构

## Goals / Non-Goals

**Goals**:
- 替换所有生产代码中的 Mock 数据
- 实现完整的报告 CRUD API
- 保持向后兼容（API 路径已在前端定义）
- 添加适当的错误处理和加载状态

**Non-Goals**:
- 不重构报告编辑器的 UI 组件
- 不修改报告模块注册系统
- 不添加新的报告功能（仅数据层改造）

## Decisions

### 1. API 端点设计

**决策**: 使用前端已定义的 `/api/v1/user-reports` 路径，在 Web 服务 (8003 端口) 中实现。

**理由**:
- 前端 `reports.ts` 已使用此路径
- 报告是用户级资源，应在 Web 服务中
- 与现有认证中间件兼容

### 2. 报告内容存储格式

**决策**: 使用 JSON 字段存储报告配置，包含以下结构：

```typescript
interface ReportContent {
  modules: Array<{
    id: string;
    moduleType: string;
    title: string;
    order: number;
    height: number;
    isLocked: boolean;
    config: Record<string, unknown>;
  }>;
  globalFilters: {
    fundId: string | null;
    benchmarkId: string | null;
    dateRange: {...};
    frequency: string;
    navType: string;
  };
  reportConfig: {
    theme: string;
    primaryColor: string;
    fontFamily: string;
    fontSize: string;
    showPageNumbers: boolean;
    showTableOfContents: boolean;
  };
}
```

**理由**:
- 灵活存储复杂嵌套结构
- 便于扩展模块配置
- PostgreSQL 原生支持 JSONB

### 3. FundSelector 数据源

**决策**: 使用现有的 `getPublicFunds` API，通过 React Query 管理状态。

**理由**:
- API 已存在且经过测试
- React Query 提供缓存、重试、去重等功能
- 与项目技术栈一致

**替代方案考虑**:
- 创建专门的 `/api/v1/funds/selector` API - 过度设计，现有 API 足够
- 使用 SWR - 项目已选择 React Query，保持一致性

### 4. 保存机制

**决策**:
- 手动保存：直接调用 PUT API
- 自动保存：通过 `useAutoSave` hook 在 30 秒间隔调用相同 API

**理由**:
- 保持现有 UI 行为不变
- 使用相同的保存逻辑，减少代码重复

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 后端 API 未完成时前端无法工作 | 前端添加错误提示，降级显示"保存失败" |
| 大型报告配置可能超出字段限制 | PostgreSQL JSONB 支持大容量，暂不限制 |
| 并发编辑可能导致数据覆盖 | 首版使用最后写入胜出策略，后续考虑乐观锁 |

## Migration Plan

1. **Phase 1**: 后端实现 user-reports API（不影响现有功能）
2. **Phase 2**: 前端 FundSelector 切换到真实 API（独立改动）
3. **Phase 3**: 前端 ReportEditor 切换保存逻辑（依赖 Phase 1）

**回滚策略**: 各 Phase 独立，可单独回滚

## Open Questions

1. 是否需要报告版本历史功能？（建议首版不实现）
2. 报告内容是否需要加密存储？（建议首版不加密）
