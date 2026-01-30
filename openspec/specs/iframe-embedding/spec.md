## ADDED Requirements

### Requirement: iframe Container Page

The ratel-mind-web application SHALL provide an iframe container page for embedding Snowball frontend.

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

The ratel-mind-web sidebar SHALL include a navigation item for Report Center.

#### Scenario: Report Center menu item display

- **WHEN** sidebar renders navigation items
- **THEN** "报告中心" (Report Center) item is displayed
- **AND** item uses appropriate icon (IconReportAnalytics or similar)
- **AND** item is positioned after existing navigation items

#### Scenario: Report Center navigation active state

- **WHEN** user is on `/reports` route
- **THEN** Report Center navigation item shows active styling
- **AND** icon and label display in primary theme color
