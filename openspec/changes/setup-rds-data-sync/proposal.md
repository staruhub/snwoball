## Why

当前系统中基金净值和基准数据完全静态（seed 脚本导入），无自动更新机制。虽然项目已实现完整的 APScheduler 调度系统和 ETL 执行器，但 scheduled_job 表为空，未配置任何定时任务。这导致数据过时、无法获取最新市场行情，严重影响报告生成的准确性和用户体验。

## What Changes

- 探索开发 RDS (rm-cn-fhh4gzo9900083vo) 的数据结构，确定数据性质（聚源原始数据 vs 应用数据）
- 修正 `application-dev.yaml` 中的 RDS 用户名配置错误（wc → user01）
- 基于 RDS 数据性质，设计并实现数据同步策略（简单同步或复杂 ETL）
- 创建基金净值同步 handler（参考 sync_benchmark_close_price_job.py）
- 配置定时 Job 和 Task 到数据库，启用 APScheduler 调度器
- 实现 4 层数据同步策略：高频实时（未来）、日频 T+1（18:30 cron）、周频档案（周日凌晨）、按需手动

## Capabilities

### New Capabilities
- `rds-data-sync`: 从开发 RDS 定时同步基金和基准数据到本地 PostgreSQL 的完整方案，包括数据源探索、同步策略设计、handler 实现、调度配置

### Modified Capabilities
<!-- 无现有 spec 需要修改 -->

## Impact

**后端**:
- `apps/backend/modules/web/profiles/application-dev.yaml` - 修正 RDS 用户名
- `apps/backend/modules/scheduler/handlers/` - 新增同步 handler
- `apps/backend/database/` - 插入 scheduled_job 和 task 配置
- `apps/backend/modules/scheduler/services/scheduler_manager.py` - 启动时加载任务

**数据库**:
- `scheduled_job` 表 - 插入定时任务配置
- `task` 表 - 插入同步任务定义
- `job_task` 表 - 关联 Job 和 Task

**依赖**:
- 依赖开发 RDS 的网络连接和访问权限
- 依赖 pymysql、sqlalchemy、pandas 等 Python 包（已安装）

**系统**:
- APScheduler 需要在应用启动时自动启动并加载任务
- 同步任务将在后台定期执行，不影响前端 API 响应
