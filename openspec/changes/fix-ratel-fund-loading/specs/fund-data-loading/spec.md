## ADDED Requirements

### Requirement: Tiered Data Loading

The Fund page SHALL implement tiered data loading to optimize initial page load performance.

#### Scenario: Initial page load
- **WHEN** user navigates to `/ratel/fund`
- **THEN** only the fund list API (`getFundList` or `getFundMetricsListWeb`) SHALL be called
- **AND** the fund list SHALL be displayed within 2 seconds under normal network conditions

#### Scenario: Fund selection triggers detail loading
- **WHEN** user selects a fund from the list
- **THEN** performance comparison and comprehensive metrics APIs SHALL be called
- **AND** loading indicators SHALL be shown for each data section

#### Scenario: Detail panel expansion triggers analytics loading
- **WHEN** user expands the fund detail panel
- **THEN** factor risk, return attribution, and factor heatmap APIs SHALL be called on-demand
- **AND** each analytics section SHALL show independent loading states

### Requirement: Client-side Data Caching

The Fund page SHALL cache API responses to avoid redundant network requests.

#### Scenario: Cache hit for fund list
- **WHEN** user navigates away and returns to the fund page within 5 minutes
- **THEN** the cached fund list SHALL be displayed immediately
- **AND** no new API request SHALL be made for the fund list

#### Scenario: Cache hit for analytics data
- **WHEN** user re-selects a previously viewed fund within 30 minutes
- **THEN** cached analytics data SHALL be displayed immediately
- **AND** no new API requests SHALL be made for cached data

#### Scenario: Cache expiration
- **WHEN** cached data exceeds its TTL (5 min for list, 10 min for performance, 30 min for analytics)
- **THEN** the next data request SHALL fetch fresh data from the API
- **AND** the cache SHALL be updated with the new data

#### Scenario: Manual cache invalidation
- **WHEN** user clicks the refresh button
- **THEN** all cached data for the current view SHALL be invalidated
- **AND** fresh data SHALL be fetched from the API

### Requirement: Throttled Refresh Mechanism

The Fund page SHALL provide a manual refresh mechanism with rate limiting.

#### Scenario: Refresh button display
- **WHEN** the fund page is loaded
- **THEN** a refresh button SHALL be visible
- **AND** the button SHALL display the last update timestamp

#### Scenario: Refresh with cooldown
- **WHEN** user clicks the refresh button
- **THEN** data refresh SHALL be initiated
- **AND** the button SHALL be disabled for the cooldown period (3 seconds for light data, 10 seconds for heavy data)
- **AND** a countdown timer SHALL be displayed on the button

#### Scenario: Rapid refresh prevention
- **WHEN** user attempts to click refresh during cooldown
- **THEN** the click SHALL be ignored
- **AND** the remaining cooldown time SHALL continue to display

#### Scenario: Force refresh override
- **WHEN** user holds Shift key and clicks refresh
- **THEN** the cooldown SHALL be bypassed
- **AND** data SHALL be refreshed immediately

### Requirement: Data Freshness Indicators

The Fund page SHALL clearly communicate data freshness to users.

#### Scenario: Display last update time
- **WHEN** data is loaded or refreshed
- **THEN** the "Last updated" timestamp SHALL be updated
- **AND** the timestamp SHALL be displayed in relative format (e.g., "2 minutes ago")

#### Scenario: Stale data warning
- **WHEN** cached data is older than 50% of its TTL
- **THEN** a subtle visual indicator SHALL show the data may be stale
- **AND** hovering SHALL show the exact last update time

### Requirement: Loading State Management

The Fund page SHALL provide clear loading feedback for all data operations.

#### Scenario: Initial list loading
- **WHEN** fund list is loading
- **THEN** a loading spinner SHALL be displayed in the list area
- **AND** the page layout SHALL remain stable (no content jump)

#### Scenario: Partial data loading
- **WHEN** analytics data is loading while list data is available
- **THEN** the list SHALL remain interactive
- **AND** loading indicators SHALL only appear in the analytics sections

#### Scenario: Error state display
- **WHEN** any API request fails
- **THEN** an error message SHALL be displayed in the affected section
- **AND** a retry button SHALL be provided
- **AND** other sections SHALL continue to function normally
