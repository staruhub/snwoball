"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LazyChartProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: number;
  className?: string;
}

/**
 * LazyChart - Lazy loading wrapper for chart components
 *
 * Uses IntersectionObserver to detect when the chart enters the viewport,
 * then renders the chart content. This improves initial page load performance
 * by deferring chart rendering until needed.
 *
 * @param children - Chart component to render lazily
 * @param fallback - Loading placeholder (default: spinner)
 * @param rootMargin - Margin around viewport for early loading (default: "100px")
 * @param threshold - Visibility threshold to trigger loading (default: 0)
 * @param minHeight - Minimum height for placeholder (default: 200)
 */
export function LazyChart({
  children,
  fallback,
  rootMargin = "100px",
  threshold = 0,
  minHeight = 200,
  className = "",
}: LazyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, keep it rendered
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setHasLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const defaultFallback = (
    <div
      className="flex items-center justify-center bg-[var(--muted)] rounded-lg animate-pulse"
      style={{ minHeight }}
    >
      <Loader2 className="w-6 h-6 text-[var(--muted-foreground)] animate-spin" />
    </div>
  );

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      {hasLoaded ? children : fallback || defaultFallback}
    </div>
  );
}

/**
 * Hook for lazy loading any component
 */
export function useLazyLoad({
  rootMargin = "100px",
  threshold = 0,
}: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, isVisible };
}
