"use client";

import { useState } from "react";
import { FormField, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserProfile, ProfileUpdateData, updateProfile } from "@/lib/api/settings";

interface ProfileFormProps {
  profile: UserProfile;
  token: string;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfileForm({ profile, token, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    username: profile.username || "",
    nickname: profile.nickname || "",
    email: profile.email || "",
    phone: profile.phone || "",
    organization: profile.organization || "",
    position: profile.position || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (field: keyof ProfileUpdateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 只发送有变化的字段
      const changedFields: ProfileUpdateData = {};
      if (formData.username !== profile.username) changedFields.username = formData.username;
      if (formData.nickname !== profile.nickname) changedFields.nickname = formData.nickname;
      if (formData.email !== profile.email) changedFields.email = formData.email;
      if (formData.phone !== profile.phone) changedFields.phone = formData.phone;
      if (formData.organization !== profile.organization) changedFields.organization = formData.organization;
      if (formData.position !== profile.position) changedFields.position = formData.position;

      if (Object.keys(changedFields).length === 0) {
        setMessage({ type: "error", text: "没有需要更新的内容" });
        return;
      }

      const updatedProfile = await updateProfile(token, changedFields);
      onUpdate(updatedProfile);
      setMessage({ type: "success", text: "保存成功" });
    } catch (error: unknown) {
      const err = error as { message?: string };
      setMessage({ type: "error", text: err.message || "保存失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-3 text-sm rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="真实姓名">
          <Input
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="请输入真实姓名"
          />
        </FormField>

        <FormField label="昵称">
          <Input
            value={formData.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            placeholder="请输入昵称"
          />
        </FormField>

        <FormField label="手机号">
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="请输入手机号"
            disabled
          />
        </FormField>

        <FormField label="邮箱">
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="请输入邮箱"
          />
        </FormField>

        <FormField label="所属机构">
          <Input
            value={formData.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
            placeholder="请输入所属机构"
          />
        </FormField>

        <FormField label="职位">
          <Input
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="请输入职位"
          />
        </FormField>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : "保存修改"}
        </Button>
      </div>
    </form>
  );
}
