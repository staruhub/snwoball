## MODIFIED Requirements

### Requirement: Performance Metrics Panel Data Loading

The `PerformanceMetricsPanel` component SHALL properly manage API request lifecycle to prevent memory leaks and stale state updates.

#### Scenario: Component unmounts during request
- **GIVEN** a request is in progress
- **WHEN** the component unmounts
- **THEN** the request SHALL be cancelled
- **AND** no state updates SHALL occur after unmount

#### Scenario: Fund changes while request is pending
- **GIVEN** a request for fund A is in progress
- **WHEN** the user switches to fund B
- **THEN** the request for fund A SHALL be cancelled
- **AND** a new request for fund B SHALL be initiated

#### Scenario: Request timeout handling
- **GIVEN** a metrics request times out (> 60 seconds)
- **WHEN** the timeout error is caught
- **THEN** the component SHALL display an error state
- **AND** the loading indicator SHALL be hidden

### Requirement: Reports Page iframe Loading

The `ReportsPage` component SHALL properly load external content via iframe with appropriate error handling.

#### Scenario: iframe loads successfully
- **GIVEN** the Snowball service is available
- **WHEN** the iframe src is set
- **THEN** the loading indicator SHALL be shown
- **AND** the loading indicator SHALL be hidden when iframe loads

#### Scenario: iframe fails to load
- **GIVEN** the Snowball service is unavailable
- **WHEN** the iframe fails to load
- **THEN** an error message SHALL be displayed
- **AND** a retry button SHALL be provided

#### Scenario: Authentication token passing
- **GIVEN** user is authenticated with a valid token
- **WHEN** the Reports page is accessed
- **THEN** the token SHALL be passed to the iframe via URL parameter
- **AND** the iframe SHALL have proper sandbox permissions

### Requirement: Request Cancellation Support

The `request.ts` utility SHALL support request cancellation via AbortController signal.

#### Scenario: Cancel request with AbortController
- **GIVEN** a request is initiated with an AbortSignal
- **WHEN** the signal is aborted
- **THEN** the request SHALL be cancelled
- **AND** an AbortError SHALL be thrown

#### Scenario: Timeout vs cancellation differentiation
- **GIVEN** a request can be cancelled or timeout
- **WHEN** an error occurs
- **THEN** AbortError and TimeoutError SHALL be distinguishable
- **AND** appropriate error handling SHALL be applied for each case

## ADDED Requirements

### Requirement: Sidebar Navigation Restoration

The LeftSidebar component SHALL use independent routes instead of `?tab=` parameter navigation.

#### Scenario: Home navigation
- **WHEN** user clicks "主页" (Home) in sidebar
- **THEN** system SHALL navigate to `/home`
- **AND** Home navigation item SHALL show active state

#### Scenario: Fund navigation
- **WHEN** user clicks "基金" (Fund) in sidebar
- **THEN** system SHALL navigate to `/fund`
- **AND** Fund navigation item SHALL show active state

#### Scenario: News navigation
- **WHEN** user clicks "资讯" (News) in sidebar
- **THEN** system SHALL navigate to `/news`
- **AND** News navigation item SHALL show active state

#### Scenario: ConfigPlaza navigation
- **WHEN** user clicks "配置广场" (Portfolio) in sidebar
- **THEN** system SHALL navigate to `/config-plaza`
- **AND** ConfigPlaza navigation item SHALL show active state

#### Scenario: ReportPlaza navigation
- **WHEN** user clicks "报告广场" (Report Plaza) in sidebar
- **THEN** system SHALL navigate to `/report-plaza`
- **AND** ReportPlaza navigation item SHALL show active state

#### Scenario: Reports iframe navigation
- **WHEN** user clicks "基金报告" (Fund Reports) in sidebar
- **THEN** system SHALL navigate to `/reports`
- **AND** Reports navigation item SHALL show active state

### Requirement: Environment Variable Compatibility

The system SHALL support both Vite-style and Next.js-style environment variables.

#### Scenario: Vite environment variable access
- **WHEN** code accesses `import.meta.env.VITE_API_BASE_URL`
- **THEN** system SHALL return the configured API base URL
- **AND** value SHALL be same as `process.env.NEXT_PUBLIC_API_BASE_URL`

#### Scenario: API base URL configuration
- **WHEN** application initializes
- **THEN** API base URL SHALL be `http://localhost:8003` in development
- **AND** API base URL SHALL be `https://www.beansinfo.com` in production

#### Scenario: Snowball URL configuration
- **WHEN** Reports page loads
- **THEN** Snowball URL SHALL be `http://localhost:3000` in development
- **AND** Snowball URL SHALL be configured production URL in production

### Requirement: Path Alias Support

The system SHALL support `@ratel` path alias for imports within ratel-mind-web.

#### Scenario: Component import with alias
- **WHEN** code uses `import { Component } from '@ratel/components/Component'`
- **THEN** import SHALL resolve to `apps/frontend/ratel-mind-web/src/components/Component`

#### Scenario: Page import with alias
- **WHEN** router uses `import Page from '@ratel/pages/PageName'`
- **THEN** import SHALL resolve to `apps/frontend/ratel-mind-web/src/pages/PageName`

#### Scenario: Utils import with alias
- **WHEN** code uses `import { util } from '@ratel/utils/utilName'`
- **THEN** import SHALL resolve to `apps/frontend/ratel-mind-web/src/utils/utilName`
