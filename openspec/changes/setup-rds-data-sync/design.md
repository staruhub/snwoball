## Context

### 当前状态
- **调度系统**: 已实现 APScheduler + DBSyncExecutor + SchedulerManager，但 scheduled_job 表为空
- **数据导入**: 历史上使用手动文件上传 + SmartNavImportService + Migration 脚本
- **现有数据**: 11,790 条基金净值 + 2,882 条基准净值，均为静态 seed 数据（2025-01-29 ~ 2026-01-29）
- **环境**: 用户使用 Docker + PostgreSQL 本地开发，但配置文件中也有 RDS (MySQL) 连接信息

### 数据源情况
- **开发 RDS**: rm-cn-fhh4gzo9900083vo.rwlb.rds.aliyuncs.com:3306 (MySQL)
- **数据性质**: 未知，需要探索（可能是聚源原始数据或已清洗的应用数据）
- **配置错误**: application-dev.yaml 中 db_user=wc，正确应为 user01

### 已有参考实现
- `sync_benchmark_close_price_job.py`: 从聚源 jydb (106.14.89.44:3318) 同步基准收盘价
  - 使用 pymysql + pandas
  - 支持批量查询和 upsert
  - 日期范围过滤

## Goals / Non-Goals

**Goals:**
- 探索开发 RDS 数据结构，确定数据性质和同步策略
- 修正配置文件中的 RDS 连接错误
- 实现基金净值定时同步（优先级最高）
- 配置并启动 APScheduler 调度器
- 设计 4 层数据同步架构（日频、周频、按需、未来实时）

**Non-Goals:**
- 实时行情推送（WebSocket）- 未来功能，本次不实现
- 生产 RDS 同步 - 仅关注开发环境
- 前端 Redis 缓存层 - 属于性能优化范畴，不在本次范围
- 数据监控告警 - 属于运维范畴，后续迭代

## Decisions

### 决策 1: 探索优先，确定数据流

**选择**: 先连接 RDS 探索表结构，再决定同步策略

**理由**:
- RDS 数据性质未知（聚源原始表 vs 应用表）
- 不同性质需要不同的 ETL 逻辑
- 避免盲目编码导致返工

**备选方案（放弃）**:
- 直接假设是聚源原始数据 - 风险高，可能需要重写
- 跳过 RDS，直接从聚源 jydb 拉取 - 不符合用户提供的 RDS 信息

### 决策 2: 参考 sync_benchmark_close_price_job 模式

**选择**: 创建独立的 handler 函数 `sync_fund_nav_from_rds.py`

**理由**:
- 已有成功案例（sync_benchmark_close_price_job）
- 代码结构清晰：同步 MySQL → PostgreSQL，支持批量 upsert
- 易于测试和维护

**备选方案（放弃）**:
- 使用 db_sync_executor 的 simple_sync 模式 - 灵活性不足，难以处理复杂逻辑
- 扩展 SmartNavImportService - 不适合定时任务场景

### 决策 3: 数据流路径

**假设场景 A: RDS 是聚源原始数据**
```
RDS (jydb 镜像)           →           PostgreSQL
  QT_DailyQuote                         fund_nav
  secumain                              benchmark_nav
  (复杂 ETL: JOIN + 字段映射)
```

**假设场景 B: RDS 是应用数据**
```
RDS (应用表)              →           PostgreSQL
  fund_nav                              fund_nav
  benchmark_nav                         benchmark_nav
  (简单同步: 增量 upsert)
```

**实施策略**: 探索后根据实际情况选择

### 决策 4: 定时策略

**选择**: 分层同步策略

| 层级 | 数据类型 | 频率 | Cron 表达式 | 优先级 |
|------|---------|------|------------|--------|
| Tier 1 | 基金日净值 | 每日 18:30 | `30 18 * * 1-5` | P0 |
| Tier 2 | 基准净值 | 每日 18:45 | `45 18 * * 1-5` | P1 |
| Tier 3 | 基金档案 | 每周日 02:00 | `0 2 * * 0` | P2 |
| Tier 4 | 历史回溯 | 手动触发 | - | P3 |

**理由**:
- 18:30 是交易日结束后数据更新的合理时间
- 分离净值和档案同步，避免单次任务过长
- 周频档案同步满足变化频率需求

### 决策 5: Upsert 策略

**选择**: ON CONFLICT (fund_id, nav_date) DO UPDATE

**理由**:
- PostgreSQL 原生支持
- 幂等性：重复执行不会造成数据重复
- 性能优于 DELETE + INSERT

## Risks / Trade-offs

### 风险 1: RDS 网络连接不稳定
**缓解**:
- 实现重试机制（sync_benchmark_close_price_job 已有）
- 记录详细日志到 task_execution_log
- 失败后发送告警（未来）

### 风险 2: RDS 表结构与本地不兼容
**缓解**:
- 探索阶段仔细核对表结构
- 实现字段映射配置（task_config JSON）
- 单元测试验证数据转换逻辑

### 风险 3: 调度器启动失败
**缓解**:
- 在 web_bootstrap.py 中添加 scheduler 启动逻辑
- 健康检查端点监控调度器状态
- 日志记录启动过程

### Trade-off 1: 复杂度 vs 灵活性
- **选择**: 独立 handler 函数 > 通用 executor
- **代价**: 代码重复度略高
- **收益**: 每个同步任务可独立优化

### Trade-off 2: 实时性 vs 系统负载
- **选择**: T+1 日频同步 > 实时推送
- **代价**: 数据有 1 天延迟
- **收益**: 系统负载低，稳定性高

## Migration Plan

### 阶段 1: 探索（只读操作）
1. 连接开发 RDS，查询表列表
2. 检查是否包含 fund_nav、benchmark_nav 或聚源原始表
3. 分析表结构和数据量
4. 确定同步策略

### 阶段 2: 配置修正
1. 修改 `application-dev.yaml` 的 db_user
2. 验证 RDS 连接

### 阶段 3: Handler 实现
1. 创建 `sync_fund_nav_from_rds.py`
2. 实现数据拉取逻辑（基于探索结果）
3. 实现 upsert 逻辑（参考 sync_benchmark_close_price_job）
4. 单元测试

### 阶段 4: 调度配置
1. 插入 scheduled_job 记录（cron: 30 18 * * 1-5）
2. 插入 task 记录（handler 路径 + config）
3. 插入 job_task 关联记录
4. 修改 web_bootstrap.py 启动 SchedulerManager

### 阶段 5: 验证与监控
1. 手动触发同步任务，验证数据正确性
2. 检查 task_execution_log 表
3. 等待自动调度执行

### Rollback 策略
- **配置回滚**: 恢复 application-dev.yaml
- **任务禁用**: UPDATE scheduled_job SET status=2 WHERE id=...
- **数据回滚**: 保留旧数据，新数据带时间戳可删除

## Open Questions

1. ✅ **RDS 数据性质** - 已确定为应用数据表
   - **探索结果** (2026-01-29): RDS 包含 64 个表，其中包括：
     - fund_nav (96,730 条, 2001-12-18 ~ 2025-12-30)
     - benchmark_nav (11,729 条, 2002-01-04 ~ 2026-01-28)
     - fund_profile (154 条)
     - benchmark_profile (3 条)
   - **结论**: 使用简单同步策略（直接 SELECT + UPSERT），无需复杂 ETL
   - **数据流**: RDS (MySQL 应用数据) → Docker PostgreSQL (本地应用数据库)

2. ✅ **调度器启动时机** - 在 web_bootstrap.py 启动时自动加载
3. ❓ **失败告警机制** - 暂时依赖日志，未来考虑邮件/钉钉
4. ❓ **数据监控** - 如何监控最新数据时间？是否需要健康检查端点？
