import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import IframeAdapter from "@/components/IframeAdapter";
import IframeTokenReceiver from "@/components/IframeTokenReceiver";
import { AuthSyncProvider } from "@/components/AuthSyncProvider";

export const metadata: Metadata = {
  title: "基金报告系统",
  description: "基金分析报告生成系统",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full font-primary">
        <ToastProvider>
          <AuthSyncProvider>
            <IframeAdapter />
            <Suspense fallback={null}>
              <IframeTokenReceiver />
            </Suspense>
            {children}
          </AuthSyncProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
