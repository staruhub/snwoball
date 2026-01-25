## Context

基金分析报告系统是一个 B2B SaaS 产品，目标用户为基金经理和投资分析师。系统核心是一个模块化的报告编辑器，支持拖拽组合各类分析模块，并导出为专业的 PDF 报告。

### 利益相关者
- **最终用户**：基金经理、投资分析师
- **系统管理员**：运维人员、产品管理员
- **开发团队**：前端、后端、数据工程师

### 约束条件
- 浏览器支持：Chrome, Firefox, Safari, Edge 最新两个版本
- 性能要求：首屏加载 < 3s，图表渲染 < 1s，PDF导出（10页）< 30s
- 安全要求：JWT 认证，密码 bcrypt 哈希，敏感数据加密
- 合规要求：符合中国证监会相关法规，个人信息保护法

## Goals / Non-Goals

### Goals
- 提供模块化、可拖拽的报告编辑器
- 支持多种分析模块（收益、风险、归因等）
- 实现灵活的模板系统
- 导出高质量 PDF 报告
- 支持全局参数与模块参数联动

### Non-Goals
- 实时协作编辑（V2.0）
- 移动端原生应用（V2.0+）
- AI 智能推荐模块（未来版本）
- 复杂的工作流审批

## Decisions

### 1. 前端架构

**决定**：采用 Next.js 15 App Router + React 19 + Tailwind CSS 4

**理由**：
- App Router 提供更好的服务端渲染和流式加载
- React 19 支持并发特性，适合复杂编辑器场景
- Tailwind CSS 4 提供更好的 CSS 变量支持

**替代方案考虑**：
- Vue 3 + Nuxt：团队 React 经验更丰富
- CRA：不支持服务端渲染

### 2. 状态管理

**决定**：Zustand + React Query (TanStack Query)

**理由**：
- Zustand 轻量，适合编辑器复杂状态
- React Query 处理服务端状态和缓存
- 分离 UI 状态和服务端状态

### 3. 拖拽实现

**决定**：使用 dnd-kit

**理由**：
- 高度可定制
- 良好的无障碍支持
- 活跃维护

### 4. 图表库

**决定**：ECharts 5.x

**理由**：
- 丰富的金融图表类型
- 良好的中文支持
- 支持大数据量渲染
- 支持 Canvas/SVG 双引擎

### 5. 后端架构

**决定**：FastAPI + SQLAlchemy 2.x (异步)

**理由**：
- 高性能异步支持
- 自动 OpenAPI 文档
- 类型安全的 Pydantic 验证

### 6. 模块插件化架构

**决定**：采用模块注册表 + 配置驱动

**设计**：
```typescript
// 模块注册表
interface ModuleDefinition {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<ModuleProps>;
  configSchema: JSONSchema;
  defaultConfig: Record<string, unknown>;
}

// 模块实例
interface ModuleInstance {
  id: string;
  moduleId: string;
  config: Record<string, unknown>;
  locked: string[]; // 锁定的参数 keys
}
```

### 7. 全局参数与模块参数联动

**决定**：采用锁定机制

- 每个模块参数默认跟随全局参数
- 用户可锁定特定参数，使其独立于全局
- 解锁后自动同步回全局值

### 8. PDF 生成

**决定**：后端使用 WeasyPrint

**理由**：
- 支持 CSS 打印样式
- 良好的中文字体支持
- 开源免费

## Risks / Trade-offs

### 风险 1：编辑器性能
- **风险**：大量模块时可能卡顿
- **缓解**：虚拟滚动、懒加载、React.memo 优化

### 风险 2：PDF 导出质量
- **风险**：复杂图表导出可能失真
- **缓解**：图表转为高分辨率图片再嵌入 PDF

### 风险 3：数据源依赖
- **风险**：外部数据源不稳定
- **缓解**：本地缓存、降级策略、重试机制

### 风险 4：模块扩展性
- **风险**：新模块开发成本高
- **缓解**：标准化模块接口、提供模块开发工具包

## Migration Plan

不适用 - 这是全新系统，无需迁移。

## Open Questions

1. **数据源对接**：具体使用 Wind/同花顺/自建爬虫？需进一步确认
2. **用户量级**：预计初期用户数量？影响技术选型
3. **部署环境**：阿里云/AWS/私有化部署？

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Next.js App Router                    ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐││
│  │  │   Auth   │  │Workspace │  │  Editor  │  │ Settings │││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘││
│  │                                                          ││
│  │  ┌──────────────────────────────────────────────────────┐││
│  │  │                  Shared Components                    │││
│  │  │  UI Kit │ Charts │ Tables │ Forms │ Dialogs          │││
│  │  └──────────────────────────────────────────────────────┘││
│  │                                                          ││
│  │  ┌──────────────────────────────────────────────────────┐││
│  │  │           State Management (Zustand + RQ)            │││
│  │  └──────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    FastAPI Application                   ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐││
│  │  │   Auth   │  │  Report  │  │ Template │  │  Export  │││
│  │  │  Module  │  │  Module  │  │  Module  │  │  Module  │││
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘││
│  │                                                          ││
│  │  ┌──────────────────────────────────────────────────────┐││
│  │  │              Core Analytics Engine                    │││
│  │  │  Return │ Risk │ Attribution │ Factor │ Benchmark    │││
│  │  └──────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │    Redis     │  │ File Storage │       │
│  │   Database   │  │    Cache     │  │  (OSS/S3)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema (Core)

```sql
-- 用户表
users (id, username, email, phone, password_hash, avatar_url, organization, role, created_at)

-- 报告表
reports (id, user_id, name, type, status, fund_id, global_config, created_at, updated_at)

-- 报告模块表
report_modules (id, report_id, module_type, order, config, locked_params, width, height)

-- 模板表
templates (id, user_id, name, description, category, type, cover_url, module_config, usage_count)

-- 用户偏好
user_preferences (id, user_id, default_benchmark, default_date_range, default_nav_type, theme)

-- 用户关注基金
user_fund_follows (id, user_id, fund_id, created_at)
```
