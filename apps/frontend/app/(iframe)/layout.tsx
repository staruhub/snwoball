import type { ReactNode } from "react";

// 强制动态渲染，因为子页面使用客户端功能
export const dynamic = "force-dynamic";

interface IframeLayoutProps {
  children: ReactNode;
}

export default function IframeLayout({ children }: IframeLayoutProps) {
  return <div className="h-full w-full">{children}</div>;
}
