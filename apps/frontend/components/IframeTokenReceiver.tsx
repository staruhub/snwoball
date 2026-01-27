"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export default function IframeTokenReceiver() {
  const searchParams = useSearchParams();
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }

    setToken(token);

    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams, setToken]);

  return null;
}
