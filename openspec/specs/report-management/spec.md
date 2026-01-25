# report-management Specification

## Purpose
TBD - created by archiving change init-fund-report-system. Update Purpose after archive.
## Requirements
### Requirement: Report List View

The system SHALL provide a report management center with list view.

#### Scenario: Display report list

- **WHEN** user navigates to report management center
- **THEN** system displays all user's reports in table or card view

#### Scenario: Toggle view mode

- **WHEN** user clicks view toggle button
- **THEN** system switches between table view and card view

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
- **THEN** system moves all selected reports to trash

#### Scenario: Batch archive

- **WHEN** user selects multiple reports and clicks "批量归档"
- **THEN** system marks all selected reports as archived

### Requirement: Report CRUD Operations

The system SHALL support creating, reading, updating, and deleting reports.

#### Scenario: Create report

- **WHEN** user creates a new report
- **THEN** system generates unique report ID and saves initial configuration

#### Scenario: Read report

- **WHEN** user opens a report
- **THEN** system loads all report data including modules, parameters, and styles

#### Scenario: Update report

- **WHEN** user edits and saves a report
- **THEN** system updates report data and records last edit time

#### Scenario: Delete report

- **WHEN** user deletes a report
- **THEN** report is moved to trash (soft delete)

### Requirement: Report Sharing

The system SHALL allow users to share reports.

#### Scenario: Generate share link

- **WHEN** user clicks "分享" on a report
- **THEN** system generates a shareable link with optional expiration

#### Scenario: Access shared report

- **WHEN** recipient opens share link
- **THEN** recipient can view report in read-only mode

### Requirement: Trash Management

The system SHALL provide a trash for deleted reports.

#### Scenario: View trash

- **WHEN** user navigates to trash page
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

