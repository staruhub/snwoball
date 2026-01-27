"use client";

import { useEffect } from "react";
import { useIsIframe } from "@/hooks/useIframeMode";

export default function IframeAdapter() {
  const isIframe = useIsIframe();

  useEffect(() => {
    const className = "iframe-mode";
    const root = document.documentElement;
    if (isIframe) {
      root.classList.add(className);
    } else {
      root.classList.remove(className);
    }

    return () => {
      root.classList.remove(className);
    };
  }, [isIframe]);

  return null;
}
