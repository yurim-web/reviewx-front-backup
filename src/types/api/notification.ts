/* ========================================
   알림 API 타입 정의
   ======================================== */

// ── 리뷰어 알림 (Mock 기반, 레거시) ──

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

// ── 관리자(GA/SA) 알림 API 타입 (백엔드 API 기준) ──

/** 알림 목록 조회 파라미터 */
export interface AdminNotificationParams {
  page?: number;
  size?: number;
  category?: "OPERATION" | "INQUIRY";
  isRead?: boolean;
}

/** 알림 항목 */
export interface AdminNotificationItem {
  notificationId: number;
  category: "OPERATION" | "INQUIRY";
  notificationType: "EMAIL" | "SMS" | "KAKAO" | "PUSH";
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string; // ISO 8601
}

/** 알림 목록 응답 */
export interface AdminNotificationListResponse {
  result: "OK";
  generatedAt: string;
  data: {
    totalCount: number;
    unreadCount: number;
    totalPages: number;
    currentPage: number;
    size: number;
    notifications: AdminNotificationItem[];
  };
}
