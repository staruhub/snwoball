# Project Context

## Purpose

基金分析报告系统（Snowball）是一个面向专业基金经理和投资分析师的 SaaS 平台，旨在帮助用户高效生成和管理基金分析报告。

**核心目标**：
- 提供模块化、可拖拽的报告编辑器，覆盖收益统计、风险分析、业绩归因等专业分析模块
- 支持多种报告类型（周报/月报/季报/年报/专项报告）
- 提供灵活的模板系统，支持系统预设和用户自定义模板
- 导出为 PDF/Word/Excel 等格式，满足专业报告输出需求

## Tech Stack

### Frontend
- **框架**: React 19.x + Next.js 15.x (App Router)
- **语言**: TypeScript 5.x
- **状态管理**: Zustand / React Query (TanStack Query)
- **UI 组件**: 自定义组件 + Lucide React (图标)
- **图表库**: ECharts 5.x / Recharts (待集成)
- **样式方案**: Tailwind CSS 4.x
- **拖拽功能**: dnd-kit (待集成)
- **表格**: TanStack Table (待集成)

### Backend
- **框架**: Python 3.10+ / FastAPI 0.109+
- **ORM**: SQLAlchemy 2.x (异步支持)
- **数据库**: PostgreSQL 15+ / MySQL 8+
- **缓存**: Redis 7+
- **任务调度**: APScheduler 3.10+
- **数据验证**: Pydantic 2.5+
- **API 文档**: OpenAPI (Swagger)
- **服务器**: Uvicorn (ASGI)

### Infrastructure
- **Monorepo**: pnpm workspaces + Turborepo
- **容器化**: Docker + Docker Compose
- **部署**: 待定 (支持 Vercel/阿里云/AWS)
- **CI/CD**: GitHub Actions
- **可观测性**: OpenTelemetry (Tracing)

### 数据处理
- **量化计算**: NumPy, Pandas
- **报告生成**: WeasyPrint (PDF), python-docx (Word), openpyxl (Excel)

## Project Conventions

### Code Style

**Frontend (TypeScript/React)**:
- 组件命名使用 PascalCase: `ReportEditor.tsx`
- 工具函数/hooks 命名使用 camelCase: `useReportData.ts`
- 目录结构按功能模块划分，遵循 Next.js App Router 约定
- 使用绝对路径导入 (`@/components/...`)
- 优先使用函数式组件和 Hooks
- 客户端组件必须添加 `"use client"` 指令
- 使用 TypeScript interface 定义 Props
- 样式使用 Tailwind CSS + CSS 变量

**Backend (Python)**:
- 遵循 PEP 8 规范
- 使用 Black (line-length=120) + isort 进行代码格式化
- 使用 mypy 进行类型检查
- 函数/变量命名使用 snake_case
- 类命名使用 PascalCase
- API 路由使用 kebab-case: `/api/v1/fund-reports`
- 所有函数/类必须有类型注解
- 使用 docstring 记录接口说明

### Architecture Patterns

**Monorepo 项目结构**:
```
snowball/
├── apps/
│   ├── frontend/               # Next.js 前端应用
│   │   ├── app/               # App Router 页面
│   │   │   ├── globals.css    # 全局样式和 CSS 变量
│   │   │   ├── layout.tsx     # 根布局
│   │   │   └── page.tsx       # 首页
│   │   ├── components/
│   │   │   ├── ui/            # 基础 UI 组件
│   │   │   └── features/      # 业务功能组件
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── lib/               # 工具函数和配置
│   │   ├── stores/            # Zustand 状态管理
│   │   └── services/          # API 调用封装
│   │
│   └── backend/                # FastAPI 后端应用 (ratel-mind)
│       ├── config/            # 配置管理
│       │   ├── settings.py    # Pydantic Settings
│       │   └── factor.yaml    # 因子配置
│       ├── common/            # 共享工具
│       │   ├── database/      # BaseDAO 和数据库工具
│       │   ├── exceptions/    # 自定义异常
│       │   ├── middleware/    # FastAPI 中间件
│       │   ├── response/      # 标准响应格式
│       │   ├── logging/       # 日志装饰器
│       │   ├── schemas/       # 通用数据模型
│       │   ├── tracing/       # OpenTelemetry 集成
│       │   ├── utils/         # 辅助函数
│       │   └── wrappers/      # 函数包装器
│       ├── core/              # 核心业务逻辑
│       │   ├── analyzers/     # 分析算法
│       │   ├── calc/          # 计算模块
│       │   ├── domain/        # 领域模型
│       │   └── utils/         # 核心工具
│       ├── database/          # 数据库设置
│       │   └── migrations/    # Alembic 迁移
│       ├── modules/           # 功能模块
│       │   ├── admin/         # 管理后台
│       │   ├── auth/          # 认证授权
│       │   ├── fund/          # 基金管理
│       │   ├── user/          # 用户管理
│       │   ├── report/        # 报告生成
│       │   ├── analytics/     # 数据分析
│       │   ├── scheduler/     # 任务调度
│       │   └── web/           # Web 服务启动
│       └── pyproject.toml
│
├── packages/                   # 共享包 (待建)
│   ├── types/                 # 共享 TypeScript 类型定义
│   └── utils/                 # 共享工具函数
│
├── openspec/                  # OpenSpec 规范文档
├── config/                    # 项目配置
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**后端模块结构约定**:
```
modules/[module_name]/
├── __init__.py
├── [module_name]_bootstrap.py  # FastAPI 应用设置
├── controller/                  # API 端点/路由
├── schemas/                     # Pydantic 验证模型
├── services/                    # 业务逻辑
├── models/                      # SQLAlchemy 模型
└── dependencies/                # 依赖注入
```

**设计原则**:
- 前后端分离，通过 RESTful API 通信
- 后端采用分层架构：Controller → Service → DAO → Model
- 使用依赖注入管理服务实例
- 报告模块采用插件化设计，便于扩展新分析模块
- 使用装饰器实现横切关注点（日志、认证、追踪）

**标准响应格式**:
```python
# 成功响应
APIResponse(code=0, message="success", data={...})

# 错误响应
ErrorResponse(code=10001, message="error message", details={...})

# 分页响应
PaginationResponse(items=[...], total=100, page=1, page_size=20)
```

### CSS 变量主题

```css
/* 主题色 */
--primary: #0F5FFE;
--primary-foreground: #FFFFFF;
--secondary: #333333;
--background: #F5F5F5;
--foreground: #333333;
--card: #FFFFFF;
--muted: #F2F3F0;
--muted-foreground: #5B5F66;
--border: #E1E2E5;
--destructive: #A62911;

/* 语义色 */
--color-success-foreground: #1A3300;
--color-warning-foreground: #663300;
--color-error-foreground: #66005E;
--color-info-foreground: #001133;
```

### Testing Strategy

**Frontend**:
- 单元测试: Vitest + React Testing Library
- E2E 测试: Playwright
- 覆盖率目标: 核心业务逻辑 > 80%

**Backend**:
- 单元测试: pytest + pytest-asyncio
- API 测试: pytest + httpx
- 覆盖率目标: > 80%

**测试命名约定**:
- 测试文件: `*.test.ts` / `test_*.py`
- 测试用例描述清晰的业务场景

### Git Workflow

**分支策略** (Git Flow 简化版):
- `main`: 生产环境分支
- `develop`: 开发集成分支
- `feature/*`: 功能开发分支
- `fix/*`: 问题修复分支
- `release/*`: 发布准备分支

**Commit 规范** (Conventional Commits):
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

示例:
- `feat(report-editor): add drag-and-drop module support`
- `fix(auth): resolve SSO login redirect issue`

### 开发命令

```bash
# 启动所有服务
pnpm dev

# 仅启动前端
pnpm dev:frontend

# 仅启动后端
pnpm dev:backend

# 构建前端
pnpm build

# Docker 服务
pnpm docker:up    # 启动 PostgreSQL + Redis
pnpm docker:down  # 停止容器
pnpm docker:logs  # 查看日志
```

## Domain Context

### 基金类型
- 股票型基金、混合型基金、债券型基金、指数基金、QDII、货币基金、FOF

### 核心分析指标
- **收益指标**: 区间收益、年化收益、超额收益、滚动收益
- **风险指标**: 波动率、最大回撤、VaR、Beta、夏普比率、索提诺比率
- **归因分析**: Brinson 归因、风格归因、行业归因

### 报告类型
- 周报/月报/季报/年报（定期报告）
- 专项报告（风险分析、收益归因、持仓分析等）

### 净值类型
- 单位净值、累计净值、复权净值

### 业绩基准
- 主流指数：沪深300、中证500、中证800、创业板指
- 行业指数、自定义基准

## Important Constraints

### 技术约束
- 前端需支持主流浏览器（Chrome, Firefox, Safari, Edge 最新两个版本）
- 报告导出需支持 A4 纵向/横向格式
- 图表需支持高分辨率导出（用于印刷）
- 避免文件超过 200-300 行代码，及时重构
- 优先复用现有代码，避免重复

### 业务约束
- 基金数据需遵守中国证监会相关法规
- 用户数据需符合个人信息保护法要求
- 敏感数据需加密存储

### 性能要求
- 页面首屏加载 < 3s
- 图表渲染 < 1s
- PDF 导出（10页报告）< 30s

### 安全要求
- JWT 认证，支持 Token 黑名单
- 密码使用 bcrypt 哈希存储
- 支持管理员和普通用户两种角色
- 中间件层统一处理认证授权

## External Dependencies

### 数据源（待对接）
- Wind 金融终端 API
- 同花顺 iFinD
- 天天基金数据接口
- 或自建数据爬取服务

### 第三方服务
- 用户认证: 企业 SSO (SAML/OIDC)
- 邮件服务: SendGrid / 阿里云邮件
- 文件存储: 阿里云 OSS / AWS S3
- 日志监控: Sentry / 阿里云日志服务

## Environment Configuration

### 配置层级 (Backend)
```python
DatabaseSettings      # 数据库连接、连接池
RedisSettings         # Redis 缓存配置
SecuritySettings      # JWT 密钥、Token 过期时间
APISettings          # CORS、API 元数据
TracingSettings      # OpenTelemetry 配置
```

### 环境区分
- `local`: 本地开发
- `dev`: 开发环境
- `test`: 测试环境
- `prod`: 生产环境

### 敏感配置
- 通过 `.env` 文件管理
- 禁止提交到版本控制
- 使用 `env.example` 作为模板
