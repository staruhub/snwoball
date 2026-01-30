## ADDED Requirements

### Requirement: Public API Endpoints Configuration

The Admin service authentication middleware SHALL exclude designated public API endpoints from authentication checks.

#### Scenario: Benchmark active list endpoint is public

- **WHEN** client sends GET request to `/api/v1/fund/benchmarks/active`
- **AND** request does not include authentication token
- **THEN** server processes the request without authentication
- **AND** returns the list of active benchmarks

#### Scenario: Other benchmark endpoints require authentication

- **WHEN** client sends POST/PUT/DELETE request to benchmark endpoints
- **AND** request does not include valid admin authentication token
- **THEN** server returns 401 Unauthorized response

#### Scenario: Public endpoint list is maintained in middleware configuration

- **WHEN** a new public endpoint is identified
- **THEN** it SHALL be added to the `exclude_paths` list in AdminAuthenticationMiddleware configuration
- **AND** the endpoint SHALL be documented as public in its controller
