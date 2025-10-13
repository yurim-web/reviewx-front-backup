// 포인트 관련 타입 정의

/**
 * 포인트 내역 타입
 */
export interface PointHistory {
  id: string;
  type: "earned" | "spent" | "withdrawn"; // 획득/사용/출금
  amount: number; // 포인트 금액
  description: string; // 포인트 내역 설명
  campaign_id?: string; // 관련 캠페인 ID (있는 경우)
  date: string; // 날짜 (YYYY-MM-DD)
  status?: "completed" | "pending" | "failed"; // 상태
  balance: number; // 거래 후 잔액
}

/**
 * 포인트 요약 정보
 */
export interface PointSummary {
  total_points: number; // 총 보유 포인트
  available_points: number; // 출금 가능 포인트
  pending_points: number; // 대기 중인 포인트
}

/**
 * 출금 신청 데이터
 */
export interface WithdrawalRequest {
  amount: number;
  account_info: {
    bank: string;
    account_number: string;
    account_holder: string;
  };
}

/**
 * 포인트 탭 타입
 */
export type PointTab = "all" | "earned" | "withdrawn";
