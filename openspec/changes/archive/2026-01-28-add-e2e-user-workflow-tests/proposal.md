## Why

当前 Snowball 基金分析报告系统存在以下测试覆盖缺口：

1. **认证流程未经端到端验证**：审计报告指出所有管理页面使用硬编码空 token (`const token = "";`)，现有 E2E 测试未验证实际认证流程
2. **报告管理工作流缺乏完整测试**：虽然有基础的编辑器测试，但缺少创建→编辑→导出的完整用户流程验证
3. **缺少认证状态持久化测试**：未验证 token 存储、会话恢复等关键功能
4. **测试输出不够完善**：缺少截图归档、视频录制和测试报告生成

需要使用 `agent-browser` skill 创建自动化端到端测试，验证核心用户工作流并发现潜在的认证问题。

## What Changes

- **NEW** 创建 `e2e-testing` capability spec，定义端到端测试的标准和要求
- **NEW** 实现基于 `agent-browser` 的自动化 E2E 测试脚本，覆盖：
  - 管理员登录流程（替代原请求中的用户注册，因系统暂无注册功能）
  - 认证状态验证和持久化
  - 报告管理完整工作流（创建→编辑→预览→导出）
- **NEW** 配置测试输出目录结构和报告生成
- **NEW** 验证硬编码 token 问题是否已修复

**注意**：原请求中的"用户注册流程"在当前代码库中不存在（`apps/frontend/app/**/register/` 和 `apps/frontend/app/**/signup/` 均为空）。本提案调整为测试现有的管理员登录流程，并记录注册功能缺失作为发现。

## Impact

- **Affected specs**:
  - 新建 `specs/e2e-testing/spec.md`
  - 关联 `specs/user-auth/spec.md`（验证现有认证需求）
  - 关联 `specs/report-editor/spec.md`（验证编辑器功能）

- **Affected code**:
  - `apps/frontend/e2e/` - 添加新的测试脚本
  - `e2e-test-results/` - 新建测试输出目录
  - `.agents/skills/agent-browser/` - 参考现有模板

- **Dependencies**:
  - 需要 `agent-browser` CLI 工具可用
  - 需要前端开发服务器运行在 `localhost:3000`
  - 后端 API 服务需要运行以验证真实认证流程
