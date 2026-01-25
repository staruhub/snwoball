/**
 * Accessibility Utilities
 *
 * Helper functions for improving accessibility across the application.
 */

/**
 * Announce a message to screen readers using ARIA live regions
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  if (typeof document === "undefined") return;

  // Create or get the announcer element
  let announcer = document.getElementById("sr-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    // Screen reader only styles
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(announcer);
  }

  // Update priority if different
  announcer.setAttribute("aria-live", priority);

  // Clear and set message (triggers announcement)
  announcer.textContent = "";
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
}

/**
 * Trap focus within a container (for modals, dialogs, etc.)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);

  // Focus first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateAriaId(prefix: string = "aria"): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Hook for keyboard navigation in lists
 */
export function handleListKeyDown(
  e: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      onSelect(Math.min(currentIndex + 1, totalItems - 1));
      break;
    case "ArrowUp":
      e.preventDefault();
      onSelect(Math.max(currentIndex - 1, 0));
      break;
    case "Home":
      e.preventDefault();
      onSelect(0);
      break;
    case "End":
      e.preventDefault();
      onSelect(totalItems - 1);
      break;
  }
}

/**
 * ARIA role descriptions for common patterns
 */
export const ariaLabels = {
  // Navigation
  mainNav: "主导航",
  breadcrumb: "面包屑导航",
  pagination: "分页导航",

  // Regions
  mainContent: "主要内容区",
  sidebar: "侧边栏",
  header: "页眉",
  footer: "页脚",

  // Interactive elements
  closeButton: "关闭",
  menuButton: "打开菜单",
  expandButton: "展开",
  collapseButton: "收起",

  // Status
  loading: "加载中",
  error: "出错了",
  success: "操作成功",

  // Forms
  required: "必填",
  optional: "选填",
  invalidInput: "输入无效",
};

/**
 * Skip to main content link helper
 */
export function renderSkipLink(): string {
  return `
    <a href="#main-content" class="skip-link">
      跳转到主要内容
    </a>
  `;
}

/**
 * CSS for skip link (add to global styles)
 */
export const skipLinkStyles = `
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: var(--primary-foreground);
    padding: 8px 16px;
    z-index: 100;
    text-decoration: none;
  }

  .skip-link:focus {
    top: 0;
  }
`;
