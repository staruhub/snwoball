## MODIFIED Requirements

### Requirement: iframe Container Page

The ratel-mind-web application SHALL provide an iframe container page for embedding Snowball frontend at `/reports` route only.

#### Scenario: Iframe loads Snowball with authentication token

- **WHEN** user navigates to `/reports` in ratel-mind-web
- **AND** user is authenticated
- **THEN** system renders an iframe pointing to Snowball URL with token parameter
- **AND** iframe fills the main content area with no visible borders

#### Scenario: Iframe displays loading state

- **WHEN** iframe is loading Snowball content
- **THEN** system displays a loading indicator in the container
- **AND** loading indicator disappears when iframe finishes loading

#### Scenario: Unauthenticated user access

- **WHEN** user navigates to `/reports` without authentication
- **THEN** system redirects user to login page

#### Scenario: Tab-based content switching

- **WHEN** user navigates to `/reports?tab=report-manage`
- **THEN** iframe SHALL load Snowball's `/reports` route
- **AND** when no tab parameter is provided
- **THEN** iframe SHALL load Snowball's `/workspace` route

### Requirement: iframe Environment Detection

The Snowball frontend SHALL detect when running inside an iframe and adapt its layout.

#### Scenario: Detect iframe embedding

- **WHEN** Snowball frontend loads
- **AND** `window.self !== window.top` is true
- **THEN** system sets `isIframe` state to true
- **AND** applies iframe-specific layout

#### Scenario: Standalone access remains unchanged

- **WHEN** Snowball frontend loads directly (not in iframe)
- **THEN** system displays full layout with navigation bar
- **AND** all standalone features remain functional

### Requirement: iframe Layout Adaptation

The Snowball frontend SHALL provide a simplified layout for iframe embedding.

#### Scenario: Hide redundant navigation

- **WHEN** Snowball is running in iframe mode
- **THEN** system hides the top navigation bar
- **AND** system hides any sidebar navigation
- **AND** main content area expands to fill available space

#### Scenario: Responsive behavior in iframe

- **WHEN** parent window resizes
- **THEN** iframe content adapts to new dimensions
- **AND** maintains readable layout at all sizes

### Requirement: Sidebar Navigation Entry

The ratel-mind-web sidebar SHALL include a navigation item for Fund Reports (基金报告) that uses iframe.

#### Scenario: Fund Reports menu item display

- **WHEN** sidebar renders navigation items
- **THEN** "基金报告" (Fund Reports) item is displayed
- **AND** item uses appropriate icon (IconReportAnalytics or similar)
- **AND** item is positioned after "报告广场" navigation item

#### Scenario: Fund Reports navigation active state

- **WHEN** user is on `/reports` route
- **THEN** Fund Reports navigation item shows active styling
- **AND** icon and label display in primary theme color

## ADDED Requirements

### Requirement: iframe Authentication Synchronization

The iframe page SHALL synchronize authentication state with the parent application.

#### Scenario: Token refresh detection
- **WHEN** JWT token in localStorage is updated
- **THEN** iframe page SHALL detect the change via storage event
- **AND** iframe src SHALL be updated with new token

#### Scenario: Authentication expiry handling
- **WHEN** Snowball iframe sends auth-expired message
- **THEN** parent application SHALL clear localStorage tokens
- **AND** user SHALL be redirected to login page

#### Scenario: Cross-origin message validation
- **WHEN** iframe receives postMessage from parent
- **THEN** system SHALL validate origin matches allowed origins
- **AND** system SHALL reject messages from unknown origins

### Requirement: iframe Load Timeout Handling

The iframe container SHALL handle load timeout scenarios gracefully.

#### Scenario: iframe load timeout
- **WHEN** iframe fails to load within 15 seconds
- **THEN** system SHALL display timeout error message
- **AND** system SHALL provide retry button
- **AND** system SHALL show suggestion to check Snowball service status

#### Scenario: Retry after timeout
- **WHEN** user clicks retry button after timeout
- **THEN** system SHALL reset loading state
- **AND** system SHALL attempt to reload iframe
- **AND** timeout timer SHALL restart
