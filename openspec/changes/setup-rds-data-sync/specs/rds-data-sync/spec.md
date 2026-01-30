## ADDED Requirements

### Requirement: RDS 数据探索
系统 SHALL 能够连接开发 RDS (MySQL) 并探索其数据结构，确定数据性质（聚源原始数据或应用数据）。

#### Scenario: 成功连接并查询表列表
- **WHEN** 使用正确的连接信息（host、port、user、password、database）
- **THEN** 系统成功建立连接并返回所有表名列表

#### Scenario: 识别聚源原始表
- **WHEN** 查询结果包含 QT_DailyQuote、secumain 等表
- **THEN** 系统判定 RDS 为聚源原始数据，需要复杂 ETL

#### Scenario: 识别应用表
- **WHEN** 查询结果包含 fund_nav、benchmark_nav、fund_profile 等表
- **THEN** 系统判定 RDS 为应用数据，可以简单同步

### Requirement: 配置文件修正
系统 SHALL 将 `application-dev.yaml` 中的 RDS 用户名从错误值 `wc` 更新为正确值 `user01`。

#### Scenario: 配置文件成功更新
- **WHEN** 修改 `db_user: wc` 为 `db_user: user01`
- **THEN** 应用能够使用正确的用户名连接 RDS

#### Scenario: 验证 RDS 连接
- **WHEN** 使用更新后的配置连接 RDS
- **THEN** 连接成功，无认证错误

### Requirement: 基金净值同步 Handler
系统 SHALL 实现 `sync_fund_nav_from_rds.py` handler，从 RDS 同步基金净值数据到本地 PostgreSQL。

#### Scenario: 从聚源原始表同步（场景 A）
- **WHEN** RDS 包含 QT_DailyQuote 和 secumain 表
- **THEN** handler 执行 JOIN 查询，映射字段（InnerCode → fund_id, TradingDay → nav_date），批量 upsert 到 fund_nav 表

#### Scenario: 从应用表同步（场景 B）
- **WHEN** RDS 已包含 fund_nav 表
- **THEN** handler 执行简单 SELECT，增量同步（基于 nav_date 范围），批量 upsert 到本地 fund_nav 表

#### Scenario: 处理重复数据
- **WHEN** 同步的数据与本地已存在数据的 (fund_id, nav_date) 冲突
- **THEN** 使用 ON CONFLICT (fund_id, nav_date) DO UPDATE 更新净值

#### Scenario: 批量处理大数据量
- **WHEN** 同步超过 10,000 条记录
- **THEN** 以 500 条为单位分批 upsert，避免单次操作超时

#### Scenario: 同步失败重试
- **WHEN** 网络连接或数据库操作失败
- **THEN** handler 返回失败状态，APScheduler 根据配置进行重试

### Requirement: 定时任务配置
系统 SHALL 在数据库中配置定时同步任务，包括 Job、Task 和关联关系。

#### Scenario: 创建每日净值同步 Job
- **WHEN** 插入 scheduled_job 记录
- **THEN** job_type='cron', cron_expression='30 18 * * 1-5', status=1（启用）

#### Scenario: 创建基金净值同步 Task
- **WHEN** 插入 task 记录
- **THEN** task_type='handler', handler='modules.scheduler.handlers.sync_fund_nav_from_rds:run', task_config 包含 RDS 连接信息和同步参数

#### Scenario: 关联 Job 和 Task
- **WHEN** 插入 job_task 记录
- **THEN** job_id 和 task_id 正确关联，execute_order=1，on_failure='stop'

### Requirement: 调度器启动与加载
系统 SHALL 在应用启动时自动启动 SchedulerManager 并加载所有启用的定时任务。

#### Scenario: 应用启动时启动调度器
- **WHEN** web_bootstrap.py 启动 FastAPI 应用
- **THEN** SchedulerManager.start() 被调用，APScheduler 进入运行状态

#### Scenario: 加载数据库中的任务
- **WHEN** 调度器启动完成
- **THEN** 从 scheduled_job 表读取所有 status=1 的任务，添加到 APScheduler

#### Scenario: 调度器健康检查
- **WHEN** 访问 /health 端点
- **THEN** 返回调度器运行状态（running/stopped）和已加载任务数量

### Requirement: 任务执行与日志
系统 SHALL 在任务执行时记录详细日志到 task_execution_log 表。

#### Scenario: 记录任务开始
- **WHEN** Job 开始执行
- **THEN** 插入 task_execution_log 记录，status=3（运行中），start_time=当前时间

#### Scenario: 记录任务成功
- **WHEN** Task 执行完成无错误
- **THEN** 更新 task_execution_log 记录，status=1（成功），end_time、duration_seconds、rows_processed

#### Scenario: 记录任务失败
- **WHEN** Task 执行过程中抛出异常
- **THEN** 更新 task_execution_log 记录，status=2（失败），error_message、stack_trace

#### Scenario: 任务统计更新
- **WHEN** Job 执行完成
- **THEN** 更新 scheduled_job 表的 run_count、success_count 或 fail_count

### Requirement: 数据质量验证
系统 SHALL 在同步完成后验证数据质量，确保数据完整性和准确性。

#### Scenario: 验证同步记录数
- **WHEN** 同步任务完成
- **THEN** 日志中记录源表查询到的行数和实际插入/更新的行数，两者应一致

#### Scenario: 验证日期范围
- **WHEN** 同步任务完成
- **THEN** 检查本地 fund_nav 表的 MAX(nav_date)，应为最新交易日

#### Scenario: 验证数据有效性
- **WHEN** 同步任务完成
- **THEN** 所有 unit_nav 和 accumulated_nav 值均大于 0，nav_date 为有效日期

### Requirement: 4 层同步架构
系统 SHALL 支持分层数据同步策略，根据数据变化频率配置不同的同步频率。

#### Scenario: Tier 1 - 日频净值同步
- **WHEN** 当前时间为工作日 18:30
- **THEN** 自动触发基金净值同步任务

#### Scenario: Tier 2 - 日频基准同步
- **WHEN** 当前时间为工作日 18:45
- **THEN** 自动触发基准净值同步任务（已有实现）

#### Scenario: Tier 3 - 周频档案同步（未来）
- **WHEN** 当前时间为周日 02:00
- **THEN** 自动触发基金档案全量同步任务（本次不实现）

#### Scenario: Tier 4 - 按需手动同步
- **WHEN** 管理员手动触发同步任务
- **THEN** 使用 date 类型 Job，execute_time 设置为立即执行
