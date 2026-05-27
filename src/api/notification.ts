import { get, post } from '@/utils/request'

export interface NotificationItem {
  id: number
  title: string
  content: string
  notificationType: string
  bizId: number
  bizType: string
  route: string
  payload: Record<string, unknown>
  createdAt: string
  readAt: string | null
  acknowledgedAt: string | null
}

export interface NotificationListResponse {
  items: NotificationItem[]
  page: number
  pageSize: number
  total: number
  unreadCount: number
}

export interface NotificationActionResponse {
  acknowledged: boolean
  message: string
  unreadCount: number
}

export interface UnreadCountResponse {
  unreadCount: number
}

/** 查询通知列表 */
export function getNotificationList(params?: {
  page?: number
  pageSize?: number
  unreadOnly?: boolean
}): Promise<NotificationListResponse> {
  return get<NotificationListResponse>('/notifications', params as Record<string, unknown>)
}

/** 确认通知已知晓 */
export function acknowledgeNotification(id: number): Promise<NotificationActionResponse> {
  return post<NotificationActionResponse>(`/notifications/${id}/acknowledge`)
}

/** 查询未读通知数 */
export function getUnreadCount(): Promise<UnreadCountResponse> {
  return get<UnreadCountResponse>('/notifications/unread-count')
}
