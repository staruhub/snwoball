## ADDED Requirements

### Requirement: User Management

The system SHALL allow administrators to manage users.

#### Scenario: View user list

- **WHEN** admin navigates to user management
- **THEN** system displays list of all users with: username, email, role, status, created date

#### Scenario: Add user

- **WHEN** admin clicks "添加用户" and fills form
- **THEN** new user account is created

#### Scenario: Edit user

- **WHEN** admin clicks "编辑" on a user
- **THEN** admin can modify user information and role

#### Scenario: Assign permissions

- **WHEN** admin configures user permissions
- **THEN** user's access rights are updated

#### Scenario: Disable user

- **WHEN** admin clicks "禁用" on a user
- **THEN** user cannot log in until re-enabled

#### Scenario: Enable user

- **WHEN** admin clicks "启用" on a disabled user
- **THEN** user can log in again

### Requirement: Role Management

The system SHALL allow administrators to manage roles.

#### Scenario: View role list

- **WHEN** admin navigates to role management
- **THEN** system displays list of all roles

#### Scenario: Create role

- **WHEN** admin clicks "创建角色" and fills form
- **THEN** new role is created

#### Scenario: Configure role permissions

- **WHEN** admin edits role permissions
- **THEN** role's permission set is updated
- **AND** all users with that role inherit new permissions

### Requirement: Module Management

The system SHALL allow administrators to manage analysis modules.

#### Scenario: View module list

- **WHEN** admin navigates to module management
- **THEN** system displays list of all available modules

#### Scenario: Enable module

- **WHEN** admin enables a module
- **THEN** module appears in report editor navigation

#### Scenario: Disable module

- **WHEN** admin disables a module
- **THEN** module is hidden from report editor navigation

#### Scenario: Reorder modules

- **WHEN** admin reorders modules
- **THEN** modules appear in new order in navigation

#### Scenario: Configure custom module

- **WHEN** admin configures custom module settings
- **THEN** custom module behavior is updated

### Requirement: System Template Management

The system SHALL allow administrators to manage system templates.

#### Scenario: View system template list

- **WHEN** admin navigates to system template management
- **THEN** system displays list of all system templates

#### Scenario: Create system template

- **WHEN** admin clicks "创建系统模板" and configures template
- **THEN** new system template is created

#### Scenario: Edit system template

- **WHEN** admin edits a system template
- **THEN** template configuration is updated

#### Scenario: Publish template

- **WHEN** admin clicks "上架" on a template
- **THEN** template becomes visible to all users

#### Scenario: Unpublish template

- **WHEN** admin clicks "下架" on a template
- **THEN** template is hidden from users

### Requirement: System Configuration

The system SHALL allow administrators to configure system settings.

#### Scenario: Data source configuration

- **WHEN** admin configures data source settings
- **THEN** system uses configured data source for fund data

#### Scenario: Export configuration

- **WHEN** admin configures export settings
- **THEN** export defaults and options are updated

#### Scenario: Watermark settings

- **WHEN** admin configures watermark settings
- **THEN** exported reports include configured watermark

#### Scenario: Log configuration

- **WHEN** admin configures logging settings
- **THEN** system logging behavior is updated
