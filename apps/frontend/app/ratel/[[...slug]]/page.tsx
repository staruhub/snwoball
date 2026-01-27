"use client";

import { StrictMode, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createRatelBrowserRouter } from "@ratel/next/ratel-router";
import "@ratel/i18n";

export default function RatelAppPage() {
  const router = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return createRatelBrowserRouter();
  }, []);

  if (!router) {
    return null;
  }

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
