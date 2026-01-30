## ADDED Requirements

### Requirement: E2E Test Infrastructure

The system SHALL provide automated end-to-end testing infrastructure using the `agent-browser` CLI tool.

#### Scenario: Test output directory structure

- **WHEN** E2E tests are executed
- **THEN** test artifacts are saved to `e2e-test-results/` directory
- **AND** screenshots are saved to `e2e-test-results/screenshots/` with descriptive filenames
- **AND** test reports are saved to `e2e-test-results/reports/`
- **AND** authentication state is saved to `e2e-test-results/auth-state/`

#### Scenario: Test results directory is gitignored

- **WHEN** tests generate output files
- **THEN** `e2e-test-results/` directory is excluded from version control
- **AND** no test artifacts are committed to the repository

### Requirement: Admin Authentication E2E Test

The system SHALL verify admin authentication workflow through automated browser testing.

#### Scenario: Admin login with valid credentials

- **WHEN** test navigates to `/admin/login`
- **AND** fills username and password fields with valid test credentials
- **AND** submits the login form
- **THEN** user is redirected to `/admin` dashboard
- **AND** authentication token is stored in localStorage under `user-storage` key
- **AND** screenshot is captured showing successful login state

#### Scenario: Token validation after login

- **WHEN** admin login is successful
- **THEN** localStorage `user-storage` contains non-empty `token` value
- **AND** token is not hardcoded empty string
- **AND** `isAuthenticated` flag is set to `true`

#### Scenario: Authentication state persistence

- **WHEN** authentication state is saved via `agent-browser state save`
- **AND** browser session is closed
- **AND** state is restored via `agent-browser state load`
- **AND** user navigates to protected route `/admin`
- **THEN** user remains authenticated without re-login
- **AND** admin dashboard content is displayed

#### Scenario: Protected route access without authentication

- **WHEN** user navigates to `/admin` without valid authentication
- **THEN** user is redirected to `/admin/login`
- **AND** admin dashboard content is not accessible

### Requirement: Report Management E2E Test

The system SHALL verify report creation and management workflow through automated browser testing.

#### Scenario: Report editor page loads correctly

- **WHEN** authenticated user navigates to `/editor/new`
- **THEN** three-panel layout is displayed (navigation, canvas, configuration)
- **AND** global filters bar is visible
- **AND** save and export buttons are visible in toolbar
- **AND** screenshot is captured showing editor layout

#### Scenario: Module addition to canvas

- **WHEN** user expands "产品信息" module category in navigation panel
- **AND** clicks add button for "产品表头" module
- **THEN** module card appears in canvas area
- **AND** configuration panel shows module settings
- **AND** screenshot is captured showing module on canvas

#### Scenario: Report save operation

- **WHEN** user adds modules to canvas
- **AND** clicks save button
- **THEN** save operation completes successfully
- **AND** success notification is displayed
- **AND** screenshot is captured showing saved state

#### Scenario: PDF export dialog (if available)

- **WHEN** user clicks export button
- **THEN** export dialog or options are displayed
- **AND** PDF format option is available
- **AND** screenshot is captured showing export options

### Requirement: E2E Test Reporting

The system SHALL generate comprehensive test reports after E2E test execution.

#### Scenario: Test summary report generation

- **WHEN** all E2E tests complete execution
- **THEN** summary report is generated at `e2e-test-results/reports/summary.md`
- **AND** report includes list of all test scenarios
- **AND** report indicates pass/fail status for each scenario
- **AND** report includes timestamps and execution duration

### Requirement: Test Data Cleanup

The system SHALL clean up test data after E2E test execution.

#### Scenario: Cleanup after test completion

- **WHEN** E2E tests complete execution
- **THEN** test-created reports are deleted from the system
- **AND** temporary test data is cleaned up
- **AND** database state is restored to pre-test condition

### Requirement: Test Credential Management

The system SHALL handle test credentials securely.

#### Scenario: Credentials from environment variables

- **WHEN** E2E tests require authentication
- **THEN** username is read from `ADMIN_USERNAME` environment variable
- **AND** password is read from `ADMIN_PASSWORD` environment variable
- **AND** credentials are not hardcoded in test scripts

#### Scenario: Missing credentials handling

- **WHEN** required environment variables are not set
- **THEN** test script fails with clear error message
- **AND** error indicates which environment variable is missing
