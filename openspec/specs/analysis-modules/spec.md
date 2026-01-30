## ADDED Requirements

### Requirement: Product Information Modules

The system SHALL provide product information modules for fund details.

#### Scenario: Product header module

- **WHEN** user adds "产品表头" module
- **THEN** module displays fund name, code, and key summary info

#### Scenario: Basic information module

- **WHEN** user adds "基本信息" module
- **THEN** module displays fund basic details (inception date, fund type, custodian, etc.)

#### Scenario: Fund manager module

- **WHEN** user adds "基金经理" module
- **THEN** module displays manager info (name, tenure, experience, other funds managed)

#### Scenario: Product elements module

- **WHEN** user adds "产品要素" module
- **THEN** module displays investment scope, strategy description, risk level

#### Scenario: Fee information module

- **WHEN** user adds "费率信息" module
- **THEN** module displays management fee, custody fee, subscription/redemption fees

#### Scenario: Historical AUM module

- **WHEN** user adds "历史规模" module
- **THEN** module displays historical AUM chart over time

### Requirement: Return Statistics Modules

The system SHALL provide return analysis modules.

#### Scenario: Historical profit probability

- **WHEN** user adds "历史盈利概率" module
- **THEN** module displays probability of positive returns across different holding periods

#### Scenario: Rolling Sharpe ratio

- **WHEN** user adds "滚动夏普比率" module
- **THEN** module displays rolling Sharpe ratio chart over time

#### Scenario: Annual returns

- **WHEN** user adds "年度收益" module
- **THEN** module displays annual return table/chart for each calendar year

#### Scenario: Monthly returns

- **WHEN** user adds "月度收益" module
- **THEN** module displays monthly return heatmap or table

#### Scenario: Quarterly returns

- **WHEN** user adds "季度收益" module
- **THEN** module displays quarterly return table/chart

#### Scenario: Rolling returns

- **WHEN** user adds "滚动收益" module
- **THEN** module displays rolling period returns (1M/3M/6M/1Y/3Y rolling)

#### Scenario: Period returns

- **WHEN** user adds "区间收益" module
- **THEN** module displays returns for selected date range

#### Scenario: Rolling return distribution

- **WHEN** user adds "滚动收益率分布" module
- **THEN** module displays distribution histogram of rolling returns

#### Scenario: NAV trend chart

- **WHEN** user adds "净值走势图" module
- **THEN** module displays NAV line chart over time with benchmark comparison

#### Scenario: Cumulative return trend

- **WHEN** user adds "累计收益走势" module
- **THEN** module displays cumulative return line chart

#### Scenario: Excess return trend

- **WHEN** user adds "超额收益走势" module
- **THEN** module displays excess return vs benchmark chart
- **AND** user can switch between arithmetic and geometric excess return

### Requirement: Risk Statistics Modules

The system SHALL provide risk analysis modules.

#### Scenario: Rolling Beta

- **WHEN** user adds "滚动Beta" module
- **THEN** module displays rolling beta coefficient chart vs benchmark

#### Scenario: VaR distribution

- **WHEN** user adds "VaR分布" module
- **THEN** module displays Value at Risk distribution analysis

#### Scenario: Rolling volatility

- **WHEN** user adds "滚动波动率" module
- **THEN** module displays rolling volatility (standard deviation) chart

#### Scenario: Dynamic drawdown

- **WHEN** user adds "动态回撤" module
- **THEN** module displays underwater curve showing drawdown over time

#### Scenario: Rolling correlation

- **WHEN** user adds "滚动相关系数" module
- **THEN** module displays rolling correlation with benchmark

#### Scenario: Maximum drawdown

- **WHEN** user adds "最大回撤" module
- **THEN** module displays maximum drawdown value and period

#### Scenario: Dynamic drawdown table

- **WHEN** user adds "动态回撤表" module
- **THEN** module displays table of significant drawdown events

#### Scenario: Risk-adjusted returns

- **WHEN** user adds "风险调整收益" module
- **THEN** module displays Sharpe ratio, Sortino ratio, Calmar ratio

#### Scenario: Downside risk analysis

- **WHEN** user adds "下行风险分析" module
- **THEN** module displays downside deviation and related metrics

### Requirement: Performance Analysis Modules

The system SHALL provide performance analysis modules.

#### Scenario: Performance overview

- **WHEN** user adds "业绩概览表" module
- **THEN** module displays comprehensive performance summary table

#### Scenario: Peer ranking

- **WHEN** user adds "同类排名" module
- **THEN** module displays fund ranking within peer group over various periods

#### Scenario: Performance persistence

- **WHEN** user adds "业绩持续性" module
- **THEN** module displays analysis of return consistency across periods

#### Scenario: Bull/bear market performance

- **WHEN** user adds "牛熊市表现" module
- **THEN** module displays performance during bull and bear market periods

#### Scenario: Annual performance comparison

- **WHEN** user adds "分年度业绩对比" module
- **THEN** module displays year-over-year performance comparison with benchmark

### Requirement: Portfolio Analysis Modules

The system SHALL provide portfolio analysis modules.

#### Scenario: Asset allocation

- **WHEN** user adds "资产配置" module
- **THEN** module displays pie/bar chart of asset class allocation (stocks, bonds, cash)

#### Scenario: Sector allocation

- **WHEN** user adds "行业配置" module
- **THEN** module displays sector/industry allocation breakdown

#### Scenario: Top holdings

- **WHEN** user adds "重仓股票" module
- **THEN** module displays top 10 stock holdings with weights

#### Scenario: Concentration analysis

- **WHEN** user adds "持仓集中度" module
- **THEN** module displays concentration metrics (top 5/10 holdings percentage)

#### Scenario: Holding changes

- **WHEN** user adds "持仓变动" module
- **THEN** module displays changes in top holdings between periods

#### Scenario: Turnover analysis

- **WHEN** user adds "换手率分析" module
- **THEN** module displays portfolio turnover rate over time

### Requirement: Attribution Modules

The system SHALL provide return attribution modules.

#### Scenario: Brinson attribution

- **WHEN** user adds "Brinson归因" module
- **THEN** module displays allocation, selection, and interaction effects

#### Scenario: Style attribution

- **WHEN** user adds "风格归因" module
- **THEN** module displays return attribution to style factors

#### Scenario: Sector attribution

- **WHEN** user adds "行业归因" module
- **THEN** module displays return attribution by sector

#### Scenario: Stock attribution

- **WHEN** user adds "个股归因" module
- **THEN** module displays return contribution from individual stocks

#### Scenario: Trading attribution

- **WHEN** user adds "交易归因" module
- **THEN** module displays impact of trading activity on returns

### Requirement: Equity Strategy Modules

The system SHALL provide equity strategy analysis modules for stock funds.

#### Scenario: Style box

- **WHEN** user adds "风格箱" module
- **THEN** module displays 3x3 style grid (大/中/小盘 × 价值/平衡/成长)

#### Scenario: Style drift

- **WHEN** user adds "风格漂移" module
- **THEN** module displays style movement over time

#### Scenario: Style stability

- **WHEN** user adds "风格稳定性" module
- **THEN** module displays consistency of style exposure

#### Scenario: Factor exposure

- **WHEN** user adds "因子暴露" module
- **THEN** module displays exposure to factors: 规模, 价值, 动量, 波动率, 流动性

#### Scenario: Stock selection alpha

- **WHEN** user adds "选股Alpha" module
- **THEN** module displays alpha generated from stock selection

#### Scenario: Market timing

- **WHEN** user adds "择时能力" module
- **THEN** module displays market timing ability analysis

#### Scenario: TM/HM model

- **WHEN** user adds "T-M/H-M模型" module
- **THEN** module displays Treynor-Mazuy or Henriksson-Merton model results

### Requirement: Bond Strategy Modules

The system SHALL provide bond strategy analysis modules for bond funds.

#### Scenario: Duration analysis

- **WHEN** user adds "久期分析" module
- **THEN** module displays portfolio duration and duration contribution

#### Scenario: Credit analysis

- **WHEN** user adds "信用分析" module
- **THEN** module displays credit rating distribution and credit spread exposure

#### Scenario: Interest rate sensitivity

- **WHEN** user adds "利率敏感性" module
- **THEN** module displays sensitivity to interest rate changes

#### Scenario: Bond holding distribution

- **WHEN** user adds "债券持仓分布" module
- **THEN** module displays bond holdings by type, maturity, rating

### Requirement: FOF Analysis Modules

The system SHALL provide FOF-specific analysis modules.

#### Scenario: Sub-fund allocation

- **WHEN** user adds "子基金配置" module
- **THEN** module displays allocation to underlying funds

#### Scenario: Strategy allocation

- **WHEN** user adds "策略配置" module
- **THEN** module displays allocation by strategy type

#### Scenario: Style look-through

- **WHEN** user adds "风格穿透" module
- **THEN** module displays aggregated style exposure across sub-funds

#### Scenario: Sub-fund contribution

- **WHEN** user adds "子基金贡献" module
- **THEN** module displays return contribution from each sub-fund

### Requirement: Risk Monitoring Modules

The system SHALL provide risk monitoring modules.

#### Scenario: Risk dashboard

- **WHEN** user adds "风险指标仪表盘" module
- **THEN** module displays key risk metrics in dashboard format

#### Scenario: Risk alerts

- **WHEN** user adds "风险预警" module
- **THEN** module displays risk alerts based on threshold breaches

#### Scenario: Stress testing

- **WHEN** user adds "压力测试" module
- **THEN** module displays portfolio impact under stress scenarios

#### Scenario: Scenario analysis

- **WHEN** user adds "情景分析" module
- **THEN** module displays portfolio impact under various market scenarios

#### Scenario: Liquidity risk

- **WHEN** user adds "流动性风险" module
- **THEN** module displays liquidity metrics and analysis

### Requirement: Benchmark Comparison Modules

The system SHALL provide comparison analysis modules.

#### Scenario: Multi-fund comparison

- **WHEN** user adds "多基金对比" module
- **THEN** module displays comparative analysis across multiple funds

#### Scenario: Benchmark comparison

- **WHEN** user adds "与基准对比" module
- **THEN** module displays fund performance relative to benchmark

#### Scenario: Peer average comparison

- **WHEN** user adds "与同类平均对比" module
- **THEN** module displays fund performance relative to peer average

#### Scenario: Competitor analysis

- **WHEN** user adds "竞品分析" module
- **THEN** module displays detailed comparison with competitor funds

### Requirement: Custom Modules

The system SHALL provide advanced custom module capabilities.

#### Scenario: Custom indicator

- **WHEN** user adds "自定义指标" module
- **THEN** user can define custom calculated metrics

#### Scenario: Custom chart

- **WHEN** user adds "自定义图表" module
- **THEN** user can create custom visualization

#### Scenario: External data import

- **WHEN** user adds "外部数据导入" module
- **THEN** user can import external data for analysis
