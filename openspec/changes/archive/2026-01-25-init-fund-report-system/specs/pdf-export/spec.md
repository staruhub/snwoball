## ADDED Requirements

### Requirement: Export Dialog

The system SHALL provide an export configuration dialog.

#### Scenario: Open export dialog

- **WHEN** user clicks "导出" button in editor
- **THEN** system displays export configuration modal

#### Scenario: Export dialog options

- **WHEN** export dialog is open
- **THEN** user sees: 报告名称 input, 导出模板 dropdown, 导出类型 selection, 导出尺寸 selection

### Requirement: Export Configuration

The system SHALL allow configuring export settings.

#### Scenario: Set report name

- **WHEN** user enters report name in export dialog
- **THEN** exported file uses that name

#### Scenario: Select export template

- **WHEN** user selects export template
- **THEN** system applies selected template's styling to export

#### Scenario: Select export type

- **WHEN** user selects export type
- **THEN** available options are: PDF (current), Word (V2.0), PPT (V2.0), Excel (数据)

#### Scenario: Select export size

- **WHEN** user selects export size
- **THEN** available options are: A4纵向, A4横向, 无纸张大小限制

### Requirement: Export Content Options

The system SHALL allow selecting export content options.

#### Scenario: Include cover page

- **WHEN** user enables "包含封面页" option
- **THEN** exported PDF includes a cover page with report title and metadata

#### Scenario: Include table of contents

- **WHEN** user enables "包含目录" option
- **THEN** exported PDF includes clickable table of contents

#### Scenario: Include page numbers

- **WHEN** user enables "包含页码" option
- **THEN** exported PDF shows page numbers on each page

#### Scenario: Export range selection

- **WHEN** user selects export range
- **THEN** options are: 全部模块, 选中模块

### Requirement: PDF Generation

The system SHALL generate PDF documents from reports.

#### Scenario: Generate PDF

- **WHEN** user clicks "导出" button in dialog
- **THEN** system generates PDF matching canvas content and configuration

#### Scenario: Module order in PDF

- **WHEN** PDF is generated
- **THEN** modules appear in same order as canvas

#### Scenario: Style application

- **WHEN** PDF is generated
- **THEN** global styles (colors, fonts) are applied to PDF

#### Scenario: Chart rendering

- **WHEN** PDF is generated
- **THEN** charts are rendered as high-resolution images suitable for printing

#### Scenario: Table rendering

- **WHEN** PDF is generated
- **THEN** tables maintain formatting and support page breaks

### Requirement: Table of Contents Generation

The system SHALL generate table of contents based on navigation settings.

#### Scenario: TOC with first level navigation

- **WHEN** "内容展示一级导航名字" is enabled
- **THEN** TOC shows Level 1 section headers (e.g., "基础分析")

#### Scenario: TOC with module names

- **WHEN** "导航中显示底层控件名字" is enabled
- **THEN** TOC shows individual module names (e.g., "滚动夏普")

#### Scenario: TOC page links

- **WHEN** TOC is generated
- **THEN** each entry links to corresponding page in PDF

### Requirement: Export Progress

The system SHALL show export progress to users.

#### Scenario: Display progress

- **WHEN** PDF generation is in progress
- **THEN** system shows progress indicator with percentage

#### Scenario: Export completion

- **WHEN** PDF generation completes
- **THEN** system automatically downloads file
- **AND** shows success notification

#### Scenario: Export failure

- **WHEN** PDF generation fails
- **THEN** system shows error message with retry option

### Requirement: Export Performance

The system SHALL meet export performance requirements.

#### Scenario: Export time limit

- **WHEN** exporting report with 20 modules
- **THEN** export completes within 30 seconds

### Requirement: Export Template Management

The system SHALL allow managing export templates.

#### Scenario: System default templates

- **WHEN** user views export template options
- **THEN** system provides default export templates

#### Scenario: Save export template

- **WHEN** user configures export settings
- **THEN** user can save configuration as personal export template

#### Scenario: Use saved template

- **WHEN** user selects saved export template
- **THEN** export settings are populated from template
