## MODIFIED Requirements

### Requirement: Global Filter Conditions

The system SHALL provide global filter controls that affect all modules.

#### Scenario: Fund selector

- **WHEN** user clicks fund selector
- **THEN** system displays fund search dropdown with tabs: 最近使用, 我的关注, 按类型筛选

#### Scenario: Fund selector data loading

- **WHEN** fund selector is opened
- **THEN** system fetches fund list from `GET /api/v1/fund/public-funds` API
- **AND** displays loading indicator while fetching
- **AND** shows error message with retry button if fetch fails

#### Scenario: Fund selector search

- **WHEN** user types in fund search input
- **THEN** system debounces input for 300ms
- **AND** calls API with keyword parameter
- **AND** displays filtered results

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

### Requirement: Report Auto-Save

The system SHALL automatically save report changes.

#### Scenario: Trigger auto-save

- **WHEN** user makes changes and 30 seconds pass without further changes
- **THEN** system automatically calls `PUT /api/v1/user-reports/{reportId}` API
- **AND** updates lastSavedAt timestamp on success

#### Scenario: Auto-save failure

- **WHEN** auto-save API call fails
- **THEN** system shows warning notification
- **AND** does not update lastSavedAt timestamp

### Requirement: Manual Save

The system SHALL allow manual report saving.

#### Scenario: Click save button

- **WHEN** user clicks save button
- **THEN** system calls `PUT /api/v1/user-reports/{reportId}` API
- **AND** shows loading indicator during save
- **AND** button shows "已保存" state temporarily on success
- **AND** shows error toast on failure

#### Scenario: Save content

- **WHEN** report is saved
- **THEN** system persists: report name, global parameters, module list, module order, module sizes, module parameters, global styles
- **AND** sends complete report content as JSON to API

## ADDED Requirements

### Requirement: Report Data Persistence

The system SHALL persist all report data through backend API.

#### Scenario: Create new report

- **WHEN** user creates a new report
- **THEN** system calls `POST /api/v1/user-reports` API with report name
- **AND** receives new report ID in response
- **AND** updates URL to include report ID

#### Scenario: Load existing report

- **WHEN** user opens an existing report for editing
- **THEN** system calls `GET /api/v1/user-reports/{reportId}` API
- **AND** populates editor state with report content
- **AND** shows error message if report not found

#### Scenario: Update report

- **WHEN** user saves changes to an existing report
- **THEN** system calls `PUT /api/v1/user-reports/{reportId}` API
- **AND** sends complete report content including modules, filters, and config
- **AND** updates isDirty state to false on success

### Requirement: No Mock Data in Production

The system SHALL NOT use hardcoded mock data in development or production environments.

#### Scenario: Fund selector data source

- **WHEN** fund selector needs fund list data
- **THEN** system fetches from real API endpoint
- **AND** does NOT use any hardcoded sample data arrays

#### Scenario: Save operation

- **WHEN** user triggers save (manual or auto)
- **THEN** system calls real API endpoint
- **AND** does NOT use setTimeout to simulate async behavior
