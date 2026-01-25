## ADDED Requirements

### Requirement: Template Categories

The system SHALL organize templates into categories.

#### Scenario: Display template tabs

- **WHEN** user navigates to template management center
- **THEN** system displays tabs: 系统模板, 我的模板, 团队模板(V2.0)

#### Scenario: Display template types

- **WHEN** user views template list
- **THEN** templates are categorized by type: 周报模板, 月报模板, 季报模板, 年报模板, 风险分析专项, 收益归因专项, 持仓分析专项

### Requirement: System Templates

The system SHALL provide pre-built system templates.

#### Scenario: View system templates

- **WHEN** user selects "系统模板" tab
- **THEN** system displays official pre-built templates

#### Scenario: System template card

- **WHEN** user views a system template card
- **THEN** card shows: 模板预览图, 模板名称, 包含模块数, 使用次数

#### Scenario: System template operations

- **WHEN** user views system template operations
- **THEN** available actions are: 使用, 预览, 收藏 (edit and delete are not available)

#### Scenario: Use system template

- **WHEN** user clicks "使用" on system template
- **THEN** system creates new report based on that template and opens editor

### Requirement: Personal Templates

The system SHALL allow users to create and manage personal templates.

#### Scenario: Save as template

- **WHEN** user clicks "保存为模板" in report editor
- **THEN** system displays template save dialog

#### Scenario: Template save dialog

- **WHEN** template save dialog is shown
- **THEN** user can enter: 模板名称, 模板描述, 模板分类, 模板封面(上传或自动截图)

#### Scenario: Create personal template

- **WHEN** user submits template save form
- **THEN** system saves current report configuration as personal template

#### Scenario: Edit personal template

- **WHEN** user clicks "编辑" on personal template
- **THEN** user can modify template name, description, and category

#### Scenario: Delete personal template

- **WHEN** user clicks "删除" on personal template
- **THEN** system deletes template after confirmation

### Requirement: Template Preview

The system SHALL allow users to preview templates before using.

#### Scenario: Open preview

- **WHEN** user clicks "预览" on any template
- **THEN** system displays template preview modal/page

#### Scenario: Preview content

- **WHEN** template preview is open
- **THEN** user sees: 模板基本信息, 包含模块列表, 模板预览画布

#### Scenario: Use from preview

- **WHEN** user clicks "使用此模板创建报告" in preview
- **THEN** system creates new report and opens editor

### Requirement: Template Favorites

The system SHALL allow users to favorite templates.

#### Scenario: Add to favorites

- **WHEN** user clicks "收藏" on a template
- **THEN** template is added to user's favorites and appears on workspace

#### Scenario: Remove from favorites

- **WHEN** user clicks "取消收藏" on a favorited template
- **THEN** template is removed from favorites

### Requirement: Template Usage Tracking

The system SHALL track template usage statistics.

#### Scenario: Track usage count

- **WHEN** user creates report from template
- **THEN** system increments template usage count

#### Scenario: Display usage count

- **WHEN** user views template card
- **THEN** template usage count is displayed
