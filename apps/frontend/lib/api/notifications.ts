/**
 * 通知 API
 */

import { fetchApi } from "./config";

// ==================== 类型定义 ====================

export type NotificationType = "system" | "report" | "template" | "fund" | "normal";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationListResponse {
  total: number;
  unreadCount: number;
  items: Notification[];
}

// ==================== 后端响应类型 ====================

interface BackendUserMessage {
  id: string;
  message_id: string;
  title: string;
  content: string | null;
  message_type: string;
  payload: Record<string, unknown> | null;
  is_pinned: boolean;
  pinned_until: string | null;
  delivered_at: string | null;
  read_at: string | null;
  create_time: string;
  update_time: string;
  is_read: boolean;
}

interface BackendMessageListResponse {
  total: number;
  page: number;
  page_size: number;
  items: BackendUserMessage[];
}

interface BackendUnreadCountResponse {
  unread_count: number;
}

// ==================== 数据转换函数 ====================

function transformBackendMessage(msg: BackendUserMessage): Notification {
  // 将后端消息类型映射到前端类型
  const typeMap: Record<string, NotificationType> = {
    system: "system",
    normal: "system",
    report: "report",
    template: "template",
    fund: "fund",
  };

  return {
    id: msg.id,
    type: typeMap[msg.message_type] || "system",
    title: msg.title,
    content: msg.content || "",
    isRead: msg.is_read,
    createdAt: msg.create_time,
    link: (msg.payload?.link as string) || undefined,
  };
}

// ==================== 辅助函数 ====================

export const notificationTypeLabels: Record<NotificationType, string> = {
  system: "系统",
  report: "报告",
  template: "模板",
  fund: "基金",
  normal: "普通",
};

export function getNotificationTypeLabel(type: NotificationType): string {
  return notificationTypeLabels[type] || type;
}

// ==================== API 函数 ====================

/**
 * 获取通知列表
 */
export async function getNotifications(limit?: number): Promise<NotificationListResponse> {
  const pageSize = limit || 20;
  const response = await fetchApi<BackendMessageListResponse>(
    `/api/v1/messages/page?page=1&page_size=${pageSize}&client_type=web`
  );

  const items = response.items.map(transformBackendMessage);

  // 获取未读数量
  const unreadResponse = await fetchApi<BackendUnreadCountResponse>(
    "/api/v1/messages/unread-count?client_type=web"
  );

  return {
    total: response.total,
    unreadCount: unreadResponse.unread_count,
    items,
  };
}

/**
 * 获取未读通知数量
 */
export async function getUnreadCount(): Promise<number> {
  const response = await fetchApi<BackendUnreadCountResponse>(
    "/api/v1/messages/unread-count?client_type=web"
  );
  return response.unread_count;
}

/**
 * 标记通知为已读
 */
export async function markAsRead(ids: string[]): Promise<void> {
  // 后端 API 一次只能标记一条消息
  await Promise.all(
    ids.map((id) =>
      fetchApi<{ success: boolean }>(`/api/v1/messages/${id}/read`, {
        method: "POST",
      })
    )
  );
}

/**
 * 标记所有通知为已读
 */
export async function markAllAsRead(): Promise<void> {
  // 获取所有未读消息然后标记
  const response = await fetchApi<BackendMessageListResponse>(
    "/api/v1/messages/page?page=1&page_size=100&client_type=web"
  );

  const unreadIds = response.items.filter((m) => !m.is_read).map((m) => m.id);
  if (unreadIds.length > 0) {
    await markAsRead(unreadIds);
  }
}

/**
 * 删除通知
 * 注意：当前后端 API 暂不支持用户端删除消息，此函数保留接口但不执行操作
 */
export async function deleteNotification(_id: string): Promise<void> {
  // 后端暂不支持用户端删除消息
  console.warn("deleteNotification: 后端暂不支持用户端删除消息");
}
