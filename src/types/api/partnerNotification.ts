/**
 * 파트너 알림 API 타입 정의
 * 백엔드 API 기준: 25. 파트너 알림 조회 / 25-1. 파트너 알림 전체 삭제
 */

/** 파트너 알림 유형 (파트너 알림 템플릿 A_P1~A_P12 기준, 총 12가지) */
export type PartnerNotificationType =
  | "CAMPAIGN_STATUS_CHANGED" // A_P1
  | "CAMPAIGN_COMPLETED" // A_P2
  | "CAMPAIGN_SUSPENDED" // A_P3
  | "CONTENT_REGISTERED" // A_P4
  | "EXTENSION_REQUESTED" // A_P5
  | "PAYMENT_CONFIRMED" // A_P6
  | "PAYMENT_COMPLETED" // A_P7
  | "PAYMENT_UNCONFIRMED" // A_P8
  | "CARD_PAYMENT_COMPLETED" // A_P9
  | "CONTENT_UNCONFIRMED_REQUEST" // A_P10
  | "ACCOUNT_SUSPENDED" // A_P11
  | "ACCOUNT_BANNED"; // A_P12

/** 알림 카테고리 */
export type PartnerNotificationCategory = "OPERATION" | "INQUIRY";

/** 알림 아이템 */
export interface PartnerNotificationItem {
  notificationHistoryId: number;
  type: PartnerNotificationType;
  category: PartnerNotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  campaignId: number | null;
  campaignTitle: string | null;
  sentAt: string;
}

/** 알림 목록 조회 응답 — GET /partner/notifications */
export interface PartnerNotificationsResponse {
  result: "OK";
  generatedAt: string;
  unreadCount: number;
  items: PartnerNotificationItem[];
  nextCursor: string | null;
}

/** 알림 목록 조회 파라미터 */
export interface PartnerNotificationsParams {
  cursor?: string;
  size?: number;
}

/** 알림 전체 삭제 응답 — DELETE /partner/notifications */
export interface PartnerNotificationsDeleteResponse {
  result: "OK";
  generatedAt: string;
  message: string;
  deletedCount: number;
}
