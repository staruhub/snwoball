## Context

本项目是一个全新的基金分析报告系统，需要从零开始构建。目标用户是专业的投资经理和基金分析师，他们需要一个灵活、高效的工具来创建和管理基金分析报告。

### 关键利益相关者

- 投资经理（60%）：需要深度分析基金表现
- 基金分析师（30%）：产出研究报告
- 产品经理（10%）：跟踪产品运营数据

### 约束条件

- 性能：页面加载 ≤ 3s，模块数据加载 ≤ 2s，拖拽响应 ≤ 100ms
- 兼容性：Chrome 90+, Edge 90+, Safari 14+, Firefox 88+
- 分辨率：最小 1280×720，建议 1920×1080

## Goals / Non-Goals

### Goals

- 构建模块化、可拖拽的报告编辑器
- 支持多种分析模块类型（收益、风险、归因等）
- 实现全局/模块级参数配置系统
- 提供专业的 PDF 导出功能
- 支持模板保存和复用

### Non-Goals

- 不实现实时协作编辑（V2.0）
- 不支持移动端编辑（V2.0+）
- 不实现撤销/重做功能（暂不规划）
- 不支持 Word/PPT 导出（V2.0）

## Decisions

### 1. 前端架构

**Decision**: 使用 Next.js 16 App Router + React 19

**Rationale**:
- Server Components 提升首屏性能
- 内置路由和布局系统简化开发
- 良好的 TypeScript 支持
- 生态系统成熟

**Alternatives Considered**:
- Vite + React Router: 更轻量，但缺乏 SSR 支持
- Remix: 数据加载模式优秀，但社区生态相对较小

### 2. 拖拽实现

**Decision**: 使用 dnd-kit 实现拖拽功能

**Rationale**:
- 现代化 API，基于 hooks
- 性能优秀，支持虚拟化
- 良好的可访问性支持
- 高度可定制

**Alternatives Considered**:
- react-beautiful-dnd: 开箱即用体验好，但已停止维护
- react-dnd: 灵活但 API 复杂

### 3. 状态管理

**Decision**: 使用 Zustand + React Query

**Rationale**:
- Zustand: 轻量级客户端状态管理，API 简洁
- React Query: 服务端状态管理，自动缓存和重试

**Alternatives Considered**:
- Redux Toolkit: 功能强大但样板代码多
- Jotai/Recoil: 原子化状态适合细粒度更新，但学习曲线较陡

### 4. 图表库

**Decision**: 使用 ECharts 5.x

**Rationale**:
- 图表类型丰富，覆盖金融分析需求
- 支持大数据量渲染
- 导出图片质量高
- 中文文档完善

**Alternatives Considered**:
- Recharts: React 友好但图表类型有限
- Highcharts: 商业授权费用高
- D3.js: 灵活但开发成本高

### 5. PDF 导出

**Decision**: 后端使用 WeasyPrint 生成 PDF

**Rationale**:
- 支持 CSS 布局，还原度高
- 开源免费
- 支持分页和页眉页脚

**Alternatives Considered**:
- Puppeteer: 功能强大但资源消耗大
- wkhtmltopdf: 依赖 Qt，部署复杂
- 前端 jsPDF: 复杂布局支持差

### 6. 数据库设计

**Decision**: PostgreSQL + JSONB 存储报告配置

**Rationale**:
- 报告模块配置灵活多变，适合 JSONB
- PostgreSQL JSONB 支持索引查询
- 避免频繁的 schema 变更

## Risks / Trade-offs

### 风险 1: 拖拽性能

- **Risk**: 大量模块时拖拽可能卡顿
- **Mitigation**: 使用虚拟列表渲染，限制同时渲染的模块数

### 风险 2: PDF 导出样式还原

- **Risk**: 复杂图表导出 PDF 可能失真
- **Mitigation**: 图表导出为 SVG/PNG 后嵌入 PDF，预研多种方案

### 风险 3: 模块数据 API 延迟

- **Risk**: 数据源 API 响应慢影响体验
- **Mitigation**: 实现数据缓存层，支持渐进式加载

### 风险 4: 基金数据依赖

- **Risk**: 外部数据源不稳定
- **Mitigation**: 设计数据抽象层，支持多数据源切换

## Migration Plan

本项目为全新项目，无需迁移。

## Open Questions

1. **数据源选择**: Wind vs 同花顺 vs 自建爬虫，需要评估成本和数据质量
2. **部署平台**: Vercel vs 阿里云 vs AWS，需要确认合规要求和成本预算
3. **基金数据更新频率**: 日度/周度/实时，影响系统架构设计
4. **多租户需求**: 是否需要支持多机构独立部署
