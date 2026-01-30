## ADDED Requirements

### Requirement: Business Error Graceful Degradation

When the backend returns HTTP 422 with "数据不足" message, the system SHALL treat this as a business boundary condition, not a system error.

#### Scenario: Insufficient data for short time range
- **WHEN** user selects a short time range (e.g., "近一月") that has insufficient data points
- **AND** the API returns HTTP 422 with message containing "数据不足"
- **THEN** the system SHALL NOT display an error toast
- **AND** the system SHALL NOT log as console.error (use console.warn instead)
- **AND** the UI SHALL display a friendly message: "当前区间数据不足，无法计算指标，请尝试拉长时间范围"

#### Scenario: Newly established fund with sparse data
- **WHEN** user views a newly established fund
- **AND** the fund lacks sufficient historical data for metric calculation
- **AND** the API returns HTTP 422 with message containing "数据不足"
- **THEN** the behavior SHALL be identical to the short time range scenario

#### Scenario: Other 422 errors remain as system errors
- **WHEN** the API returns HTTP 422 with a message NOT containing "数据不足"
- **THEN** the system SHALL treat this as a system error
- **AND** the normal error handling flow SHALL apply (toast, console.error)

### Requirement: AbortSignal Propagation to Network Layer

The AbortSignal from component-level AbortController SHALL be properly propagated through the entire request chain to actually cancel the underlying fetch request.

#### Scenario: Signal passed through service layer
- **WHEN** a component creates an AbortController and passes signal to a service function
- **THEN** the service function SHALL accept the signal parameter
- **AND** the service function SHALL pass the signal to the underlying request utility

#### Scenario: Request cancelled on signal abort
- **GIVEN** a request is in flight with an attached AbortSignal
- **WHEN** the AbortController.abort() is called
- **THEN** the fetch request SHALL be cancelled immediately
- **AND** network traffic SHALL stop (not just state updates)

#### Scenario: Rapid filter changes cancel previous requests
- **GIVEN** user is on fund detail page
- **WHEN** user rapidly changes filter conditions (e.g., time range)
- **THEN** each filter change SHALL abort the previous pending request
- **AND** only the latest request SHALL complete and update the UI

## MODIFIED Requirements

### Requirement: Performance Metrics Panel Data Loading

The `PerformanceMetricsPanel` component SHALL properly manage API request lifecycle to prevent memory leaks and stale state updates, AND SHALL distinguish between system errors and business boundary conditions.

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

#### Scenario: Insufficient data error handling
- **GIVEN** a metrics request returns HTTP 422 with "数据不足" message
- **WHEN** the error is caught
- **THEN** the component SHALL set insufficientData state to true
- **AND** the component SHALL NOT set error state
- **AND** the component SHALL display the friendly guidance message
