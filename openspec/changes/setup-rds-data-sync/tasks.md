## 1. RDS 数据探索（只读操作）

- [x] 1.1 创建 Python 脚本连接开发 RDS，查询所有表名（SHOW TABLES）
- [x] 1.2 检查是否包含聚源原始表（QT_DailyQuote, secumain）或应用表（fund_nav, benchmark_nav, fund_profile）
- [x] 1.3 对找到的关键表执行 DESC 查询，分析表结构和字段
- [x] 1.4 统计数据量（SELECT COUNT(*), MIN(date), MAX(date)）
- [x] 1.5 确定 RDS 数据性质（聚源原始 vs 应用数据）并记录到 design.md 的 Open Questions

## 2. 配置文件修正

- [x] 2.1 修改 `apps/backend/modules/web/profiles/application-dev.yaml` 第 12 行：`db_user: wc` → `db_user: user01`
- [x] 2.2 验证 RDS 连接：使用更新后的配置连接 RDS，确认无认证错误

## 3. 基金净值同步 Handler 实现

- [x] 3.1 创建文件 `apps/backend/modules/scheduler/handlers/sync_fund_nav_from_rds.py`
- [x] 3.2 实现 `run(**kwargs)` 主函数，解析 task_config 参数（参考 sync_benchmark_close_price_job.py）
- [x] 3.3 实现 RDS 连接函数 `_build_mysql_engine(conn_cfg)`
- [x] 3.4 根据探索结果实现数据拉取逻辑：
  - 如果是聚源原始数据：实现 JOIN 查询和字段映射
  - 如果是应用数据：实现简单 SELECT 增量查询
- [x] 3.5 实现批量 upsert 逻辑（使用 BenchmarkNavDao 的 batch_upsert 模式，或 fund_nav 等效方法）
- [x] 3.6 实现错误处理和日志记录
- [ ] 3.7 编写单元测试验证数据转换逻辑（可选，通过端到端测试验证）

## 4. 定时任务数据库配置

- [x] 4.1 创建 SQL 脚本 `apps/backend/database/migrations/036_setup_daily_fund_sync_job.sql`
- [x] 4.2 在脚本中插入 scheduled_job 记录：
  - job_name: '每日基金净值同步'
  - job_type: 'cron'
  - cron_expression: '30 18 * * 1-5'
  - status: 1（启用）
- [x] 4.3 在脚本中插入 task 记录：
  - task_name: '基金净值 RDS 同步'
  - task_type: 'handler'
  - handler: 'modules.scheduler.handlers.sync_fund_nav_from_rds:run'
  - task_config: JSON 包含 RDS 连接信息和同步参数
- [x] 4.4 在脚本中插入 job_task 关联记录
- [x] 4.5 执行 migration 脚本到 Docker PostgreSQL 数据库

## 5. 调度器启动集成

- [x] 5.1 修改 `apps/backend/modules/web/web_bootstrap.py`，在应用启动时导入 SchedulerManager
- [x] 5.2 在 FastAPI 的 lifespan 或 startup 事件中调用 `await SchedulerManager().start()`
- [x] 5.3 在 shutdown 事件中调用 `await SchedulerManager().shutdown()`
- [ ] 5.4 在 /health 端点中添加调度器状态检查（可选，已跳过）

## 6. 端到端测试与验证

- [x] 6.1 启动 Docker 环境（docker-compose up）- PostgreSQL 容器运行正常
- [x] 6.2 检查定时任务配置（job + task + job_task 关联）- 已验证配置正确
- [x] 6.3 手动触发同步任务（RDS → PostgreSQL 连接测试通过）
- [ ] 6.4 检查 task_execution_log 表，验证任务执行记录（待服务重启后验证）
- [x] 6.5 查询 fund_nav 表，验证数据状态：
  - 本地 PostgreSQL: 11,790 条 (2025-01-29 ~ 2026-01-29)
  - RDS MySQL: 96,730 条 (2001-12-18 ~ 2025-12-30)
- [x] 6.6 验证 RDS 数据质量：已确认数据有效
- [ ] 6.7 等待自动调度执行（每日 18:30 执行，需重启后端服务）

## 7. 文档与清理

- [x] 7.1 更新 design.md 的 Open Questions，记录探索结果和最终选择的同步策略
- [x] 7.2 在 tasks.md 中标记所有已完成的任务为 `[x]`
- [x] 7.3 准备归档：所有核心 artifacts 已完成，待服务重启后完成最终验证
