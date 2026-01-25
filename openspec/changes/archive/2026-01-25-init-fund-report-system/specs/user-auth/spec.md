## ADDED Requirements

### Requirement: User Login

The system SHALL provide multiple login methods for users to access the platform.

#### Scenario: Account password login success

- **WHEN** user enters valid username and password
- **THEN** user is authenticated and redirected to workspace

#### Scenario: Account password login failure

- **WHEN** user enters invalid credentials
- **THEN** system displays error message "用户名或密码错误"
- **AND** login attempt is logged for security audit

#### Scenario: Phone verification code login

- **WHEN** user requests verification code with valid phone number
- **THEN** system sends SMS code to the phone
- **AND** code expires after 5 minutes

#### Scenario: Phone verification code validation

- **WHEN** user enters correct verification code within validity period
- **THEN** user is authenticated and redirected to workspace

#### Scenario: Enterprise SSO login

- **WHEN** user clicks SSO login button
- **THEN** user is redirected to enterprise identity provider
- **AND** after successful authentication, user is redirected back to workspace

### Requirement: Session Management

The system SHALL manage user sessions with JWT tokens.

#### Scenario: Token generation on login

- **WHEN** user successfully authenticates
- **THEN** system generates access token (expires in 2 hours) and refresh token (expires in 7 days)

#### Scenario: Token refresh

- **WHEN** access token is about to expire (within 10 minutes)
- **THEN** system automatically refreshes the token using refresh token

#### Scenario: Session invalidation on logout

- **WHEN** user clicks logout button
- **THEN** system invalidates all tokens
- **AND** user is redirected to login page

### Requirement: Password Recovery

The system SHALL allow users to recover their passwords.

#### Scenario: Password reset request

- **WHEN** user clicks "忘记密码" and enters registered email/phone
- **THEN** system sends password reset link/code

#### Scenario: Password reset completion

- **WHEN** user sets new password via reset link
- **THEN** password is updated and user is redirected to login page
