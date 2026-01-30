## ADDED Requirements

### Requirement: API Configuration Diagnostics

The ratel-mind-web application SHALL provide diagnostic information for API configuration issues.

#### Scenario: Development mode diagnostics
- **WHEN** the application starts in development mode
- **THEN** the console SHALL log the configured API base URL
- **AND** the console SHALL log environment variable sources (Vite or Next.js)

#### Scenario: API base URL validation
- **WHEN** the first API request is made
- **THEN** the request URL SHALL be validated for correct format
- **AND** if the URL is malformed, an error SHALL be logged with the expected format

#### Scenario: Environment variable injection verification
- **WHEN** `import.meta.env.VITE_API_BASE_URL` is accessed
- **THEN** it SHALL return the value from `NEXT_PUBLIC_API_BASE_URL` when running in Next.js
- **AND** it SHALL return the Vite environment value when running standalone

### Requirement: Enhanced Error Diagnostics

The request utility SHALL provide detailed error information for debugging.

#### Scenario: Network connectivity error
- **WHEN** a request fails due to network issues
- **THEN** the error message SHALL indicate network connectivity failure
- **AND** the target URL SHALL be included in the error details

#### Scenario: CORS error detection
- **WHEN** a request fails due to CORS policy
- **THEN** the error message SHALL indicate a potential CORS issue
- **AND** the console SHALL log the request origin and target

#### Scenario: Authentication error handling
- **WHEN** a 401 response is received
- **THEN** the error SHALL indicate token-related failure
- **AND** the console SHALL log whether a token was present in the request

#### Scenario: Request timeout differentiation
- **WHEN** a request times out vs when it is manually cancelled
- **THEN** TimeoutError and AbortError SHALL be distinguishable in error handling
- **AND** appropriate user feedback SHALL be provided for each case

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

#### Scenario: Tiered loading integration
- **GIVEN** the fund page implements tiered loading
- **WHEN** the Performance Metrics Panel is rendered
- **THEN** it SHALL only load data when the user interacts with it (expands detail panel or selects fund)
- **AND** it SHALL respect the caching mechanism from the parent component
