'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { adminLogin } from '@/lib/api/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setToken, setProfile, isAuthenticated } = useUserStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 如果已登录，重定向到 Admin 首页
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin({
        username: formData.username,
        password: formData.password,
      });

      // 保存 token 和用户信息
      setToken(response.access_token);
      setProfile({
        id: String(response.user.id),
        username: response.user.username,
        nickname: response.user.nickname || response.user.username,
        email: response.user.email,
        phone: null,
        avatar: response.user.avatar,
        status: 1,
        is_superuser: response.user.is_superuser,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        roles: response.user.roles || [],
        permissions: [],
      });

      // 跳转到 Admin 首页
      router.push('/admin');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '登录失败，请检查用户名和密码';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md p-8">
        <div className="bg-[var(--card)] border border-[var(--border)] p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Admin Login
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              请登录管理后台
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名"
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码"
                  className="w-full px-4 py-2.5 pr-10 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  登录
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
