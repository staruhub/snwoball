import type { ReactNode } from "react";

interface IframeLayoutProps {
  children: ReactNode;
}

export default function IframeLayout({ children }: IframeLayoutProps) {
  return <div className="h-full w-full">{children}</div>;
}
