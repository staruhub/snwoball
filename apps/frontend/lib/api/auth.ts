/**
 * 认证 API
 */

import { fetchApi, fetchApiAuth, fetchWebApi, fetchWebApiAuth } from './config';

// ==================== 类型定义 ====================

// 管理员认证类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    nickname: string | null;
    email: string | null;
    avatar: string | null;
    is_superuser: boolean;
    roles: string[];
  };
}

export interface LogoutResponse {
  message: string;
}

// 普通用户认证类型
export interface UserLoginRequest {
  phone: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    phone: string;
    nickname: string | null;
    email: string | null;
    avatar: string | null;
    status: number;
  };
}

export interface UserRegisterRequest {
  phone: string;
  password: string;
  invite_code?: string;
  username?: string;
  nickname?: string;
  email?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  id: number;
  phone: string | null;
  username: string | null;
  nickname: string | null;
  email: string | null;
  avatar: string | null;
  status: number;
  is_superuser: boolean;
  create_time: string | null;
  update_time: string | null;
  roles: string[];
  permissions: string[];
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface CaptchaResponse {
  captcha_id: string;
  background_image: string;
  slider_image: string;
  y_position: number;
}

export interface CaptchaVerifyRequest {
  captcha_id: string;
  x_position: number;
}

export interface CaptchaVerifyResponse {
  success: boolean;
  message: string;
  token: string | null;
}

// ==================== 管理员认证 API ====================

/**
 * 管理员登录
 */
export async function adminLogin(data: LoginRequest): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/api/v1/admin-auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 管理员登出
 */
export async function adminLogout(token: string): Promise<LogoutResponse> {
  return fetchApiAuth<LogoutResponse>('/api/v1/admin-auth/logout', token, {
    method: 'POST',
  });
}

/**
 * 获取当前管理员信息
 */
export async function getAdminUser(token: string): Promise<LoginResponse['user']> {
  return fetchApiAuth<LoginResponse['user']>('/api/v1/admin-auth/me', token);
}

/**
 * 刷新管理员 Token
 */
export async function refreshAdminToken(token: string): Promise<{ access_token: string }> {
  return fetchApiAuth<{ access_token: string }>('/api/v1/admin-auth/refresh', token, {
    method: 'POST',
  });
}

// ==================== 普通用户认证 API ====================

/**
 * 用户登录
 */
export async function login(data: UserLoginRequest): Promise<TokenResponse> {
  return fetchApi<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 用户注册
 */
export async function register(data: UserRegisterRequest): Promise<UserInfo> {
  return fetchApi<UserInfo>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 刷新 Token
 */
export async function refreshToken(refresh_token: string): Promise<TokenResponse> {
  return fetchApi<TokenResponse>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

/**
 * 用户登出
 */
export async function logout(refresh_token: string): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>("/api/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(token: string): Promise<UserInfo> {
  return fetchApiAuth<UserInfo>("/api/v1/auth/me", token);
}

/**
 * 修改密码
 */
export async function changePassword(
  token: string,
  data: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> {
  return fetchApiAuth<{ success: boolean; message: string }>(
    "/api/v1/auth/change-password",
    token,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/**
 * 生成验证码
 */
export async function generateCaptcha(): Promise<CaptchaResponse> {
  return fetchApi<CaptchaResponse>("/api/v1/auth/captcha/generate");
}

/**
 * 验证验证码
 */
export async function verifyCaptcha(data: CaptchaVerifyRequest): Promise<CaptchaVerifyResponse> {
  return fetchApi<CaptchaVerifyResponse>("/api/v1/auth/captcha/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ==================== Web API 用户认证（备用） ====================

/**
 * 普通用户登录（手机号 + 密码）- Web API
 */
export async function userLogin(data: UserLoginRequest): Promise<UserLoginResponse> {
  return fetchWebApi<UserLoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 普通用户注册（返回 token）- Web API
 */
export async function userRegister(data: UserRegisterRequest): Promise<TokenResponse> {
  return fetchWebApi<TokenResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 普通用户登出 - Web API
 */
export async function userLogout(token: string): Promise<LogoutResponse> {
  return fetchWebApiAuth<LogoutResponse>('/api/v1/auth/logout', token, {
    method: 'POST',
  });
}

/**
 * 获取当前普通用户信息 - Web API
 */
export async function getUserProfile(token: string): Promise<UserLoginResponse['user']> {
  return fetchWebApiAuth<UserLoginResponse['user']>('/api/v1/auth/me', token);
}
