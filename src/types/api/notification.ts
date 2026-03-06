/* ========================================
   알림 API 타입 정의
   ======================================== */

/**
 * notification API 타입
 *
 * 목적: 알림 목록 조회 API 응답 타입을 정의합니다.
 *
 * 사용 페이지:
 * - /user/notification (알림)
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
