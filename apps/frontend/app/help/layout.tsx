import { ReactNode, Suspense } from "react";
import HelpLayoutClient from "./HelpLayoutClient";

// 强制动态渲染
export const dynamic = "force-dynamic";

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-[var(--muted-foreground)]">Loading...</div>
    </div>
  );
}

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HelpLayoutClient>{children}</HelpLayoutClient>
    </Suspense>
  );
}
