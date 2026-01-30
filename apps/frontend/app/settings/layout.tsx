import { ReactNode, Suspense } from "react";
import SettingsLayoutClient from "./SettingsLayoutClient";

// 强制动态渲染
export const dynamic = "force-dynamic";

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)]">Loading...</div>
    </div>
  );
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SettingsLayoutClient>{children}</SettingsLayoutClient>
    </Suspense>
  );
}
