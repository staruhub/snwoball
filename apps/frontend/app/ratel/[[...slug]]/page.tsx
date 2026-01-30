"use client";

export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";

// 使用 dynamic import 并禁用 SSR
// 确保 React Router 及其所有依赖只在客户端加载和运行
const RatelApp = nextDynamic(() => import("./RatelApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">正在加载...</span>
      </div>
    </div>
  ),
});

export default function RatelAppPage() {
  return <RatelApp />;
}
