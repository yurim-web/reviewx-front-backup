/* ========================================
   🔔 알림 목업 데이터
   ======================================== */

/**
 * 알림 목업 데이터
 *
 * 목적: 알림 페이지에서 사용되는 임시 목업 데이터입니다.
 *       실제 프로젝트에서는 API를 통해 서버에서 알림 데이터를 가져옵니다.
 *       현재는 개발 및 디자인 확인을 위한 샘플 데이터입니다.
 *
 * 사용 페이지:
 * - /notification (알림 페이지)
 *
 * 데이터 구조:
 * - id: 알림 고유 식별자
 * - type: 알림 타입 ("withdrawal" | "urgent_withdrawal" | "block")
 * - label: 알림 라벨 텍스트 (화면에 표시되는 라벨)
 * - message: 알림 내용 텍스트
 * - time: 알림 발생 시간 (YYYY-MM-DD HH:mm 형식)
 */

/**
 * 알림 타입 정의
 * - type: 알림의 종류를 구분하는 필드
 *   - "withdrawal": 출금 요청 (파란색 라벨 #5C6DED)
 *   - "urgent_withdrawal": 긴급 출금 요청 (빨간색 라벨 #FF4D4D)
 *   - "block": 차단 발생 (빨간색 라벨 #FF4D4D)
 * - label: 알림 라벨 텍스트 (화면에 표시되는 라벨)
 * - message: 알림 내용 텍스트
 * - time: 알림 발생 시간 (YYYY-MM-DD HH:mm 형식)
 */
export interface NotificationItem {
  id: number;
  type: "withdrawal" | "urgent_withdrawal" | "block";
  label: string;
  message: string;
  time: string;
}

/**
 * 임시 목업 데이터
 * 실제 프로젝트에서는 API를 통해 서버에서 알림 데이터를 가져옵니다.
 * 현재는 개발 및 디자인 확인을 위한 샘플 데이터입니다.
 */
export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "withdrawal",
    label: "출금 요청",
    message: "출금 요청이 3건 접수되었습니다.",
    time: "2025-09-01 18:35",
  },
  {
    id: 2,
    type: "urgent_withdrawal",
    label: "긴급 출금 요청",
    message: "긴급 출금 요청이 1건 접수되었습니다.",
    time: "2025-09-01 18:35",
  },
  {
    id: 3,
    type: "block",
    label: "차단 발생",
    message:
      "운영 정책 위반으로 차단된 계정이 발생했습니다. 차단 내역을 확인해 주세요.",
    time: "2025-09-01 18:35",
  },
];
