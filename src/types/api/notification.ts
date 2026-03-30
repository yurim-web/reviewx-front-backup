/* ========================================
   알림 API 타입 정의
   ======================================== */

/**
 * 리뷰어 알림 API 응답 타입 (GET /user/notification)
 */
export interface ReviewerNotificationApiItem {
  notificationHistoryId: number;
  campaignId: number | null;
  userId: number;
  type: string;
  message: string;
  createdAt: string;
}

/**
 * 리뷰어 알림 목록 응답
 */
export interface ReviewerNotificationListResponse {
  result: string;
  items: ReviewerNotificationApiItem[];
  nextCursor: string | null;
}

/**
 * 관리자(GA/SA) 알림 항목 (GET /api/admin/notifications)
 */
export interface AdminNotificationApiItem {
  notificationId: number;
  category: "OPERATION" | "INQUIRY";
  notificationType: "EMAIL" | "SMS" | "KAKAO" | "PUSH";
  title: string;
  message: string;
  sentAt: string;
}

/**
 * 관리자 알림 목록 응답
 */
export interface AdminNotificationListResponse {
  result: string;
  generatedAt: string;
  data: {
    totalCount: number;
    notifications: AdminNotificationApiItem[];
  };
}

/**
 * 파트너 알림 항목 (GET /partner/notifications)
 */
export interface PartnerNotificationApiItem {
  notificationHistoryId: number;
  campaignId: number | null;
  userId: number;
  type: string;
  message: string;
  createdAt: string;
}

/**
 * @deprecated 리뷰어 mock용 — ReviewerNotificationApiItem 사용
 */
export interface NotificationApiItem {
  id: number;
  reviewer_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  campaign_id?: number;
  campaign_name?: string;
}
