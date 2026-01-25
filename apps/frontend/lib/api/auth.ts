/**
 * 认证 API
 */

import { fetchApi, fetchApiAuth, fetchWebApi, fetchWebApiAuth } from './config';

// ==================== 类型定义 ====================

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

// ==================== 普通用户认证类型 ====================

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
}

// 注册接口返回的是 TokenResponse（不含 user）
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// ==================== 认证 API ====================

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
 * 获取当前用户信息
 */
export async function getCurrentUser(token: string): Promise<LoginResponse['user']> {
  return fetchApiAuth<LoginResponse['user']>('/api/v1/admin-auth/me', token);
}

/**
 * 刷新 Token
 */
export async function refreshToken(token: string): Promise<{ access_token: string }> {
  return fetchApiAuth<{ access_token: string }>('/api/v1/admin-auth/refresh', token, {
    method: 'POST',
  });
}

// ==================== 普通用户认证 API ====================

/**
 * 普通用户登录（手机号 + 密码）
 */
export async function userLogin(data: UserLoginRequest): Promise<UserLoginResponse> {
  return fetchWebApi<UserLoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 普通用户注册（返回 token，需要单独获取用户信息）
 */
export async function userRegister(data: UserRegisterRequest): Promise<TokenResponse> {
  return fetchWebApi<TokenResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 普通用户登出
 */
export async function userLogout(token: string): Promise<LogoutResponse> {
  return fetchWebApiAuth<LogoutResponse>('/api/v1/auth/logout', token, {
    method: 'POST',
  });
}

/**
 * 获取当前普通用户信息
 */
export async function getUserProfile(token: string): Promise<UserLoginResponse['user']> {
  return fetchWebApiAuth<UserLoginResponse['user']>('/api/v1/auth/me', token);
}
