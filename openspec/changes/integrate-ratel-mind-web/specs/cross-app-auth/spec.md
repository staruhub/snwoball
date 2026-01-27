## ADDED Requirements

### Requirement: Token URL Parameter Transfer

The ratel-mind-web application SHALL pass JWT token to Snowball iframe via URL parameter.

#### Scenario: Token appended to iframe URL

- **WHEN** user navigates to Report Center
- **AND** user has valid authentication token in localStorage
- **THEN** system constructs iframe URL as `${SNOWBALL_URL}?token=${accessToken}`
- **AND** iframe loads with token parameter

#### Scenario: Missing token handling

- **WHEN** user navigates to Report Center
- **AND** no authentication token exists in localStorage
- **THEN** system redirects user to login page
- **AND** iframe is not rendered

### Requirement: Token Reception and Storage

The Snowball frontend SHALL receive and store authentication token from URL parameter.

#### Scenario: Token extracted from URL

- **WHEN** Snowball frontend loads with `?token=` parameter
- **THEN** system extracts token value from URL
- **AND** stores token in localStorage under key `auth_token`
- **AND** removes token parameter from URL using `history.replaceState`

#### Scenario: Token not present in URL

- **WHEN** Snowball frontend loads without `?token=` parameter
- **AND** no token exists in localStorage
- **THEN** system continues without authentication
- **AND** API requests that require auth will receive 401 response

#### Scenario: Existing token preserved

- **WHEN** Snowball frontend loads without `?token=` parameter
- **AND** valid token exists in localStorage
- **THEN** system uses existing token for API requests

### Requirement: Authentication Expiry Notification

The Snowball frontend SHALL notify parent window when authentication expires.

#### Scenario: 401 response triggers notification

- **WHEN** Snowball API request receives 401 Unauthorized response
- **AND** Snowball is running in iframe mode
- **THEN** system sends postMessage to parent window
- **AND** message has format `{ type: 'AUTH_EXPIRED' }`

#### Scenario: Parent window handles expiry notification

- **WHEN** ratel-mind-web receives `AUTH_EXPIRED` postMessage
- **AND** message origin matches allowed origins
- **THEN** system clears local authentication state
- **AND** redirects user to login page

#### Scenario: Ignore messages from untrusted origins

- **WHEN** ratel-mind-web receives postMessage
- **AND** message origin does not match allowed origins
- **THEN** system ignores the message
- **AND** no action is taken

### Requirement: CORS Configuration

The backend API SHALL accept requests from multiple frontend origins.

#### Scenario: Local development CORS

- **WHEN** API receives request from `http://localhost:3000` (Snowball)
- **OR** API receives request from `http://localhost:5173` (ratel-mind-web)
- **THEN** server includes appropriate CORS headers
- **AND** request is processed normally

#### Scenario: Production CORS

- **WHEN** API receives request from configured production domains
- **THEN** server includes appropriate CORS headers
- **AND** `Access-Control-Allow-Credentials` is set to true

#### Scenario: Preflight OPTIONS request

- **WHEN** browser sends OPTIONS preflight request
- **THEN** server responds with allowed methods and headers
- **AND** includes `Access-Control-Allow-Origin` for requesting origin
