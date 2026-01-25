## 1. 后端：用户报告 API 实现

- [ ] 1.1 创建 `apps/backend/modules/user_report/` 模块目录结构
- [ ] 1.2 创建数据模型 `UserReport` (SQLAlchemy)，包含 `id`, `name`, `user_id`, `fund_id`, `fund_name`, `template_id`, `status`, `content` (JSONB), `thumbnail_url`, `create_time`, `update_time`
- [ ] 1.3 创建数据库迁移脚本 (Alembic)
- [ ] 1.4 实现 `UserReportDAO` 数据访问层
- [ ] 1.5 实现 `UserReportService` 业务逻辑层
- [ ] 1.6 创建 Pydantic schemas：`CreateReportRequest`, `UpdateReportRequest`, `ReportResponse`, `ReportListResponse`
- [ ] 1.7 实现 Controller 端点：
  - `GET /api/v1/user-reports` (分页列表)
  - `GET /api/v1/user-reports/recent` (最近报告)
  - `GET /api/v1/user-reports/{id}` (获取详情)
  - `POST /api/v1/user-reports` (创建)
  - `PUT /api/v1/user-reports/{id}` (更新)
  - `POST /api/v1/user-reports/{id}/duplicate` (复制)
  - `DELETE /api/v1/user-reports/{id}` (删除)
  - `POST /api/v1/user-reports/from-template/{templateId}` (从模板创建)
- [ ] 1.8 在 `web_bootstrap.py` 中注册路由
- [ ] 1.9 编写 API 测试用例

## 2. 前端：FundSelector 真实数据集成

- [ ] 2.1 移除 `FundSelector.tsx` 中的 `SAMPLE_FUNDS` 硬编码数据
- [ ] 2.2 创建 `useFunds` React Query hook (`apps/frontend/hooks/useFunds.ts`)
- [ ] 2.3 在 `FundSelector` 中使用 `useFunds` hook
- [ ] 2.4 添加加载状态 UI (Skeleton/Spinner)
- [ ] 2.5 添加错误状态 UI 和重试按钮
- [ ] 2.6 实现搜索防抖（300ms 延迟调用 API）

## 3. 前端：报告 API 扩展

- [ ] 3.1 在 `apps/frontend/lib/api/reports.ts` 中添加 `updateReport` 函数
- [ ] 3.2 定义 `UpdateReportParams` 类型接口
- [ ] 3.3 定义 `ReportContent` 类型（模块配置、全局筛选、样式配置）

## 4. 前端：ReportEditor 保存功能集成

- [ ] 4.1 移除 `ReportEditor.tsx` 中的 `setTimeout` 模拟逻辑
- [ ] 4.2 修改 `handleSave` 函数调用真实 `updateReport` API
- [ ] 4.3 从 `useReportEditorStore` 收集完整报告数据
- [ ] 4.4 添加保存成功/失败的 Toast 提示
- [ ] 4.5 确保 `markSaved()` 在 API 成功后调用
- [ ] 4.6 添加保存中的 loading 状态

## 5. 前端：editor-content 创建报告集成

- [ ] 5.1 在 `editor-content.tsx` 的新建模式下调用 `createReport` API
- [ ] 5.2 创建成功后更新 URL 为 `/workspace/reports/{reportId}/edit`
- [ ] 5.3 添加创建失败的错误处理

## 6. 验证与测试

- [ ] 6.1 手动测试：创建新报告流程
- [ ] 6.2 手动测试：保存报告流程
- [ ] 6.3 手动测试：基金选择器数据加载
- [ ] 6.4 手动测试：自动保存功能
- [ ] 6.5 确认无残留的 Mock 数据或 `setTimeout` 模拟
