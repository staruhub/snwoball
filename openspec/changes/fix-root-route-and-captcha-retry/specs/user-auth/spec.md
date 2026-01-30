## MODIFIED Requirements

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

#### Scenario: Root route redirect for unauthenticated user

- **WHEN** unauthenticated user visits root path `/`
- **THEN** user is redirected to `/ratel/login`

#### Scenario: Root route redirect for authenticated user

- **WHEN** authenticated user visits root path `/`
- **THEN** user is redirected to `/ratel/fund`

#### Scenario: Captcha generation retry limit

- **WHEN** captcha generation fails due to backend unavailability
- **THEN** system retries up to 3 times with 1 second interval
- **AND** after 3 failed attempts, system stops retrying and displays error message
