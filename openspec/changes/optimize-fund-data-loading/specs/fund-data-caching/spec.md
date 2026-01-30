## ADDED Requirements

### Requirement: API Response Caching

The system SHALL provide a caching mechanism for API responses to reduce redundant network requests.

#### Scenario: Cache hit within TTL

- **WHEN** a cached API response exists and is within its TTL
- **THEN** the system returns the cached data immediately without making a network request

#### Scenario: Cache miss or expired

- **WHEN** no cached response exists or the cache has expired
- **THEN** the system makes a network request and caches the response

#### Scenario: Background revalidation

- **WHEN** cached data is returned and is stale (past soft TTL but within hard TTL)
- **THEN** the system triggers a background request to refresh the cache without blocking the UI

### Requirement: Request Deduplication

The system SHALL deduplicate concurrent requests for the same resource.

#### Scenario: Multiple concurrent requests for same resource

- **WHEN** multiple components request the same API endpoint with identical parameters simultaneously
- **THEN** the system makes only one network request and shares the result with all requesters

#### Scenario: Sequential requests within dedup window

- **WHEN** a request is made while an identical request is in flight
- **THEN** the system returns the pending promise instead of making a new request

### Requirement: Cache Invalidation

The system SHALL provide mechanisms to invalidate cached data.

#### Scenario: Manual cache invalidation by key

- **WHEN** `invalidate(key)` is called with a specific cache key
- **THEN** the system removes that entry from the cache

#### Scenario: Global cache clear

- **WHEN** `invalidateAll()` is called
- **THEN** the system clears all cached entries

#### Scenario: Cache size limit enforcement

- **WHEN** the cache exceeds the maximum number of entries (50)
- **THEN** the system evicts the least recently used entries

### Requirement: Fund Data Hooks

The system SHALL provide React hooks for accessing fund-related data with built-in caching.

#### Scenario: Fetch public funds list

- **WHEN** `useFunds({ page, pageSize, keyword })` is called
- **THEN** the system returns `{ data, isLoading, error, refetch }` with cached fund list data

#### Scenario: Fetch benchmarks

- **WHEN** `useBenchmarks()` is called
- **THEN** the system returns `{ data, isLoading, error }` with cached benchmark list

#### Scenario: Fetch fund profile

- **WHEN** `useFundProfile(fundId)` is called
- **THEN** the system returns `{ data, isLoading, error }` with cached fund profile data

### Requirement: Search with Abort Support

The system SHALL support cancelling in-flight search requests to prevent race conditions.

#### Scenario: Cancel previous search on new input

- **WHEN** user types a new search query while a previous search is in flight
- **THEN** the system aborts the previous request before starting the new one

#### Scenario: Debounced search

- **WHEN** user types rapidly in the search input
- **THEN** the system waits for 300ms of inactivity before making the API request

#### Scenario: Search hook interface

- **WHEN** `useSearchFunds(keyword)` is called
- **THEN** the system returns `{ results, isSearching, error }` with automatic debouncing and abort handling
