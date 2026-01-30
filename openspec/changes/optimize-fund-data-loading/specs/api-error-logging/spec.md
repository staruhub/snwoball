## ADDED Requirements

### Requirement: Unified Error Logging

The system SHALL provide a unified error logging utility for API errors.

#### Scenario: Log API error with context

- **WHEN** `logApiError(context, error)` is called with an API error
- **THEN** the system logs the error with context name, error message, status code, and timestamp

#### Scenario: Log with custom metadata

- **WHEN** `logApiError(context, error, { metadata: { userId, endpoint } })` is called
- **THEN** the system includes the custom metadata in the log output

#### Scenario: Configurable log level

- **WHEN** `logApiError(context, error, { level: 'warn' })` is called
- **THEN** the system uses console.warn instead of console.error

### Requirement: Silent Mode

The system SHALL support silent error logging for graceful degradation scenarios.

#### Scenario: Silent logging

- **WHEN** `logApiError(context, error, { silent: true })` is called
- **THEN** the system records the error internally but does not output to console

#### Scenario: Non-silent logging (default)

- **WHEN** `logApiError(context, error)` is called without silent option
- **THEN** the system outputs the error to console

### Requirement: Error Classification

The system SHALL classify errors by type for better analysis.

#### Scenario: Network error classification

- **WHEN** an error occurs due to network failure (no response)
- **THEN** the system classifies it as `network_error`

#### Scenario: Authentication error classification

- **WHEN** an error has status code 401 or 403
- **THEN** the system classifies it as `auth_error`

#### Scenario: Client error classification

- **WHEN** an error has status code 4xx (except 401/403)
- **THEN** the system classifies it as `client_error`

#### Scenario: Server error classification

- **WHEN** an error has status code 5xx
- **THEN** the system classifies it as `server_error`

### Requirement: Error Aggregation Hook

The system SHALL provide a way to collect errors for potential future reporting.

#### Scenario: Access recent errors

- **WHEN** `getRecentApiErrors(limit)` is called
- **THEN** the system returns the most recent N logged errors

#### Scenario: Clear error history

- **WHEN** `clearApiErrorHistory()` is called
- **THEN** the system clears the in-memory error history

#### Scenario: Error history size limit

- **WHEN** the error history exceeds 100 entries
- **THEN** the system removes the oldest entries to maintain the limit
