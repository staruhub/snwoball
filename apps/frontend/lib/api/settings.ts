/**
 * 用户设置 API
 */
import { fetchApiAuth, buildQueryParams } from "./config";

// ==================== 类型定义 ====================

export interface UserProfile {
  id: string;
  username: string | null;
  nickname: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  organization?: string | null;
  position?: string | null;
  status: number;
  is_superuser: boolean;
  create_time: string;
  update_time: string;
  roles: string[];
  permissions: string[];
}

export interface ProfileUpdateData {
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  organization?: string;
  position?: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  default_benchmark_id: string | null;
  default_date_range: string;
  default_nav_type: string;
  theme: "light" | "dark" | "system";
  language: string;
  notify_login: boolean;
  notify_report: boolean;
  notify_system: boolean;
  create_time: string;
  update_time: string | null;
}

export interface PreferencesUpdateData {
  default_benchmark_id?: string | null;
  default_date_range?: string;
  default_nav_type?: string;
  theme?: "light" | "dark" | "system";
  language?: string;
  notify_login?: boolean;
  notify_report?: boolean;
  notify_system?: boolean;
}

export interface LoginHistoryItem {
  id: string;
  login_time: string;
  ip_address: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  location: string | null;
  login_type: string;
  status: number;
}

export interface LoginHistoryResponse {
  total: number;
  page: number;
  page_size: number;
  items: LoginHistoryItem[];
}

export interface OperationLogItem {
  id: string;
  operation_type: string;
  resource_type: string | null;
  resource_id: string | null;
  resource_name: string | null;
  action: string | null;
  detail: string | null;
  ip_address: string | null;
  create_time: string;
}

export interface OperationLogResponse {
  total: number;
  page: number;
  page_size: number;
  items: OperationLogItem[];
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// ==================== 个人信息 API ====================

/**
 * 获取当前用户信息
 */
export async function getProfile(token: string): Promise<UserProfile> {
  return fetchApiAuth<UserProfile>("/api/v1/user/profile/me", token);
}

/**
 * 更新个人信息
 */
export async function updateProfile(
  token: string,
  data: ProfileUpdateData
): Promise<UserProfile> {
  return fetchApiAuth<UserProfile>("/api/v1/user/profile/me", token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 上传头像
 */
export async function uploadAvatar(
  token: string,
  file: File
): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003"}/api/v1/user/profile/avatar`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("上传头像失败");
  }

  const result = await response.json();
  return result.data;
}

/**
 * 修改密码
 */
export async function changePassword(
  token: string,
  data: ChangePasswordData
): Promise<{ success: boolean; message: string }> {
  return fetchApiAuth<{ success: boolean; message: string }>(
    "/api/v1/user/profile/change-password",
    token,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// ==================== 偏好设置 API ====================

/**
 * 获取偏好设置
 */
export async function getPreferences(token: string): Promise<UserPreferences> {
  return fetchApiAuth<UserPreferences>("/api/v1/user/preferences", token);
}

/**
 * 更新偏好设置
 */
export async function updatePreferences(
  token: string,
  data: PreferencesUpdateData
): Promise<UserPreferences> {
  return fetchApiAuth<UserPreferences>("/api/v1/user/preferences", token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ==================== 操作日志 API ====================

/**
 * 获取登录历史
 */
export async function getLoginHistory(
  token: string,
  params: { page?: number; page_size?: number } = {}
): Promise<LoginHistoryResponse> {
  const queryString = buildQueryParams({
    page: params.page || 1,
    page_size: params.page_size || 20,
  });
  return fetchApiAuth<LoginHistoryResponse>(
    `/api/v1/user/logs/login${queryString}`,
    token
  );
}

/**
 * 获取操作日志
 */
export async function getOperationLogs(
  token: string,
  params: { operation_type?: string; page?: number; page_size?: number } = {}
): Promise<OperationLogResponse> {
  const queryString = buildQueryParams({
    operation_type: params.operation_type,
    page: params.page || 1,
    page_size: params.page_size || 20,
  });
  return fetchApiAuth<OperationLogResponse>(
    `/api/v1/user/logs/operations${queryString}`,
    token
  );
}
