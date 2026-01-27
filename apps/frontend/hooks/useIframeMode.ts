"use client";

import { useCallback, useMemo } from "react";
import {
  getAllowedParentOrigins,
  getParentOrigin,
  isIframe,
  notifyParent,
} from "@/lib/iframe";

export function useIframeMode() {
  const iframe = useMemo(() => isIframe(), []);
  const parentOrigin = useMemo(() => (iframe ? getParentOrigin() : ""), [iframe]);
  const allowedOrigins = useMemo(
    () => (iframe ? getAllowedParentOrigins() : []),
    [iframe]
  );

  const notifyParentSafe = useCallback(
    (payload: unknown) => {
      if (!iframe) {
        return;
      }
      notifyParent(payload);
    },
    [iframe]
  );

  return {
    isIframe: iframe,
    parentOrigin,
    allowedOrigins,
    notifyParent: notifyParentSafe,
  };
}

export function useIsIframe() {
  return useIframeMode().isIframe;
}
