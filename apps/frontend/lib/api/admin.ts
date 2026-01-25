/**
 * Admin 管理 API
 */

import { fetchApiAuth, buildQueryParams } from "./config";

// ==================== 类型定义 ====================

export interface AdminUser {
  id: number;
  username: string;
  nickname: string | null;
  email: string | null;
  avatar: string | null;
  status: number;
  is_superuser: boolean;
  last_login_at: string | null;
  create_time: string | null;
  roles: string[];
}

export interface AdminUserListResponse {
  total: number;
  page: number;
  page_size: number;
  items: AdminUser[];
}

export interface CreateAdminUserRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  is_superuser?: boolean;
  role_ids?: number[];
}

export interface UpdateAdminUserRequest {
  nickname?: string;
  email?: string;
  avatar?: string;
  status?: number;
  is_superuser?: boolean;
  role_ids?: number[];
}

export interface Role {
  id: number;
  role_name: string;
  role_code: string;
  description: string | null;
  status: number;
  sort_order: number;
  user_count: number;
  create_time: string | null;
  permissions: string[];
}

export interface RoleListResponse {
  total: number;
  page: number;
  page_size: number;
  items: Role[];
}

export interface CreateRoleRequest {
  role_name: string;
  role_code: string;
  description?: string;
  sort_order?: number;
  permission_codes?: string[];
}

export interface UpdateRoleRequest {
  role_name?: string;
  description?: string;
  status?: number;
  sort_order?: number;
}

export interface ModulePermission {
  code: string;
  name: string;
}

export interface Module {
  id: number;
  module_name: string;
  module_code: string;
  description: string | null;
  icon: string | null;
  path: string | null;
  parent_id: number | null;
  level: number;
  status: number;
  sort_order: number;
  is_visible: boolean;
  permissions: ModulePermission[];
  children: Module[];
}

export interface ModuleTreeResponse {
  items: Module[];
}

export interface UpdateModuleRequest {
  module_name?: string;
  description?: string;
  icon?: string;
  path?: string;
  status?: number;
  sort_order?: number;
  is_visible?: boolean;
  permissions?: ModulePermission[];
}

export interface AdminTemplate {
  id: number;
  template_name: string;
  template_code: string;
  template_type: string;
  description: string | null;
  preview_image: string | null;
  status: number;
  is_default: boolean;
  version: string;
  create_time: string | null;
  publish_time: string | null;
}

export interface AdminTemplateDetail extends AdminTemplate {
  content: string | null;
  config: Record<string, unknown> | null;
}

export interface AdminTemplateListResponse {
  total: number;
  page: number;
  page_size: number;
  items: AdminTemplate[];
}

export interface CreateAdminTemplateRequest {
  template_name: string;
  template_code: string;
  template_type: string;
  description?: string;
  content?: string;
  config?: Record<string, unknown>;
  preview_image?: string;
}

export interface UpdateAdminTemplateRequest {
  template_name?: string;
  description?: string;
  content?: string;
  config?: Record<string, unknown>;
  preview_image?: string;
  is_default?: boolean;
}

export interface ConfigItem {
  id: number;
  config_key: string;
  config_value: string | null;
  config_type: string;
  group_name: string;
  description: string | null;
  is_public: boolean;
  is_readonly: boolean;
  update_time: string | null;
}

export interface ConfigGroup {
  group_name: string;
  items: ConfigItem[];
}

export interface SystemConfigResponse {
  groups: ConfigGroup[];
}

// ==================== 用户管理 API ====================

export async function getAdminUsers(
  token: string,
  params: {
    page?: number;
    page_size?: number;
    keyword?: string;
    status?: number;
  } = {}
): Promise<AdminUserListResponse> {
  const query = buildQueryParams(params);
  return fetchApiAuth<AdminUserListResponse>(`/api/v1/admin/users${query}`, token);
}

export async function getAdminUser(token: string, userId: number): Promise<AdminUser> {
  return fetchApiAuth<AdminUser>(`/api/v1/admin/users/${userId}`, token);
}

export async function createAdminUser(
  token: string,
  data: CreateAdminUserRequest
): Promise<AdminUser> {
  return fetchApiAuth<AdminUser>("/api/v1/admin/users", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(
  token: string,
  userId: number,
  data: UpdateAdminUserRequest
): Promise<AdminUser> {
  return fetchApiAuth<AdminUser>(`/api/v1/admin/users/${userId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateAdminUserStatus(
  token: string,
  userId: number,
  status: number
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(
    `/api/v1/admin/users/${userId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export async function deleteAdminUser(
  token: string,
  userId: number
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(`/api/v1/admin/users/${userId}`, token, {
    method: "DELETE",
  });
}

export async function resetAdminPassword(
  token: string,
  userId: number
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(
    `/api/v1/admin/users/${userId}/reset-password`,
    token,
    {
      method: "POST",
    }
  );
}

// ==================== 角色管理 API ====================

export async function getRoles(
  token: string,
  params: {
    page?: number;
    page_size?: number;
    keyword?: string;
    status?: number;
  } = {}
): Promise<RoleListResponse> {
  const query = buildQueryParams(params);
  return fetchApiAuth<RoleListResponse>(`/api/v1/admin/roles${query}`, token);
}

export async function getAllRoles(token: string): Promise<Role[]> {
  return fetchApiAuth<Role[]>("/api/v1/admin/roles/all", token);
}

export async function getRole(token: string, roleId: number): Promise<Role> {
  return fetchApiAuth<Role>(`/api/v1/admin/roles/${roleId}`, token);
}

export async function createRole(
  token: string,
  data: CreateRoleRequest
): Promise<Role> {
  return fetchApiAuth<Role>("/api/v1/admin/roles", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRole(
  token: string,
  roleId: number,
  data: UpdateRoleRequest
): Promise<Role> {
  return fetchApiAuth<Role>(`/api/v1/admin/roles/${roleId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateRolePermissions(
  token: string,
  roleId: number,
  permissionCodes: string[]
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(
    `/api/v1/admin/roles/${roleId}/permissions`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({ permission_codes: permissionCodes }),
    }
  );
}

export async function deleteRole(
  token: string,
  roleId: number
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(`/api/v1/admin/roles/${roleId}`, token, {
    method: "DELETE",
  });
}

// ==================== 模块管理 API ====================

export async function getModuleTree(
  token: string,
  includeHidden: boolean = false
): Promise<ModuleTreeResponse> {
  const query = buildQueryParams({ include_hidden: includeHidden });
  return fetchApiAuth<ModuleTreeResponse>(`/api/v1/admin/modules${query}`, token);
}

export async function getModule(token: string, moduleId: number): Promise<Module> {
  return fetchApiAuth<Module>(`/api/v1/admin/modules/${moduleId}`, token);
}

export async function updateModule(
  token: string,
  moduleId: number,
  data: UpdateModuleRequest
): Promise<Module> {
  return fetchApiAuth<Module>(`/api/v1/admin/modules/${moduleId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateModuleSort(
  token: string,
  moduleOrders: { id: number; sort_order: number; parent_id?: number }[]
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>("/api/v1/admin/modules/sort", token, {
    method: "PUT",
    body: JSON.stringify({ module_orders: moduleOrders }),
  });
}

export async function getAllPermissions(
  token: string
): Promise<
  {
    module_id: number;
    module_name: string;
    module_code: string;
    permission_code: string;
    permission_name: string;
  }[]
> {
  return fetchApiAuth("/api/v1/admin/permissions", token);
}

// ==================== 模板管理 API ====================

export async function getAdminTemplates(
  token: string,
  params: {
    page?: number;
    page_size?: number;
    keyword?: string;
    template_type?: string;
    status?: number;
  } = {}
): Promise<AdminTemplateListResponse> {
  const query = buildQueryParams(params);
  return fetchApiAuth<AdminTemplateListResponse>(`/api/v1/admin/templates${query}`, token);
}

export async function getAdminTemplate(
  token: string,
  templateId: number
): Promise<AdminTemplateDetail> {
  return fetchApiAuth<AdminTemplateDetail>(`/api/v1/admin/templates/${templateId}`, token);
}

export async function createAdminTemplate(
  token: string,
  data: CreateAdminTemplateRequest
): Promise<AdminTemplateDetail> {
  return fetchApiAuth<AdminTemplateDetail>("/api/v1/admin/templates", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminTemplate(
  token: string,
  templateId: number,
  data: UpdateAdminTemplateRequest
): Promise<AdminTemplateDetail> {
  return fetchApiAuth<AdminTemplateDetail>(`/api/v1/admin/templates/${templateId}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function publishAdminTemplate(
  token: string,
  templateId: number,
  action: "publish" | "unpublish"
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(
    `/api/v1/admin/templates/${templateId}/publish`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ action }),
    }
  );
}

export async function deleteAdminTemplate(
  token: string,
  templateId: number
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>(
    `/api/v1/admin/templates/${templateId}`,
    token,
    {
      method: "DELETE",
    }
  );
}

// ==================== 系统配置 API ====================

export async function getSystemConfig(token: string): Promise<SystemConfigResponse> {
  return fetchApiAuth<SystemConfigResponse>("/api/v1/admin/config", token);
}

export async function getConfigByKey(
  token: string,
  configKey: string
): Promise<ConfigItem> {
  return fetchApiAuth<ConfigItem>(`/api/v1/admin/config/${configKey}`, token);
}

export async function updateConfig(
  token: string,
  configKey: string,
  configValue: string
): Promise<ConfigItem> {
  return fetchApiAuth<ConfigItem>(`/api/v1/admin/config/${configKey}`, token, {
    method: "PUT",
    body: JSON.stringify({ config_value: configValue }),
  });
}

export async function batchUpdateConfigs(
  token: string,
  configs: { config_key: string; config_value: string }[]
): Promise<{ message: string }> {
  return fetchApiAuth<{ message: string }>("/api/v1/admin/config/batch", token, {
    method: "POST",
    body: JSON.stringify({ configs }),
  });
}

export async function getPublicConfig(): Promise<Record<string, unknown>> {
  const response = await fetch("/api/v1/admin/config/public");
  if (!response.ok) {
    throw new Error("Failed to fetch public config");
  }
  return response.json();
}
