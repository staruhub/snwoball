"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  refreshToken as refreshTokenApi,
  getCurrentUser,
  type UserLoginRequest,
  type UserRegisterRequest,
  type UserInfo,
  type TokenResponse,
} from "@/lib/api/auth";

// ==================== 常量 ====================

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";
const TOKEN_EXPIRES_KEY = "token_expires_at";

// Token 刷新提前量（秒）
const TOKEN_REFRESH_THRESHOLD = 60;

// ==================== 类型定义 ====================

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (data: UserLoginRequest) => Promise<void>;
  register: (data: UserRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ==================== 存储工具函数 ====================

function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

function getStoredUser(): UserInfo | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_INFO_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserInfo;
  } catch {
    return null;
  }
}

function storeTokens(tokens: TokenResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  // 存储过期时间
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
}

function storeUser(user: UserInfo): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
}

function clearStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
}

function isTokenExpiringSoon(): boolean {
  if (typeof window === "undefined") return false;
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
  if (!expiresAt) return true;
  const expiresAtMs = parseInt(expiresAt, 10);
  return Date.now() > expiresAtMs - TOKEN_REFRESH_THRESHOLD * 1000;
}

// ==================== useAuth Hook ====================

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // 刷新 Token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false;

    const { refreshToken } = getStoredTokens();
    if (!refreshToken) return false;

    isRefreshingRef.current = true;

    try {
      const tokens = await refreshTokenApi(refreshToken);
      storeTokens(tokens);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearStorage();
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        error: null,
      }));
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // 设置 Token 自动刷新
  const setupTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // 每 30 秒检查一次是否需要刷新
    refreshTimerRef.current = setInterval(async () => {
      const { accessToken } = getStoredTokens();
      if (!accessToken) return;

      if (isTokenExpiringSoon()) {
        await refreshAccessToken();
      }
    }, 30000);
  }, [refreshAccessToken]);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      const { accessToken, refreshToken } = getStoredTokens();
      const storedUser = getStoredUser();

      if (!accessToken || !refreshToken) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      // 检查是否需要刷新 Token
      if (isTokenExpiringSoon()) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }
      }

      // 如果有缓存的用户信息，先使用它
      if (storedUser) {
        setState({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        setupTokenRefresh();

        // 后台刷新用户信息
        const { accessToken: newToken } = getStoredTokens();
        if (newToken) {
          getCurrentUser(newToken)
            .then((user) => {
              storeUser(user);
              setState((prev) => ({ ...prev, user }));
            })
            .catch(console.error);
        }
        return;
      }

      // 获取用户信息
      try {
        const { accessToken: currentToken } = getStoredTokens();
        if (currentToken) {
          const user = await getCurrentUser(currentToken);
          storeUser(user);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          setupTokenRefresh();
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        clearStorage();
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initAuth();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshAccessToken, setupTokenRefresh]);

  // 登录
  const login = useCallback(
    async (data: UserLoginRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const tokens = await loginApi(data);
        storeTokens(tokens);

        const user = await getCurrentUser(tokens.access_token);
        storeUser(user);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        setupTokenRefresh();
        router.push("/workspace");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "登录失败，请检查账号密码";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [router, setupTokenRefresh]
  );

  // 注册
  const register = useCallback(
    async (data: UserRegisterRequest) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        await registerApi(data);
        // 注册成功后自动登录
        await login({ phone: data.phone, password: data.password });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "注册失败，请稍后重试";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [login]
  );

  // 登出
  const logout = useCallback(async () => {
    const { refreshToken } = getStoredTokens();

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch (error) {
        console.error("Logout API failed:", error);
      }
    }

    clearStorage();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    router.push("/login");
  }, [router]);

  // 清除错误
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
  };
}

// ==================== useRequireAuth Hook ====================

/**
 * 路由守卫 Hook
 * 用于需要登录才能访问的页面
 */
export function useRequireAuth(redirectTo: string = "/login"): AuthState {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { accessToken, refreshToken } = getStoredTokens();

      if (!accessToken || !refreshToken) {
        router.replace(redirectTo);
        return;
      }

      // 检查是否需要刷新 Token
      if (isTokenExpiringSoon()) {
        try {
          const tokens = await refreshTokenApi(refreshToken);
          storeTokens(tokens);
        } catch {
          clearStorage();
          router.replace(redirectTo);
          return;
        }
      }

      // 获取用户信息
      try {
        const { accessToken: currentToken } = getStoredTokens();
        if (currentToken) {
          const user = await getCurrentUser(currentToken);
          storeUser(user);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } catch {
        clearStorage();
        router.replace(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  return state;
}

// ==================== 获取 Token 工具函数 ====================

/**
 * 获取当前有效的 access token
 * 如果 token 即将过期，会尝试刷新
 */
export async function getAccessToken(): Promise<string | null> {
  const { accessToken, refreshToken } = getStoredTokens();

  if (!accessToken) return null;

  if (isTokenExpiringSoon() && refreshToken) {
    try {
      const tokens = await refreshTokenApi(refreshToken);
      storeTokens(tokens);
      return tokens.access_token;
    } catch {
      clearStorage();
      return null;
    }
  }

  return accessToken;
}
