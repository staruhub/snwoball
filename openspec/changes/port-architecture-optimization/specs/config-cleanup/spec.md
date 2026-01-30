## ADDED Requirements

### Requirement: 前端环境变量使用统一端口

前端环境变量 `NEXT_PUBLIC_SNOWBALL_URL` SHALL 使用 `localhost:3000` 而非 `localhost:3010`。

#### Scenario: 开发环境配置

- **WHEN** 开发者启动前端开发服务器
- **THEN** iframe 嵌入应使用 `http://localhost:3000` 作为 Snowball URL

### Requirement: CORS 配置移除冗余端口

Web API 的 CORS 配置 SHALL 不包含 `localhost:3010`。

#### Scenario: CORS origins 列表

- **WHEN** 检查 `application-local.yaml` 的 `cors_origins` 配置
- **THEN** 配置列表应包含 `localhost:3000` 和 `localhost:5173`，但不包含 `localhost:3010`

### Requirement: 未使用的模型代码被清理

`apps/backend/modules/admin/models/admin_models.py` 文件 SHALL 被删除，因为其中的模型未被任何代码引用。

#### Scenario: 验证无代码引用

- **WHEN** 在项目中搜索 `admin_models.py` 中定义的模型类名（Role, RolePermission, UserRole, SystemModule）
- **THEN** 除了该文件本身外，不应有其他引用

#### Scenario: 文件删除后项目正常

- **WHEN** 删除 `apps/backend/modules/admin/models/admin_models.py` 文件后启动服务
- **THEN** Admin API 和 Web API 应正常启动，无导入错误
