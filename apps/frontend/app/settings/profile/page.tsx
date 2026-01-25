"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileForm, AvatarUpload } from "@/components/features/settings";
import { useUserStore } from "@/stores";
import { getProfile, UserProfile } from "@/lib/api/settings";

export default function ProfilePage() {
  const { token, profile, setProfile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("请先登录");
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "获取个人信息失败");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, setProfile]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: avatarUrl });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile || !token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">请先登录</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">个人信息</h1>
        <p className="text-[var(--muted-foreground)]">管理您的个人资料信息</p>
      </div>

      {/* 头像卡片 */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">头像</h2>
        <AvatarUpload
          currentAvatar={profile.avatar}
          token={token}
          onUpdate={handleAvatarUpdate}
        />
      </Card>

      {/* 基本信息卡片 */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">基本信息</h2>
        <ProfileForm
          profile={profile}
          token={token}
          onUpdate={handleProfileUpdate}
        />
      </Card>
    </div>
  );
}
