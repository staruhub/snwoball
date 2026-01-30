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

## ADDED Requirements

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
