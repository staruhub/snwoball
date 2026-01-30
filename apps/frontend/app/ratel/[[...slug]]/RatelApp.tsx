"use client";

import { StrictMode, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { createRatelBrowserRouter } from "@ratel/next/ratel-router";
import { ThemeProvider } from "@ratel/contexts/ThemeContext";
import "@ratel/i18n";

/**
 * Ratel 应用主组件
 * 此组件通过 dynamic import (ssr: false) 加载，确保只在客户端运行
 * ThemeProvider 在此全局包裹，确保所有路由共享同一主题上下文
 */
export default function RatelApp() {
  // 使用 useState 初始化函数确保 router 只创建一次
  // 由于组件已通过 dynamic(..., { ssr: false }) 加载，这里一定在客户端
  const [router] = useState(() => createRatelBrowserRouter());

  return (
    <StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}
