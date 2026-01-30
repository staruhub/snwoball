## ADDED Requirements

### Requirement: Login Error Passthrough

The system SHALL return login error messages directly to the caller without triggering token refresh or redirect.

#### Scenario: Wrong password returns error message
- **WHEN** user submits login form with incorrect password
- **AND** backend returns HTTP 401 with error message
- **THEN** system SHALL NOT attempt token refresh
- **AND** system SHALL NOT redirect to login page
- **AND** system SHALL return the error response to the login form
- **AND** login form SHALL display "用户名或密码错误" message

#### Scenario: Invalid verification code returns error message
- **WHEN** user submits phone login with invalid verification code
- **AND** backend returns HTTP 401
- **THEN** system SHALL NOT attempt token refresh
- **AND** login form SHALL display the error message

#### Scenario: Auth endpoints excluded from refresh logic
- **WHEN** any request to `/api/v1/auth/login`, `/api/v1/auth/send-code`, `/api/v1/admin-auth/login`, or `/api/v1/auth/register` returns HTTP 401
- **THEN** system SHALL NOT call `refreshAccessToken()`
- **AND** system SHALL NOT call `handleAuthExpired()`

### Requirement: Token Refresh Precondition

The system SHALL only attempt token refresh when a valid access token exists in storage.

#### Scenario: No existing token skips refresh
- **WHEN** an API request returns HTTP 401
- **AND** no access_token exists in localStorage
- **THEN** system SHALL NOT attempt token refresh
- **AND** system SHALL return the 401 error to the caller

#### Scenario: Existing token triggers refresh attempt
- **WHEN** an API request returns HTTP 401
- **AND** a valid access_token exists in localStorage
- **AND** the request is NOT to an auth endpoint
- **THEN** system SHALL attempt to refresh the token

## MODIFIED Requirements

### Requirement: Session Management

The system SHALL manage user sessions with JWT tokens, with separate storage for admin and user tokens.

#### Scenario: Token generation on login
- **WHEN** user successfully authenticates via `/api/v1/auth/login`
- **THEN** system generates access token (expires in 2 hours) and refresh token (expires in 7 days)
- **AND** tokens are stored in `access_token` and `refresh_token` localStorage keys

#### Scenario: Token refresh
- **WHEN** access token is about to expire (within 10 minutes)
- **AND** user is on a non-admin route
- **THEN** system automatically refreshes the token using refresh token from `refresh_token` key

#### Scenario: Session invalidation on logout
- **WHEN** user clicks logout button
- **THEN** system invalidates all tokens
- **AND** clears `access_token` and `refresh_token` from localStorage
- **AND** user is redirected to login page
