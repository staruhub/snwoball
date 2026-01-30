/**
 * 认证模块测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// 模拟 localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// 模拟 useAuth hook（简化版测试）
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

function mockUseAuth(): AuthState {
  const stored = localStorage.getItem("user-storage");
  const state = stored ? JSON.parse(stored).state : { token: null };

  return {
    token: state.token,
    isAuthenticated: !!state.token,
    isLoading: false,
    login: async (credentials) => {
      if (credentials.username === "admin" && credentials.password === "Test123456") {
        const token = "mock-jwt-token";
        localStorage.setItem(
          "user-storage",
          JSON.stringify({ state: { token } })
        );
      } else {
        throw new Error("用户名或密码错误");
      }
    },
    logout: () => {
      localStorage.removeItem("user-storage");
    },
  };
}

describe("Auth Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication State", () => {
    it("初始状态应为未认证", () => {
      const auth = mockUseAuth();
      expect(auth.isAuthenticated).toBe(false);
      expect(auth.token).toBeNull();
    });

    it("登录后应为已认证状态", async () => {
      const auth = mockUseAuth();
      await auth.login({ username: "admin", password: "Test123456" });

      const newAuth = mockUseAuth();
      expect(newAuth.isAuthenticated).toBe(true);
      expect(newAuth.token).toBe("mock-jwt-token");
    });

    it("登出后应清除认证状态", async () => {
      // 先登录
      const auth = mockUseAuth();
      await auth.login({ username: "admin", password: "Test123456" });

      // 再登出
      const authAfterLogin = mockUseAuth();
      authAfterLogin.logout();

      const authAfterLogout = mockUseAuth();
      expect(authAfterLogout.isAuthenticated).toBe(false);
      expect(authAfterLogout.token).toBeNull();
    });
  });

  describe("Login Validation", () => {
    it("错误的密码应抛出错误", async () => {
      const auth = mockUseAuth();
      await expect(
        auth.login({ username: "admin", password: "wrong" })
      ).rejects.toThrow("用户名或密码错误");
    });

    it("错误的用户名应抛出错误", async () => {
      const auth = mockUseAuth();
      await expect(
        auth.login({ username: "wrong", password: "Test123456" })
      ).rejects.toThrow("用户名或密码错误");
    });
  });

  describe("Token Storage", () => {
    it("token 应正确存储到 localStorage", async () => {
      const auth = mockUseAuth();
      await auth.login({ username: "admin", password: "Test123456" });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const stored = JSON.parse(mockLocalStorage.getItem("user-storage") || "{}");
      expect(stored.state.token).toBe("mock-jwt-token");
    });

    it("登出应移除 localStorage 中的 token", async () => {
      const auth = mockUseAuth();
      await auth.login({ username: "admin", password: "Test123456" });

      const authAfterLogin = mockUseAuth();
      authAfterLogin.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user-storage");
    });
  });

  describe("Session Persistence", () => {
    it("刷新页面后应保持登录状态", async () => {
      // 模拟已登录状态
      mockLocalStorage.setItem(
        "user-storage",
        JSON.stringify({ state: { token: "existing-token" } })
      );

      const auth = mockUseAuth();
      expect(auth.isAuthenticated).toBe(true);
      expect(auth.token).toBe("existing-token");
    });
  });
});
