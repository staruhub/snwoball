# report-editor Specification

## Purpose
TBD - created by archiving change init-fund-report-system. Update Purpose after archive.
## Requirements
### Requirement: Editor Layout

The system SHALL provide a three-column editor layout for report editing.

#### Scenario: Display editor layout

- **WHEN** user opens report editor
- **THEN** editor displays left navigation panel, center canvas, and right configuration panel

#### Scenario: Collapsible panels

- **WHEN** user clicks collapse button on left or right panel
- **THEN** that panel collapses to maximize canvas space

### Requirement: Top Action Bar

The system SHALL provide a top action bar with report controls.

#### Scenario: Display action bar elements

- **WHEN** user opens report editor
- **THEN** top bar shows: return button, report name input, save status, global filters, preview button, export button, save button

#### Scenario: Edit report name

- **WHEN** user clicks report name field and types
- **THEN** report name is updated in real-time

#### Scenario: Display save status

- **WHEN** report is saved
- **THEN** top bar shows "上次保存于 HH:mm:ss"

### Requirement: Global Filter Conditions

The system SHALL provide global filter controls that affect all modules.

#### Scenario: Fund selector

- **WHEN** user clicks fund selector
- **THEN** system displays fund search dropdown with tabs: 最近使用, 我的关注, 按类型筛选

#### Scenario: Date range selector

- **WHEN** user clicks date range selector
- **THEN** system displays options: 成立以来, 近1年, 近3年, 近5年, 自定义日期范围

#### Scenario: Benchmark selector

- **WHEN** user clicks benchmark selector
- **THEN** system displays options: 沪深300, 中证500, 中证800, 创业板指, 行业指数, 自定义基准

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
- **THEN** system displays hierarchical tree: Level 1 板块 → Level 2 分类 → Level 3 具体模块

#### Scenario: Expand collapse categories

- **WHEN** user clicks on Level 1 or Level 2 node
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

### Requirement: Module Addition

The system SHALL allow adding analysis modules to the canvas.

#### Scenario: Add module by click

- **WHEN** user clicks on Level 3 leaf node in navigation
- **THEN** corresponding module card is added at canvas bottom

#### Scenario: Module default parameters

- **WHEN** module is newly added
- **THEN** module parameters default to following global settings

#### Scenario: Allow duplicate modules

- **WHEN** user adds same module type multiple times
- **THEN** system allows multiple instances of same module

### Requirement: Canvas Module Cards

The system SHALL display modules as draggable cards on canvas.

#### Scenario: Card structure

- **WHEN** module card is displayed
- **THEN** card shows: drag handle, module title, info icon, quick switch buttons, more menu, content area, resize handle

#### Scenario: Loading state

- **WHEN** module data is loading
- **THEN** card content shows skeleton loading state

#### Scenario: Error state

- **WHEN** module data fails to load
- **THEN** card shows error message with retry button

#### Scenario: Empty state

- **WHEN** module has no data for current parameters
- **THEN** card shows "暂无数据" message

### Requirement: Module Drag and Drop

The system SHALL allow reordering modules via drag and drop.

#### Scenario: Initiate drag

- **WHEN** user presses and holds on module card title area
- **THEN** card becomes draggable with visual feedback

#### Scenario: Drop indicator

- **WHEN** user drags card over canvas
- **THEN** system shows blue horizontal line indicating drop position

#### Scenario: Complete reorder

- **WHEN** user releases dragged card
- **THEN** card moves to indicated position
- **AND** left navigation order updates to match

### Requirement: Module Resize

The system SHALL allow resizing module cards.

#### Scenario: Resize via corner handle

- **WHEN** user drags bottom-right corner of card
- **THEN** card resizes with minimum width 50% of canvas, minimum height 200px

#### Scenario: Content adaptation

- **WHEN** card is resized
- **THEN** chart/table content automatically adapts to new dimensions

### Requirement: Module Clone

The system SHALL allow cloning modules for comparison analysis.

#### Scenario: Clone module

- **WHEN** user clicks "克隆" in module more menu
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

- **WHEN** user clicks "删除" in module more menu
- **THEN** module is immediately removed from canvas
- **AND** navigation node loses "已添加" indicator

### Requirement: Right Configuration Panel

The system SHALL provide context-sensitive configuration panel.

#### Scenario: No selection state

- **WHEN** no module is selected
- **THEN** right panel shows global settings (全局参数 and 全局样式 tabs)

#### Scenario: Module selected state

- **WHEN** user clicks on a module card
- **THEN** right panel shows that module's parameter configuration

### Requirement: Global Parameters Configuration

The system SHALL allow configuring global report parameters.

#### Scenario: Global parameter options

- **WHEN** user views 全局参数 tab
- **THEN** user sees: 基金, 日期范围, 基准, 频率, 净值类型, 报告类型, 报告类别, 导航设置, 批量控件参数设置

#### Scenario: Navigation settings

- **WHEN** user configures 导航设置
- **THEN** user can toggle: 打开内容导航, 内容展示一级导航名字, 导航中显示底层控件名字

#### Scenario: Batch parameter update

- **WHEN** user clicks "批量控件参数设置"
- **THEN** system shows modal to select parameters and set new values for all modules

### Requirement: Module Parameters Configuration

The system SHALL allow configuring individual module parameters.

#### Scenario: Display module parameters

- **WHEN** module is selected
- **THEN** right panel shows module-specific parameters with lock icons

#### Scenario: Parameter inheritance

- **WHEN** module parameter is unlocked
- **THEN** parameter value follows global setting

#### Scenario: Parameter locking

- **WHEN** user clicks lock icon to lock parameter
- **THEN** parameter becomes independent and won't change with global settings

#### Scenario: Parameter unlocking

- **WHEN** user clicks lock icon to unlock parameter
- **THEN** parameter reverts to following global settings

### Requirement: Global Style Configuration

The system SHALL allow configuring report visual styles.

#### Scenario: Theme color selection

- **WHEN** user selects theme color preset
- **THEN** all module charts update to use selected color scheme

#### Scenario: Background configuration

- **WHEN** user sets background and content area colors
- **THEN** report visual appearance updates accordingly

#### Scenario: Font configuration

- **WHEN** user configures font settings for titles, legends, or axes
- **THEN** user can set: font size (12-24px), font family, color, decorations (bold/underline/italic)

### Requirement: Style Template Management

The system SHALL allow saving and loading style templates.

#### Scenario: Save style template

- **WHEN** user clicks "+ 制作样式"
- **THEN** system saves current style configuration as template

#### Scenario: Load style template

- **WHEN** user selects a saved style template
- **THEN** all style settings update to match template

### Requirement: Report Auto-Save

The system SHALL automatically save report changes.

#### Scenario: Trigger auto-save

- **WHEN** user makes changes and 30 seconds pass without further changes
- **THEN** system automatically saves report

#### Scenario: Auto-save failure

- **WHEN** auto-save fails
- **THEN** system shows warning notification

### Requirement: Manual Save

The system SHALL allow manual report saving.

#### Scenario: Click save button

- **WHEN** user clicks save button
- **THEN** report is saved immediately
- **AND** button shows "已保存" state temporarily

#### Scenario: Save content

- **WHEN** report is saved
- **THEN** system persists: report name, global parameters, module list, module order, module sizes, module parameters, global styles

### Requirement: Unsaved Changes Warning

The system SHALL warn users about unsaved changes.

#### Scenario: Navigate away with unsaved changes

- **WHEN** user attempts to leave editor with unsaved changes
- **THEN** system shows modal: "您有未保存的修改，是否保存？" with buttons: 不保存, 取消, 保存

