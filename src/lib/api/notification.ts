/* ========================================
   알림 API 함수
   ======================================== */

import { apiClient } from "@/lib/api/client";
import type {
  AdminNotificationListResponse,
  NotificationApiItem,
  PartnerNotificationApiItem,
} from "@/types/api/notification";

/**
 * 리뷰어 알림 목록 조회 (Mock — 백엔드 미전환)
 * GET /reviewer/notification?reviewer_id=:id
 */
export const fetchNotifications = (reviewerId: number): Promise<NotificationApiItem[]> =>
  apiClient
    .get<NotificationApiItem[]>(`/reviewer/notification?reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 알림 읽음 처리 (Mock — 백엔드 미전환)
 * PATCH /notifications/:id { is_read: true }
 */
export const patchNotificationRead = (id: number | string): Promise<void> =>
  apiClient.patch(`/notifications/${id}`, { is_read: true }).then(() => undefined);

/**
 * GA 관리자 알림 목록 조회
 * GET /api/admin/notifications
 */
export const fetchAdminNotifications = (): Promise<AdminNotificationListResponse> =>
  apiClient.get<AdminNotificationListResponse>("/api/admin/notifications").then((res) => res.data);

/**
 * GA 관리자 전체 알림 삭제
 * DELETE /api/admin/notifications/all
 */
export const deleteAllAdminNotifications = (): Promise<void> =>
  apiClient.delete("/api/admin/notifications/all").then(() => undefined);

/**
 * SA 관리자 알림 목록 조회
 * GET /api/admin-sa/notifications
 */
export const fetchSAAdminNotifications = (): Promise<AdminNotificationListResponse> =>
  apiClient
    .get<AdminNotificationListResponse>("/api/admin-sa/notifications")
    .then((res) => res.data);

/**
 * SA 관리자 전체 알림 삭제
 * DELETE /api/admin-sa/notifications/all
 */
export const deleteAllSAAdminNotifications = (): Promise<void> =>
  apiClient.delete("/api/admin-sa/notifications/all").then(() => undefined);

/**
 * 파트너 알림 목록 조회
 * GET /partner/notifications (프론트엔드 명세서 16번 기준)
 */
export const fetchPartnerNotifications = (
  cursor?: string,
  size: number = 20
): Promise<{ items: PartnerNotificationApiItem[]; nextCursor: string | null }> =>
  apiClient
    .get<{
      result: string;
      items: PartnerNotificationApiItem[];
      nextCursor: string | null;
    }>("/partner/notifications", { params: { cursor, size } })
    .then((res) => ({
      items: res.data.items || [],
      nextCursor: res.data.nextCursor ?? null,
    }));
