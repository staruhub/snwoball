## ADDED Requirements

### Requirement: Workspace Layout

The system SHALL provide a workspace home page as the main entry point for users.

#### Scenario: Display workspace after login

- **WHEN** user successfully logs in
- **THEN** user sees workspace home page with top navigation bar, quick actions area, recent reports list, and favorite templates

### Requirement: Top Navigation Bar

The system SHALL display a persistent top navigation bar.

#### Scenario: Navigation bar elements

- **WHEN** user views any page
- **THEN** navigation bar displays: Logo/产品名称, 全局搜索, 消息通知, 用户头像下拉

#### Scenario: User avatar dropdown menu

- **WHEN** user clicks avatar dropdown
- **THEN** system shows options: 个人中心, 账户设置, 帮助文档, 退出登录

### Requirement: Global Search

The system SHALL provide global search functionality.

#### Scenario: Search funds

- **WHEN** user types fund code or name in search box
- **THEN** system displays matching funds in dropdown

#### Scenario: Search reports

- **WHEN** user types report name in search box
- **THEN** system displays matching reports in dropdown

#### Scenario: Search templates

- **WHEN** user types template name in search box
- **THEN** system displays matching templates in dropdown

### Requirement: Quick Actions

The system SHALL provide quick action buttons on workspace.

#### Scenario: Create new report

- **WHEN** user clicks "新建报告" button
- **THEN** user is navigated to report editor with empty canvas

#### Scenario: Create from template

- **WHEN** user clicks "从模板创建" button
- **THEN** system displays template selection modal

#### Scenario: Import report

- **WHEN** user clicks "导入报告" button
- **THEN** system displays file upload dialog

### Requirement: Recent Reports List

The system SHALL display user's recent reports on workspace.

#### Scenario: Display recent reports

- **WHEN** user views workspace
- **THEN** system displays up to 10 most recently edited reports as cards

#### Scenario: Report card information

- **WHEN** user views a report card
- **THEN** card shows: 报告名称, 关联基金, 最后编辑时间, 报告状态(草稿/已完成), 操作按钮(编辑/复制/删除)

#### Scenario: Edit report from card

- **WHEN** user clicks "编辑" on report card
- **THEN** user is navigated to report editor with that report loaded

### Requirement: Favorite Templates

The system SHALL display user's favorite templates on workspace.

#### Scenario: Display favorite templates

- **WHEN** user views workspace
- **THEN** system displays user's favorited templates as cards

#### Scenario: Template card information

- **WHEN** user views a template card
- **THEN** card shows: 模板名称, 模板类型(周报/月报/专项), 创建时间, 使用此模板按钮

#### Scenario: Use favorite template

- **WHEN** user clicks "使用此模板" on template card
- **THEN** system creates new report based on that template and opens editor

### Requirement: Market Overview

The system SHALL optionally display market data overview on workspace when enabled.

#### Scenario: Display market indices

- **WHEN** market overview is enabled
- **THEN** system displays major index prices (上证/深证/创业板)

#### Scenario: Display northbound capital flow

- **WHEN** market overview is enabled
- **THEN** system displays latest northbound capital flow data (北向资金流向)

#### Scenario: Display hot sectors

- **WHEN** market overview is enabled
- **THEN** system displays today's hot sectors (今日热点板块)

### Requirement: Message Notifications

The system SHALL display message notifications to users.

#### Scenario: Display notification icon

- **WHEN** user views navigation bar
- **THEN** notification icon shows unread message count

#### Scenario: View notifications

- **WHEN** user clicks notification icon
- **THEN** system displays notification dropdown with recent messages
