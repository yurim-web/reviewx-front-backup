/* ========================================
   💰 파트너 포인트 데이터
   ======================================== */

import {
  PartnerPointHistory,
  PartnerPointSummary,
} from "@/types/partner/partner";

/**
 * 파트너 포인트 요약 정보 (샘플 데이터)
 */
export const partnerPointSummary: PartnerPointSummary = {
  total_points: 425000, // 전체 보유 포인트
  available_points: 425000, // 사용 가능한 포인트
  pending_points: 0, // 처리 대기 중인 포인트
};

/**
 * * 파트너 포인트 내역 (샘플 데이터) */


export const partnerPointHistoryData: PartnerPointHistory[] = [
  {
    id: "1", // 거래 고유 ID
    type: "earned", // 거래 유형 - "earned"=충전, "withdrawn"=사용
    amount: 16000, // 포인트 변동 금액 (양수=증가, 음수=감소)
    description: "포인트 충전", // 내역 설명 텍스트
    campaign_id: "camp_001", // 연관된 캠페인 ID (선택사항)
    date: "2025-09-21", // 거래 발생 날짜 (YYYY-MM-DD)
    status: "earned", // 거래 상태 - "earned"/"completed"/"pending"/"failed"
    balance: 49500, // 거래 후 남은 포인트 잔액
  },
  {
    id: "2",
    type: "earned",
    amount: 27500,
    description: "포인트 충전",
    campaign_id: "camp_002",
    date: "2025-09-01",
    status: "earned",
    balance: 33500,
  },
  {
    id: "3",
    type: "earned",
    amount: 150000,
    description: "포인트 충전",
    campaign_id: "camp_003",
    date: "2025-09-12",
    status: "earned",
    balance: 425000,
  },
  {
    id: "4",
    type: "earned",
    amount: 150000,
    description: "포인트 충전",
    campaign_id: "camp_004",
    date: "2025-09-10",
    status: "earned",
    balance: 275000,
  },
  {
    id: "5",
    type: "earned",
    amount: 50000,
    description: "포인트 충전",
    date: "2025-09-06",
    status: "earned",
    balance: 125000,
  },
  {
    id: "6",
    type: "withdrawn", // 사용(출금) 유형
    amount: -150000, // 음수=포인트 차감
    description: "리뷰어 포인트 지급", // 리뷰어에게 포인트를 지급한 내역
    date: "2025-09-28",
    status: "completed", // 완료된 거래
    balance: 275000,
  },
  {
    id: "7",
    type: "withdrawn",
    amount: -200000,
    description: "리뷰어 포인트 지급",
    date: "2025-09-11",
    status: "completed",
    balance: 225000,
  },
  {
    id: "8",
    type: "withdrawn",
    amount: -27000,
    description: "리뷰어 포인트 지급",
    date: "2025-09-01",
    status: "completed",
    balance: 435000,
  },
];

