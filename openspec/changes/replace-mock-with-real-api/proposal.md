## Why

报告编辑器系统中存在多处 Mock 数据和模拟操作，违反了项目规范"Mocking data is only needed for tests, never mock data for dev or prod"。这导致：
1. 报告保存功能无法真正持久化数据
2. 基金选择器显示的是硬编码数据而非真实基金列表
3. 用户体验不完整，无法在生产环境正常使用

## What Changes

### 前端改动

1. **FundSelector 组件** (`apps/frontend/components/features/report-editor/filters/FundSelector.tsx`)
   - 移除 `SAMPLE_FUNDS` 硬编码数据
   - 使用 React Query 调用 `getPublicFunds` API 获取真实基金列表
   - 添加加载状态和错误处理

2. **报告保存功能** (`apps/frontend/components/features/report-editor/ReportEditor.tsx`)
   - 移除 `setTimeout` 模拟保存逻辑
   - 实现真实的 `PUT /api/v1/user-reports/{reportId}` API 调用
   - 正确更新 `lastSavedAt` 和 `isDirty` 状态
   - 添加保存失败的错误提示

3. **报告 API 扩展** (`apps/frontend/lib/api/reports.ts`)
   - 添加 `updateReport` 函数支持报告内容更新
   - 定义 `UpdateReportParams` 类型（包含模块配置、全局参数等）

### 后端改动

4. **用户报告 API** (新建模块 `apps/backend/modules/user_report/`)
   - 创建用户报告数据模型 `UserReport`
   - 实现以下 API 端点：
     - `GET /api/v1/user-reports` - 获取报告列表
     - `GET /api/v1/user-reports/recent` - 获取最近报告
     - `GET /api/v1/user-reports/{id}` - 获取单个报告
     - `POST /api/v1/user-reports` - 创建新报告
     - `PUT /api/v1/user-reports/{id}` - **更新报告** (关键新增)
     - `POST /api/v1/user-reports/{id}/duplicate` - 复制报告
     - `DELETE /api/v1/user-reports/{id}` - 删除报告
     - `POST /api/v1/user-reports/from-template/{templateId}` - 从模板创建

## Impact

- **Affected specs**: `specs/report-editor/spec.md` (Report Auto-Save, Manual Save 相关要求)
- **Affected code**:
  - `apps/frontend/components/features/report-editor/filters/FundSelector.tsx`
  - `apps/frontend/components/features/report-editor/ReportEditor.tsx`
  - `apps/frontend/lib/api/reports.ts`
  - `apps/backend/modules/` (新增 user_report 模块)
  - `apps/backend/modules/web/web_bootstrap.py` (注册新路由)
