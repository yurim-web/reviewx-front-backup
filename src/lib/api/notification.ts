/* ========================================
   알림 API 함수
   ======================================== */

import { apiClient } from "@/lib/api/client";
import type {
  AdminNotificationListResponse,
  ReviewerNotificationListResponse,
  PartnerNotificationApiItem,
} from "@/types/api/notification";

/**
 * 리뷰어 알림 목록 조회
 * GET /user/notification (백엔드 R-26)
 * Bearer 토큰으로 사용자 식별
 */
export const fetchNotifications = (): Promise<ReviewerNotificationListResponse> =>
  apiClient
    .get<ReviewerNotificationListResponse>("/api/v1/reviewer/notifications")
    .then((res) => res.data);

/**
 * 리뷰어 전체 알림 삭제
 * DELETE /api/v1/reviewer/notifications/all
 */
export const deleteAllNotifications = (): Promise<void> =>
  apiClient.delete("/api/v1/reviewer/notifications/all").then(() => undefined);

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
