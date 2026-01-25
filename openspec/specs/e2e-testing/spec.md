# e2e-testing Specification

## Purpose

Define standards and requirements for end-to-end testing of the Snowball fund analysis report system. E2E tests validate complete user workflows across the frontend and backend, ensuring critical paths work correctly in an integrated environment.

## Requirements

### Requirement: Test Environment Setup

The system SHALL provide a consistent test environment for E2E testing.

#### Scenario: Development server availability

- **GIVEN** the test environment is being prepared
- **WHEN** E2E tests are initiated
- **THEN** frontend dev server SHALL be running on localhost:3000
- **AND** backend API server SHALL be running on localhost:8002

#### Scenario: Test output directory structure

- **GIVEN** E2E tests will generate artifacts
- **THEN** system SHALL organize outputs in `e2e-test-results/` with subdirectories:
  - `screenshots/` for test screenshots
  - `reports/` for test summary reports
  - `auth-state/` for authentication state files

### Requirement: Authentication Flow Testing

The system SHALL validate complete authentication workflows.

#### Scenario: Admin login success

- **WHEN** admin navigates to /admin/login
- **AND** enters valid credentials
- **THEN** user is authenticated
- **AND** redirected to /admin dashboard
- **AND** JWT token is stored in localStorage

#### Scenario: Token persistence verification

- **WHEN** user completes login
- **THEN** system SHALL verify token in `user-storage` localStorage key
- **AND** token SHALL NOT be empty or hardcoded

#### Scenario: Protected route access

- **GIVEN** user is authenticated
- **WHEN** user accesses protected routes (/admin/*)
- **THEN** access is granted without redirect to login

### Requirement: Report Management Workflow Testing

The system SHALL validate the complete report creation workflow.

#### Scenario: Report editor access

- **GIVEN** user is authenticated
- **WHEN** user navigates to /editor/new
- **THEN** three-column editor layout loads correctly
- **AND** module sidebar displays available modules

#### Scenario: Module addition

- **GIVEN** user is in report editor
- **WHEN** user expands a module category
- **AND** clicks to add a module
- **THEN** module appears in the canvas area

#### Scenario: Export dialog

- **GIVEN** user has content in report editor
- **WHEN** user clicks export button
- **THEN** export dialog displays with format options

### Requirement: Test Reporting

The system SHALL generate comprehensive test reports.

#### Scenario: Summary report generation

- **WHEN** test suite completes
- **THEN** system generates markdown summary at `e2e-test-results/reports/summary.md`
- **AND** report includes pass/fail counts per test suite
- **AND** report documents any issues discovered

#### Scenario: Screenshot capture

- **WHEN** key test steps complete
- **THEN** screenshots are saved to `e2e-test-results/screenshots/`
- **AND** filenames include sequence numbers for ordering

## Technical Notes

### Tool Selection

- **Primary**: Chrome DevTools MCP for interactive browser automation
- **Alternative**: Playwright for CI/CD integration
- **Original plan**: agent-browser CLI (adjusted due to availability)

### Test Credentials

- Test credentials SHALL be passed via environment variables
- Credentials SHALL NOT be hardcoded in test scripts
- Default test admin: username=admin, password managed separately

### Integration with Existing Tests

- E2E tests complement existing Playwright page tests
- E2E tests focus on complete user journeys
- Playwright tests focus on component-level validation
