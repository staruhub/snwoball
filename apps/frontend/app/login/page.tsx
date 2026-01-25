'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, AlertCircle, Phone } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { userLogin } from '@/lib/api/auth';

// 手机号验证正则
const PHONE_REGEX = /^1[3-9]\d{9}$/;

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setProfile, isAuthenticated } = useUserStore();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 如果已登录，重定向到工作台
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/workspace');
    }
  }, [isAuthenticated, router]);

  const validatePhone = (phone: string): boolean => {
    return PHONE_REGEX.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.phone || !formData.password) {
      setError('请输入手机号和密码');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('请输入正确的手机号格式');
      return;
    }

    setLoading(true);
    try {
      const response = await userLogin({
        phone: formData.phone,
        password: formData.password,
      });

      // 保存 token 和用户信息
      setToken(response.access_token);
      setProfile({
        id: String(response.user.id),
        username: response.user.phone,
        nickname: response.user.nickname || response.user.phone,
        email: response.user.email,
        phone: response.user.phone,
        avatar: response.user.avatar,
        status: response.user.status,
        is_superuser: false,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        roles: [],
        permissions: [],
      });

      // 跳转到工作台
      router.push('/workspace');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '登录失败，请检查手机号和密码';
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
              用户登录
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              登录您的账户以继续
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
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={11}
                />
              </div>
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

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            还没有账户？{' '}
            <Link
              href="/register"
              className="text-[var(--primary)] hover:underline"
            >
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
