## ADDED Requirements

### Requirement: Report List View

The system SHALL provide a report management center with list view.

#### Scenario: Display report list

- **WHEN** user navigates to report management center
- **THEN** system displays all user's reports in table or card view

#### Scenario: Toggle view mode

- **WHEN** user clicks view toggle button
- **THEN** system switches between table view (表格) and card view (卡片)

#### Scenario: Report item information

- **WHEN** user views a report item
- **THEN** item shows: 报告名称, 报告类型, 关联基金, 创建人, 最后编辑时间, 状态

### Requirement: Report Filtering

The system SHALL allow users to filter reports.

#### Scenario: Filter by report type

- **WHEN** user selects report type (全部/周报/月报/季报/专项)
- **THEN** system displays only reports matching selected type

#### Scenario: Filter by status

- **WHEN** user selects status (草稿/已完成/已导出)
- **THEN** system displays only reports matching selected status

#### Scenario: Filter by date range

- **WHEN** user selects date range for creation time
- **THEN** system displays only reports created within that range

#### Scenario: Filter by associated fund

- **WHEN** user selects a fund
- **THEN** system displays only reports associated with that fund

### Requirement: Report Sorting

The system SHALL allow users to sort reports.

#### Scenario: Sort by last edit time

- **WHEN** user selects "最近编辑" sort option
- **THEN** reports are sorted by last edit time descending

#### Scenario: Sort by creation time

- **WHEN** user selects "创建时间" sort option
- **THEN** reports are sorted by creation time descending

#### Scenario: Sort by name

- **WHEN** user selects "报告名称" sort option
- **THEN** reports are sorted alphabetically by name

### Requirement: Batch Operations

The system SHALL allow batch operations on reports.

#### Scenario: Select multiple reports

- **WHEN** user checks multiple report checkboxes
- **THEN** batch operation buttons become active

#### Scenario: Batch export

- **WHEN** user selects multiple reports and clicks "批量导出"
- **THEN** system generates and downloads a zip file containing all selected reports as PDFs

#### Scenario: Batch delete

- **WHEN** user selects multiple reports and clicks "批量删除"
- **THEN** system moves all selected reports to trash after confirmation

#### Scenario: Batch archive

- **WHEN** user selects multiple reports and clicks "批量归档"
- **THEN** system marks all selected reports as archived

### Requirement: Report Operations

The system SHALL support individual report operations.

#### Scenario: Edit report

- **WHEN** user clicks "编辑" on a report
- **THEN** user is navigated to report editor with that report loaded

#### Scenario: Copy report

- **WHEN** user clicks "复制" on a report
- **THEN** system creates a copy with name "{original} (副本)"

#### Scenario: Export report

- **WHEN** user clicks "导出" on a report
- **THEN** system opens export configuration dialog

#### Scenario: Share report

- **WHEN** user clicks "分享" on a report
- **THEN** system generates shareable link with optional expiration

#### Scenario: Delete report

- **WHEN** user clicks "删除" on a report
- **THEN** report is moved to trash (soft delete) after confirmation

### Requirement: Trash Management

The system SHALL provide a trash for deleted reports.

#### Scenario: View trash

- **WHEN** user navigates to trash page (回收站)
- **THEN** system displays all soft-deleted reports

#### Scenario: Restore report

- **WHEN** user clicks "恢复" on a trashed report
- **THEN** report is restored to active reports

#### Scenario: Permanently delete

- **WHEN** user clicks "彻底删除" on a trashed report
- **THEN** report is permanently deleted after confirmation

#### Scenario: Auto-purge

- **WHEN** report has been in trash for more than 30 days
- **THEN** system automatically permanently deletes it
