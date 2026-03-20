/**
 * 파트너 알림 API 타입 정의
 * 백엔드 API 기준: 알림 내역 조회 (리뷰어 API 26 구조 기반)
 */

/** 파트너 알림 유형 (COMMON_MESSAGE_RULES A_P1~A_P7 기준) */
export type PartnerNotificationType =
  | "CAMPAIGN_STATUS_CHANGED" // A_P1
  | "CAMPAIGN_COMPLETED" // A_P2
  | "CAMPAIGN_SUSPENDED" // A_P3
  | "CONTENT_REGISTERED" // A_P4
  | "CONTENT_EXTENSION_REQUESTED" // A_P5
  | "ACCOUNT_SUSPENDED" // A_P6
  | "ACCOUNT_BANNED"; // A_P7

/** 알림 아이템 */
export interface PartnerNotificationItem {
  notificationHistoryId: number;
  campaignId: number | null;
  userId: number;
  type: PartnerNotificationType;
  message: string;
  createdAt: string;
}

/** 알림 목록 조회 응답 (커서 기반 페이지네이션) */
export interface PartnerNotificationsResponse {
  result: "OK";
  items: PartnerNotificationItem[];
  nextCursor: string | null;
}

/** 알림 목록 조회 파라미터 */
export interface PartnerNotificationsParams {
  cursor?: string;
  size?: number;
}
