## MODIFIED Requirements

### Requirement: Fund Type Classification

The fund data transformation logic in `index.tsx` SHALL correctly classify fund types based on both the entry type and group selection.

#### Scenario: Public fund in public group
- **WHEN** user is in public fund entry (`type !== 'self-selected'` OR `selectedGroupId !== 'portfolio'`)
- **AND** the fund data is loaded
- **THEN** the fund's `fundType` SHALL be determined by the backend `fund_type` field mapping
- **AND** the fund SHALL NOT be classified as '组合基金'

#### Scenario: Portfolio fund in self-selected portfolio group
- **WHEN** user is in self-selected entry (`type === 'self-selected'`)
- **AND** user is in portfolio group (`selectedGroupId === 'portfolio'`)
- **AND** the fund data is loaded
- **THEN** the fund's `fundType` SHALL be set to '组合基金'

### Requirement: Portfolio Fund API Error Handling

The `FundDetailPanel` component SHALL handle portfolio fund API errors gracefully with automatic fallback.

#### Scenario: Portfolio API returns 404
- **WHEN** `itemType === 'portfolio'` is passed to `FundDetailPanel`
- **AND** the portfolio fund API returns 404 status
- **THEN** the system SHALL log a warning message
- **AND** the system SHALL automatically fallback to call the regular fund detail API
- **AND** the fund detail SHALL be displayed using the fallback data

#### Scenario: Portfolio API succeeds
- **WHEN** `itemType === 'portfolio'` is passed to `FundDetailPanel`
- **AND** the fund is a valid portfolio fund
- **AND** the portfolio fund API returns successfully
- **THEN** the portfolio fund detail SHALL be displayed normally

## ADDED Requirements

### Requirement: Fund Group Cache Isolation

The fund data cache SHALL be properly isolated between different fund groups to prevent data pollution.

#### Scenario: User switches from portfolio group to public group
- **WHEN** user is in self-selected entry with portfolio group
- **AND** user switches to public fund group
- **THEN** the cache for the public group SHALL be cleared before fetching new data
- **AND** the newly fetched public funds SHALL NOT have incorrect fundType values from the previous group

#### Scenario: User switches between different fund groups
- **WHEN** user changes `selectedGroupId`
- **THEN** the cache entry for the new group SHALL be deleted from `dataCacheRef`
- **AND** fresh data SHALL be fetched from the API
- **AND** the fund list SHALL be reset to page 1
