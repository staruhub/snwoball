/**
 * HTML 转义工具函数
 * 用于防止 XSS 攻击
 */

/**
 * 转义 HTML 特殊字符
 * 将可能导致 XSS 攻击的字符替换为 HTML 实体
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") {
    return "";
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
