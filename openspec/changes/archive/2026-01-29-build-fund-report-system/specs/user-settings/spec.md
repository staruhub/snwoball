## ADDED Requirements

### Requirement: Personal Information Management

The system SHALL allow users to manage their personal information.

#### Scenario: View personal info

- **WHEN** user navigates to 个人信息 page
- **THEN** system displays: 头像, 姓名, 手机号, 邮箱, 所属机构, 职位

#### Scenario: Upload avatar

- **WHEN** user uploads new avatar image
- **THEN** avatar is updated across the platform

#### Scenario: Update personal info

- **WHEN** user edits and saves personal information
- **THEN** changes are persisted to user profile

### Requirement: Account Settings

The system SHALL allow users to manage account settings.

#### Scenario: Change password

- **WHEN** user enters current password and new password
- **THEN** password is updated after validation

#### Scenario: Bind phone number

- **WHEN** user enters phone number and verification code
- **THEN** phone number is bound to account

#### Scenario: Bind email

- **WHEN** user enters email and clicks verification link
- **THEN** email is bound to account

#### Scenario: Security settings

- **WHEN** user views security settings
- **THEN** user can configure: two-factor authentication, login notifications

### Requirement: Preference Settings

The system SHALL allow users to configure default preferences.

#### Scenario: Default benchmark setting

- **WHEN** user sets default benchmark
- **THEN** new reports use this benchmark by default

#### Scenario: Default date range setting

- **WHEN** user sets default date range
- **THEN** new reports use this date range by default

#### Scenario: Default NAV type setting

- **WHEN** user sets default NAV type
- **THEN** new reports use this NAV type by default

#### Scenario: Interface theme setting

- **WHEN** user selects interface theme (浅色/深色)
- **THEN** platform UI updates to match selected theme

#### Scenario: Language setting

- **WHEN** user selects language
- **THEN** platform displays in selected language

#### Scenario: Notification settings

- **WHEN** user configures notification preferences
- **THEN** system respects settings for email and in-app notifications

### Requirement: Fund Following

The system SHALL allow users to follow funds for quick access.

#### Scenario: View followed funds

- **WHEN** user navigates to 我的关注 page
- **THEN** system displays list of followed funds

#### Scenario: Add fund to following

- **WHEN** user clicks follow button on a fund
- **THEN** fund appears in 我的关注 list

#### Scenario: Remove fund from following

- **WHEN** user clicks unfollow button on a followed fund
- **THEN** fund is removed from 我的关注 list

#### Scenario: Following in fund selector

- **WHEN** user opens fund selector in editor
- **THEN** "我的关注" tab shows all followed funds

### Requirement: Operation Logs

The system SHALL track user operations for audit purposes.

#### Scenario: View login history

- **WHEN** user navigates to 操作日志 page
- **THEN** system displays login records with: 时间, IP地址, 设备信息

#### Scenario: View report operations

- **WHEN** user views operation logs
- **THEN** system shows report create/edit/delete operations

#### Scenario: View export history

- **WHEN** user views operation logs
- **THEN** system shows export operations with file names and timestamps

### Requirement: Preference Persistence

The system SHALL persist user preferences across sessions.

#### Scenario: Load preferences on login

- **WHEN** user logs in
- **THEN** system applies user's saved preferences

#### Scenario: Sync preferences across devices

- **WHEN** user logs in on different device
- **THEN** same preferences are applied
