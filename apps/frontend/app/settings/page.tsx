"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/profile");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[var(--muted-foreground)]">正在跳转...</div>
    </div>
  );
}
