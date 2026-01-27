import type { ReactNode } from "react";
import "./ratel.css";

interface RatelLayoutProps {
  children: ReactNode;
}

export default function RatelLayout({ children }: RatelLayoutProps) {
  return <div className="ratel-app h-full">{children}</div>;
}
