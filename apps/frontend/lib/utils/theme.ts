/**
 * 主题管理工具
 * 统一处理主题切换逻辑，避免代码重复
 */

export type Theme = "light" | "dark" | "system";

/**
 * 获取系统偏好的主题
 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * 应用主题到 DOM
 * @param theme - 主题类型：light/dark/system
 */
export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  root.setAttribute("data-theme", resolvedTheme);
}

/**
 * 初始化主题并监听系统主题变化
 * @param getTheme - 获取当前主题的回调函数
 */
export function initializeThemeListener(getTheme: () => Theme | undefined) {
  if (typeof window === "undefined") return;

  // 应用初始主题
  const theme = getTheme() || "system";
  applyTheme(theme);

  // 监听系统主题变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    const currentTheme = getTheme() || "system";
    if (currentTheme === "system") {
      applyTheme("system");
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}
