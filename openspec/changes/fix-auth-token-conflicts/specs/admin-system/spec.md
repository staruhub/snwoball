## ADDED Requirements

### Requirement: Admin Token Isolation

The system SHALL store admin authentication tokens separately from user tokens to prevent conflicts.

#### Scenario: Admin login stores token separately
- **WHEN** admin successfully authenticates via `/api/v1/admin-auth/login`
- **THEN** system stores access token in `admin_access_token` localStorage key
- **AND** system stores refresh token in `admin_refresh_token` localStorage key
- **AND** system does NOT overwrite `access_token` or `refresh_token` keys

#### Scenario: Admin API requests use admin token
- **WHEN** frontend makes API request from admin route (`/admin/*`)
- **THEN** system SHALL use token from `admin_access_token`
- **AND** system SHALL NOT use token from `access_token`

#### Scenario: Admin logout clears only admin tokens
- **WHEN** admin clicks logout on admin panel
- **THEN** system clears `admin_access_token` and `admin_refresh_token`
- **AND** system does NOT clear `access_token` or `refresh_token`

### Requirement: Route-Aware Token Hydration

The system SHALL select the appropriate token based on the current route context during store hydration.

#### Scenario: Admin route hydration
- **WHEN** useUserStore hydrates on an admin route (`/admin/*`)
- **AND** `admin_access_token` exists in localStorage
- **THEN** system SHALL set `isAdminAuthenticated: true`
- **AND** system SHALL NOT set `isAuthenticated: true` from `access_token`

#### Scenario: Admin route without admin token
- **WHEN** useUserStore hydrates on an admin route (`/admin/*`)
- **AND** `admin_access_token` does NOT exist in localStorage
- **AND** `access_token` exists in localStorage (ratel user session)
- **THEN** system SHALL NOT set `isAdminAuthenticated: true`
- **AND** system SHALL redirect to `/admin/login`

#### Scenario: User route hydration
- **WHEN** useUserStore hydrates on a non-admin route
- **AND** `access_token` exists in localStorage
- **THEN** system SHALL set `isAuthenticated: true`
- **AND** system SHALL ignore `admin_access_token`

### Requirement: Admin Session Independence

Admin sessions SHALL be completely independent from user sessions.

#### Scenario: Concurrent sessions allowed
- **WHEN** user is logged into ratel-mind-web
- **AND** same user logs into admin panel
- **THEN** both sessions SHALL be maintained independently
- **AND** logging out of admin SHALL NOT affect ratel session
- **AND** logging out of ratel SHALL NOT affect admin session

#### Scenario: Admin token refresh uses admin refresh token
- **WHEN** admin access token expires on admin route
- **THEN** system SHALL refresh using `admin_refresh_token`
- **AND** system SHALL NOT use `refresh_token`
