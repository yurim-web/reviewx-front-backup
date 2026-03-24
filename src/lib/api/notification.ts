/* ========================================
   알림 API 함수
   ======================================== */

/**
 * notification API
 *
 * 목적: 알림 목록 조회 API 함수 (apiClient → json-server or 실제 백엔드)
 *
 * 사용 페이지:
 * - /user/notification (알림)
 *
 * 응답 처리:
 * - json-server 목업: 배열 직접 반환
 * - reviewer_id 쿼리 파라미터로 유저별 필터링
 */

import { apiClient } from "@/lib/api/client";
import type { NotificationApiItem } from "@/types/api/notification";
import type {
  AdminNotificationParams,
  AdminNotificationListResponse,
} from "@/types/api/notification";

/**
 * 알림 목록 조회 (리뷰어)
 * GET /reviewer/notification?reviewer_id=:id → /notifications?reviewer_id=:id
 */
export const fetchNotifications = (reviewerId: number): Promise<NotificationApiItem[]> =>
  apiClient
    .get<NotificationApiItem[]>(`/reviewer/notification`, {
      params: { reviewer_id: reviewerId },
    })
    .then((res) => (Array.isArray(res.data) ? res.data : []));

// ── 관리자(GA/SA) 알림 API ──

/** 관리자 알림 목록 조회  GET /api/admin/notifications */
export const fetchAdminNotifications = async (
  params?: AdminNotificationParams
): Promise<AdminNotificationListResponse> => {
  const { data } = await apiClient.get<AdminNotificationListResponse>("/api/admin/notifications", {
    params,
  });
  return data;
};

/** 관리자 알림 읽음 처리  PATCH /api/admin/notifications/{notificationId}/read */
export const readAdminNotification = (notificationId: number): Promise<void> =>
  apiClient.patch(`/api/admin/notifications/${notificationId}/read`).then(() => undefined);

/** 관리자 전체 알림 읽음 처리  PATCH /api/admin/notifications/read-all */
export const readAllAdminNotifications = (): Promise<void> =>
  apiClient.patch("/api/admin/notifications/read-all").then(() => undefined);

/** 관리자 알림 삭제  DELETE /api/admin/notifications/{notificationId} */
export const deleteAdminNotification = (notificationId: number): Promise<void> =>
  apiClient.delete(`/api/admin/notifications/${notificationId}`).then(() => undefined);

/** 관리자 전체 알림 삭제  DELETE /api/admin/notifications/all */
export const deleteAllAdminNotifications = (): Promise<void> =>
  apiClient.delete("/api/admin/notifications/all").then(() => undefined);

/**
 * 파트너 알림 목록 조회
 * GET /partner/notification → /partner_notifications
 */
export const fetchPartnerNotifications = (): Promise<NotificationApiItem[]> =>
  apiClient
    .get<NotificationApiItem[]>("/partner/notification")
    .then((res) => (Array.isArray(res.data) ? res.data : []));
