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

/**
 * 알림 목록 조회
 * GET /reviewer/notification?reviewer_id=:id → /notifications?reviewer_id=:id
 */
export const fetchNotifications = (reviewerId: number): Promise<NotificationApiItem[]> =>
  apiClient
    .get<NotificationApiItem[]>(`/reviewer/notification?reviewer_id=${reviewerId}`)
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 알림 읽음 처리
 * PATCH /notifications/:id { is_read: true }
 */
export const patchNotificationRead = (id: number | string): Promise<void> =>
  apiClient.patch(`/notifications/${id}`, { is_read: true }).then(() => undefined);

/**
 * 관리자(GA/SA) 알림 목록 조회
 * GET /admin/notification → /admin_notifications
 */
export const fetchAdminNotifications = (): Promise<NotificationApiItem[]> =>
  apiClient
    .get<NotificationApiItem[]>("/admin/notification")
    .then((res) => (Array.isArray(res.data) ? res.data : []));

/**
 * 관리자(GA/SA) 전체 알림 삭제
 * DELETE /api/admin/notifications/all
 */
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
