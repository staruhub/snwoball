## Context

Snowball 基金分析报告系统需要端到端测试来验证核心用户工作流。现有 Playwright 测试覆盖基础页面检查，但缺乏：
- 真实认证流程验证
- 完整用户旅程测试
- 认证状态持久化验证
- 审计报告中提到的安全问题验证

**利益相关者**：QA 团队、开发团队、安全审计

**约束**：
- 依赖 `agent-browser` CLI 工具
- 需要后端 API 服务支持真实认证
- 测试凭据需安全管理

## Goals / Non-Goals

**Goals**:
- 使用 `agent-browser` 创建可复现的 E2E 测试脚本
- 验证管理员登录流程和 token 管理
- 验证报告创建→编辑→导出的完整工作流
- 生成测试截图、视频和报告
- 发现并记录硬编码 token 等安全问题的修复状态

**Non-Goals**:
- 实现用户注册功能（当前系统不存在）
- 替代现有 Playwright 测试（作为补充）
- 性能测试或负载测试
- 跨浏览器兼容性测试（仅使用 agent-browser 默认浏览器）

## Decisions

### Decision 1: 使用 Shell 脚本而非 TypeScript 测试

**选择**：使用 Bash shell 脚本调用 `agent-browser` CLI

**理由**：
- `agent-browser` 是 CLI 工具，shell 脚本是自然的集成方式
- 参考 `.agents/skills/agent-browser/templates/` 中的现有模板
- 便于在 CI/CD 环境中运行
- 不需要额外的测试框架依赖

**替代方案**：
- 将 `agent-browser` 调用集成到 Playwright 测试中 - 复杂度更高，收益不明显
- 使用 Node.js 脚本 - 增加依赖，无明显优势

### Decision 2: 认证状态使用 JSON 文件持久化

**选择**：使用 `agent-browser state save/load` 和 JSON 文件

**理由**：
- `agent-browser` 内置支持
- 便于调试和检查
- 可在测试间复用，避免重复登录

**存储位置**：`e2e-test-results/auth-state/admin-auth.json`

### Decision 3: 测试输出目录结构

```
e2e-test-results/
├── screenshots/
│   ├── 01-login-success.png
│   ├── 02-report-editor.png
│   ├── 03-report-saved.png
│   └── 04-export-dialog.png
├── reports/
│   └── summary.md
└── auth-state/
    └── admin-auth.json
```

**理由**：
- 清晰的分类便于查找
- 时间戳/序号前缀便于排序
- `.gitignore` 排除整个目录避免提交测试产物

### Decision 4: 测试凭据管理

**选择**：使用环境变量传递测试凭据

```bash
export ADMIN_USERNAME="test_admin"
export ADMIN_PASSWORD="test_password"
./e2e/flows/admin-login.sh
```

**理由**：
- 不在代码中硬编码敏感信息
- 便于在不同环境使用不同凭据
- CI/CD 环境可通过 secrets 注入

**替代方案**：
- 配置文件（`.env.test`）- 增加被提交的风险
- 命令行参数 - 可能在进程列表中暴露

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 后端服务不可用 | 认证测试失败 | 文档说明依赖项，CI 中确保服务启动 |
| agent-browser 版本兼容 | 命令语法变化 | 锁定版本，测试前检查 |
| 测试凭据泄露 | 安全风险 | 使用环境变量，不提交到仓库 |
| 页面结构变化 | refs 失效 | 使用语义定位器（role, text）优先 |

**Trade-offs**：
- Shell 脚本 vs TypeScript：牺牲类型安全换取简单性
- 单一浏览器 vs 多浏览器：牺牲覆盖范围换取执行速度

## Migration Plan

无迁移需求 - 这是新增功能。

**集成步骤**：
1. 创建测试目录和脚本
2. 添加 `.gitignore` 规则排除测试产物
3. 更新 README 说明用法
4. （可选）集成到 CI/CD 流程

**回滚**：
- 删除 `e2e/flows/` 目录和相关文件即可

## Open Questions

~~1. **测试环境的后端 API 如何配置？**~~ **已确认**：使用现有后端，连接 RDS 数据库
~~2. **是否需要重置数据库状态？**~~ **已确认**：是的，测试数据需要清理
~~3. **CI/CD 集成优先级？**~~ **已确认**：不紧急，本次不实现
~~4. **视频录制是否必须？**~~ **已确认**：不是必要功能，跳过实现
