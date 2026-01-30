## ADDED Requirements

### Requirement: Home Page Migration
The system SHALL provide a fully functional Home page at `/ratel/home` with AI Search and Hot List sub-pages.

#### Scenario: Home page default redirect
- **WHEN** user navigates to `/ratel/home`
- **THEN** system SHALL redirect to `/ratel/home/ai-search`

#### Scenario: AI Search page access
- **WHEN** user navigates to `/ratel/home/ai-search`
- **THEN** system SHALL display the AI Search interface
- **AND** all AI search functionality SHALL work correctly

#### Scenario: Hot List page access
- **WHEN** user navigates to `/ratel/home/hot-list`
- **THEN** system SHALL display the Hot List page
- **AND** hot fund data SHALL load from API

### Requirement: Fund Page Migration
The system SHALL provide a fully functional Fund page at `/ratel/fund` with search, filter, and comparison features.

#### Scenario: Fund list display
- **WHEN** user navigates to `/ratel/fund`
- **THEN** system SHALL display the fund list
- **AND** fund data SHALL load from API at `http://localhost:8003` (dev) or `https://www.beansinfo.com` (prod)

#### Scenario: Fund comparison navigation
- **WHEN** user clicks "Compare" button on fund items
- **THEN** system SHALL navigate to `/ratel/fund/compare`
- **AND** selected funds SHALL be displayed for comparison

### Requirement: News Page Migration
The system SHALL provide a fully functional News page at `/ratel/news`.

#### Scenario: News list display
- **WHEN** user navigates to `/ratel/news`
- **THEN** system SHALL display fund-related news
- **AND** news data SHALL load from API

#### Scenario: News article interaction
- **WHEN** user clicks on a news article
- **THEN** system SHALL display article details or navigate to external link

### Requirement: ConfigPlaza Page Migration
The system SHALL provide a fully functional ConfigPlaza at `/ratel/config-plaza` with portfolio creation workflow.

#### Scenario: ConfigPlaza home access
- **WHEN** user navigates to `/ratel/config-plaza`
- **THEN** system SHALL display the portfolio list/dashboard

#### Scenario: Portfolio creation - basic info
- **WHEN** user starts portfolio creation
- **THEN** system SHALL navigate to `/ratel/config-plaza/create/basic`
- **AND** basic info form SHALL be displayed

#### Scenario: Portfolio creation - selection
- **WHEN** user completes basic info and continues
- **THEN** system SHALL navigate to `/ratel/config-plaza/create/select`
- **AND** fund selection interface SHALL be displayed

#### Scenario: Portfolio detail view
- **WHEN** user clicks on an existing portfolio
- **THEN** system SHALL navigate to `/ratel/config-plaza/portfolio/:id`
- **AND** portfolio details SHALL be displayed

### Requirement: ReportPlaza Page Migration
The system SHALL provide a fully functional ReportPlaza at `/ratel/report-plaza` with report editor.

#### Scenario: ReportPlaza default redirect
- **WHEN** user navigates to `/ratel/report-plaza`
- **THEN** system SHALL redirect to `/ratel/report-plaza/editor`

#### Scenario: Report editor access
- **WHEN** user navigates to `/ratel/report-plaza/editor`
- **THEN** system SHALL display the report editor interface

#### Scenario: Report editor with template
- **WHEN** user navigates to `/ratel/report-plaza/editor/:templateId`
- **THEN** system SHALL load the specified template
- **AND** editor SHALL be pre-populated with template content

### Requirement: Shared Components Migration
The system SHALL provide all shared components from the source project, including ThemedButton, ProtectedRoute, and utility functions.

#### Scenario: ThemedButton component usage
- **WHEN** any page uses ThemedButton component
- **THEN** button SHALL render with correct theme styling
- **AND** all variants (primary, secondary, ghost, etc.) SHALL work correctly

#### Scenario: ProtectedRoute component
- **WHEN** user accesses a protected route without authentication
- **THEN** system SHALL redirect to `/ratel/login`
- **AND** original destination SHALL be preserved for post-login redirect

### Requirement: i18n Support Migration
The system SHALL provide full internationalization support using react-i18next.

#### Scenario: Chinese language display
- **WHEN** user has Chinese locale selected
- **THEN** all UI text SHALL display in Chinese
- **AND** translation keys SHALL resolve correctly

#### Scenario: Language switching
- **WHEN** user changes language setting
- **THEN** all UI text SHALL update to new language
- **AND** preference SHALL be persisted

### Requirement: Theme Support Migration
The system SHALL provide theme support with compact, default, and comfortable density modes.

#### Scenario: Theme density modes
- **WHEN** user selects a density mode (compact/default/comfortable)
- **THEN** UI spacing and sizing SHALL adjust accordingly
- **AND** preference SHALL be persisted

#### Scenario: Dark mode support
- **WHEN** system or user prefers dark mode
- **THEN** UI SHALL render with dark theme colors
- **AND** all components SHALL support dark mode styling
