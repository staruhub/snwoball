## ADDED Requirements

### Requirement: Editor Layout

The system SHALL provide a three-column editor layout for report editing.

#### Scenario: Display editor layout

- **WHEN** user opens report editor
- **THEN** editor displays: 左侧模块导航, 中间画布区域, 右侧配置面板

#### Scenario: Collapsible panels

- **WHEN** user clicks collapse button on left or right panel
- **THEN** that panel collapses to maximize canvas space

### Requirement: Top Action Bar

The system SHALL provide a top action bar with report controls.

#### Scenario: Display action bar elements

- **WHEN** user opens report editor
- **THEN** top bar shows: 返回按钮, 报告名称(可编辑), 保存状态, 全局筛选条件, 预览按钮, 导出按钮, 保存按钮

#### Scenario: Edit report name

- **WHEN** user clicks report name field and types
- **THEN** report name is updated in real-time

#### Scenario: Display save status

- **WHEN** report is saved
- **THEN** top bar shows "上次保存于 HH:mm:ss"

#### Scenario: Return to workspace

- **WHEN** user clicks return button
- **THEN** user is navigated back to workspace (with unsaved changes warning if applicable)

### Requirement: Global Filter Conditions

The system SHALL provide global filter controls that affect all modules.

#### Scenario: Fund selector

- **WHEN** user clicks fund selector
- **THEN** system displays fund selector with: 搜索框, 最近使用, 我的关注, 按类型筛选(股票型/混合型/债券型/...)

#### Scenario: Date range selector

- **WHEN** user clicks date range selector
- **THEN** system displays options: 成立以来, 近1年, 近3年, 近5年, 自定义日期范围

#### Scenario: Benchmark selector

- **WHEN** user clicks benchmark selector
- **THEN** system displays options: 主流指数(沪深300/中证500/中证800/创业板指), 行业指数, 自定义基准

#### Scenario: Frequency selector

- **WHEN** user clicks frequency selector
- **THEN** system displays options: 日度, 周度, 月度

#### Scenario: NAV type selector

- **WHEN** user clicks NAV type selector
- **THEN** system displays options: 复权净值, 单位净值, 累计净值

#### Scenario: Global filter change propagation

- **WHEN** user changes any global filter
- **THEN** all unlocked module parameters update to match

### Requirement: Left Module Navigation

The system SHALL provide a tree-structured module navigation panel.

#### Scenario: Display module tree

- **WHEN** user views left navigation
- **THEN** system displays hierarchical tree with categories: 产品信息, 基础分析, 股票策略, 债券策略, FOF分析, 风险监控, 业绩比较, 自定义模块

#### Scenario: Expand collapse categories

- **WHEN** user clicks on category node
- **THEN** child nodes expand or collapse

#### Scenario: Module search

- **WHEN** user types in navigation search box
- **THEN** tree filters to show only matching modules

#### Scenario: Highlight added modules

- **WHEN** a module has been added to canvas
- **THEN** that navigation node shows "已添加" visual indicator

#### Scenario: Navigate to module

- **WHEN** user clicks on already-added module in navigation
- **THEN** canvas scrolls to that module and selects it

### Requirement: Canvas Empty State

The system SHALL display helpful empty state when canvas has no modules.

#### Scenario: Display empty state

- **WHEN** canvas has no modules
- **THEN** system shows: 引导图标, "点击左侧添加分析模块"提示, 选择模板开始按钮

### Requirement: Module Addition

The system SHALL allow adding analysis modules to the canvas.

#### Scenario: Add module by click

- **WHEN** user clicks on module leaf node in navigation
- **THEN** corresponding module card is added at canvas bottom

#### Scenario: Module default parameters

- **WHEN** module is newly added
- **THEN** module parameters default to following global settings

#### Scenario: Allow duplicate modules

- **WHEN** user adds same module type multiple times
- **THEN** system allows multiple instances of same module

### Requirement: Canvas Module Cards

The system SHALL display modules as cards on canvas.

#### Scenario: Card header structure

- **WHEN** module card is displayed
- **THEN** header shows: 拖拽手柄, 模块名称, 说明图标(ⓘ), 快捷切换, 更多菜单(···)

#### Scenario: Card more menu

- **WHEN** user clicks more menu (···)
- **THEN** options shown: 克隆模块, 删除模块, 全屏查看, 导出此模块, 刷新数据

#### Scenario: Card content area

- **WHEN** module has data
- **THEN** content area shows chart, table, or KPI display based on module type

#### Scenario: Card loading state

- **WHEN** module data is loading
- **THEN** card content shows skeleton loading state

#### Scenario: Card error state

- **WHEN** module data fails to load
- **THEN** card shows "数据加载失败，点击重试" with retry button

#### Scenario: Card empty state

- **WHEN** module has no data for current parameters
- **THEN** card shows "暂无数据" message

#### Scenario: Card resize handle

- **WHEN** user views card
- **THEN** bottom-right corner shows resize handle

### Requirement: Module Drag and Drop

The system SHALL allow reordering modules via drag and drop.

#### Scenario: Initiate drag

- **WHEN** user presses and holds on module card drag handle
- **THEN** card becomes draggable with visual feedback

#### Scenario: Drop indicator

- **WHEN** user drags card over canvas
- **THEN** system shows indicator line for drop position

#### Scenario: Complete reorder

- **WHEN** user releases dragged card
- **THEN** card moves to indicated position

### Requirement: Module Resize

The system SHALL allow resizing module cards.

#### Scenario: Resize via corner handle

- **WHEN** user drags bottom-right corner of card
- **THEN** card resizes with minimum constraints

#### Scenario: Content adaptation

- **WHEN** card is resized
- **THEN** chart/table content automatically adapts to new dimensions

### Requirement: Module Clone

The system SHALL allow cloning modules for comparison analysis.

#### Scenario: Clone module

- **WHEN** user clicks "克隆模块" in more menu
- **THEN** duplicate module appears directly below original

#### Scenario: Clone naming

- **WHEN** module is cloned
- **THEN** clone name has " (副本)" suffix

#### Scenario: Clone independence

- **WHEN** module is cloned
- **THEN** clone has independent parameters that can be modified separately

### Requirement: Module Delete

The system SHALL allow removing modules from canvas.

#### Scenario: Delete module

- **WHEN** user clicks "删除模块" in more menu
- **THEN** module is immediately removed from canvas
- **AND** navigation node loses "已添加" indicator if no other instances

### Requirement: Module Fullscreen

The system SHALL allow viewing modules in fullscreen.

#### Scenario: Enter fullscreen

- **WHEN** user clicks "全屏查看" in more menu
- **THEN** module content displays in fullscreen modal

#### Scenario: Fullscreen controls

- **WHEN** module is in fullscreen
- **THEN** user sees: 模块内容(全屏展示), 右上角关闭按钮, 底部工具栏(导出/刷新)

### Requirement: Indicator Tooltip

The system SHALL display indicator explanations on hover.

#### Scenario: Show tooltip

- **WHEN** user hovers over indicator info icon (ⓘ)
- **THEN** system shows tooltip with: 指标名称, 计算公式, 指标说明, 参考标准

### Requirement: Right Configuration Panel

The system SHALL provide context-sensitive configuration panel.

#### Scenario: No selection state

- **WHEN** no module is selected
- **THEN** right panel shows global settings with tabs: 全局参数, 全局样式

#### Scenario: Module selected state

- **WHEN** user clicks on a module card
- **THEN** right panel shows that module's configuration with tabs: 数据, 显示

### Requirement: Global Parameters Configuration

The system SHALL allow configuring global report parameters.

#### Scenario: Basic settings group

- **WHEN** user views 全局参数 > 基础设置
- **THEN** user sees: 基金, 日期范围, 基准, 频率, 净值类型

#### Scenario: Report settings group

- **WHEN** user views 全局参数 > 报告设置
- **THEN** user sees: 报告类型(产品/经理/组合), 报告类别(周报/月报/季报/年报/专项)

#### Scenario: Navigation settings group

- **WHEN** user views 全局参数 > 导航设置
- **THEN** user can toggle: 打开内容导航, 内容展示一级导航名字, 导航中显示底层控件名字

#### Scenario: Batch parameter update

- **WHEN** user clicks "批量控件参数设置"
- **THEN** system shows modal to select parameters and set new values for all modules

### Requirement: Module Parameters Configuration

The system SHALL allow configuring individual module parameters.

#### Scenario: Display module parameters

- **WHEN** module is selected and user views 数据 tab
- **THEN** right panel shows module parameters with lock icons (🔓/🔒)

#### Scenario: Parameter options

- **WHEN** user views module data tab
- **THEN** available parameters include: 净值频率, 基金, 基准, 对比基金(多选), 附加指标(多选), 日期范围, 净值类型, 超额收益类型(算术/几何)

#### Scenario: Parameter inheritance

- **WHEN** module parameter is unlocked (🔓)
- **THEN** parameter value follows global setting

#### Scenario: Parameter locking

- **WHEN** user clicks lock icon to lock parameter (🔒)
- **THEN** parameter becomes independent and won't change with global settings

#### Scenario: Parameter unlocking

- **WHEN** user clicks lock icon to unlock parameter
- **THEN** parameter reverts to following global settings

#### Scenario: Table module features

- **WHEN** user views table module data tab
- **THEN** additional options include: 按钮配置, 格式配置(小数位数/百分比/千分位), 提示说明文字开关, 首列固定, 行列转置, 跳转配置

### Requirement: Module Display Configuration

The system SHALL allow configuring module display options.

#### Scenario: Display tab options

- **WHEN** user views module 显示 tab
- **THEN** available options include: 图表类型切换, 颜色自定义, 图例位置, 坐标轴设置, 数据标签显示, 网格线显示

### Requirement: Global Style Configuration

The system SHALL allow configuring report visual styles.

#### Scenario: Theme settings

- **WHEN** user views 全局样式 > 主题设置
- **THEN** user can configure: 背景颜色, 内容区颜色, 主题配色方案(多套预设)

#### Scenario: Font settings

- **WHEN** user views 全局样式 > 字体设置
- **THEN** user can configure for 标题/图例/坐标轴: 字号(12-24px), 字体(微软雅黑/宋体/...), 颜色, 修饰(加粗/下划线/斜体)

### Requirement: Style Template Management

The system SHALL allow saving and loading style templates.

#### Scenario: View saved styles

- **WHEN** user views 全局样式 > 模板管理
- **THEN** user sees: 已保存的样式模板列表, 当前使用样式

#### Scenario: Save style template

- **WHEN** user clicks "+ 制作样式"
- **THEN** system shows save dialog and saves current style configuration

#### Scenario: Load style template

- **WHEN** user selects a saved style template
- **THEN** all style settings update to match template

### Requirement: Report Auto-Save

The system SHALL automatically save report changes.

#### Scenario: Trigger auto-save

- **WHEN** user makes changes and 30 seconds pass without further changes
- **THEN** system automatically saves report

#### Scenario: Auto-save indicator

- **WHEN** auto-save is in progress
- **THEN** save status shows "保存中..."

#### Scenario: Auto-save failure

- **WHEN** auto-save fails
- **THEN** system shows warning notification

### Requirement: Manual Save

The system SHALL allow manual report saving.

#### Scenario: Click save button

- **WHEN** user clicks save button
- **THEN** report is saved immediately
- **AND** save status updates

### Requirement: Unsaved Changes Warning

The system SHALL warn users about unsaved changes.

#### Scenario: Navigate away with unsaved changes

- **WHEN** user attempts to leave editor with unsaved changes
- **THEN** system shows modal: "您有未保存的修改，是否保存？" with buttons: 不保存, 取消, 保存
