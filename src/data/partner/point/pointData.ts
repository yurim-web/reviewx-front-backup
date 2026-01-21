/* ========================================
   💰 파트너 포인트 데이터
   ======================================== */

import {
  PartnerPointHistory,
  PartnerPointSummary,
} from "@/types/domain/partner";

/**
 * 파트너 포인트 요약 정보 가져오기 (LocalStorage 기반)
 */
export function getPartnerPointSummary(userId?: string): PartnerPointSummary {
  if (typeof window === 'undefined' || !userId) {
    return {
      total_points: 0,
      available_points: 0,
      pending_points: 0,
    };
  }

  try {
    const pointsKey = `partner_points_${userId}`;
    const storedPoints = localStorage.getItem(pointsKey);

    if (storedPoints) {
      const points = JSON.parse(storedPoints);
      return {
        total_points: points.total_points || 0,
        available_points: points.available_points || 0,
        pending_points: points.pending_points || 0,
      };
    }

    // 초기 포인트 0으로 설정
    const initialPoints = {
      total_points: 0,
      available_points: 0,
      pending_points: 0,
    };
    localStorage.setItem(pointsKey, JSON.stringify(initialPoints));
    return initialPoints;
  } catch (error) {
    console.error('포인트 요약 정보 로드 중 오류:', error);
    return {
      total_points: 0,
      available_points: 0,
      pending_points: 0,
    };
  }
}

/**
 * 파트너 포인트 요약 정보 (샘플 데이터 - 하위 호환성 유지)
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
  {
    id: "9",
    type: "returned", // 반환 유형
    amount: 50000, // 양수=포인트 증가 (반환받음)
    description: "리뷰어 포인트 반환", // 리뷰어 포인트 반환
    date: "2025-09-15",
    status: "completed", // 완료된 반환
    balance: 485000,
    return_reason: "리뷰어가 캠페인을 완료하지 못하여 포인트가 반환되었습니다.",
  },
  {
    id: "10",
    type: "returned",
    amount: 100000,
    description: "캠페인 포인트 반환", // 캠페인 포인트 반환
    date: "2025-09-20",
    status: "completed",
    balance: 585000,
    return_reason: "캠페인이 취소되어 포인트가 반환되었습니다.",
  },
  {
    id: "11",
    type: "returned",
    amount: 30000,
    description: "리뷰어 포인트 반환",
    date: "2025-09-25",
    status: "failed", // 반려된 반환
    balance: 555000,
    rejection_reason: "반환 신청 정보가 일치하지 않습니다.",
  },
];

/**
 * 파트너 포인트 내역 가져오기 (LocalStorage 기반)
 */
export function getPartnerPointHistory(userId?: string): PartnerPointHistory[] {
  if (typeof window === 'undefined' || !userId) {
    return [];
  }

  try {
    const historyKey = `partner_point_history_${userId}`;
    const storedHistory = localStorage.getItem(historyKey);

    if (storedHistory) {
      return JSON.parse(storedHistory);
    }

    // 초기 빈 배열 반환
    return [];
  } catch (error) {
    console.error('포인트 내역 로드 중 오류:', error);
    return [];
  }
}

/**
 * 포인트 충전 함수
 */
export function addPointCharge(
  userId: string,
  amount: number,
  description: string = '포인트 충전'
): void {
  if (typeof window === 'undefined' || !userId) return;

  try {
    // 현재 포인트 요약 정보 가져오기
    const summary = getPartnerPointSummary(userId);
    const newTotalPoints = summary.total_points + amount;
    const newAvailablePoints = summary.available_points + amount;

    // 포인트 요약 정보 업데이트
    const pointsKey = `partner_points_${userId}`;
    localStorage.setItem(
      pointsKey,
      JSON.stringify({
        total_points: newTotalPoints,
        available_points: newAvailablePoints,
        pending_points: summary.pending_points,
      })
    );

    // 포인트 내역 추가
    const history = getPartnerPointHistory(userId);
    const newHistory: PartnerPointHistory = {
      id: `point_${Date.now()}`,
      type: 'earned',
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'earned',
      balance: newAvailablePoints,
    };

    history.unshift(newHistory); // 최신 내역을 맨 앞에 추가
    const historyKey = `partner_point_history_${userId}`;
    localStorage.setItem(historyKey, JSON.stringify(history));

    console.log('포인트 충전 완료:', newHistory);
  } catch (error) {
    console.error('포인트 충전 중 오류:', error);
  }
}

/**
 * 포인트 사용 함수
 */
export function usePartnerPoints(
  userId: string,
  amount: number,
  description: string = '리뷰어 포인트 지급'
): boolean {
  if (typeof window === 'undefined' || !userId) return false;

  try {
    const summary = getPartnerPointSummary(userId);

    // 사용 가능한 포인트가 부족한 경우
    if (summary.available_points < amount) {
      alert('보유 포인트가 부족합니다.');
      return false;
    }

    const newAvailablePoints = summary.available_points - amount;

    // 포인트 요약 정보 업데이트
    const pointsKey = `partner_points_${userId}`;
    localStorage.setItem(
      pointsKey,
      JSON.stringify({
        total_points: summary.total_points,
        available_points: newAvailablePoints,
        pending_points: summary.pending_points,
      })
    );

    // 포인트 내역 추가
    const history = getPartnerPointHistory(userId);
    const newHistory: PartnerPointHistory = {
      id: `point_${Date.now()}`,
      type: 'withdrawn',
      amount: -amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      balance: newAvailablePoints,
    };

    history.unshift(newHistory);
    const historyKey = `partner_point_history_${userId}`;
    localStorage.setItem(historyKey, JSON.stringify(history));

    console.log('포인트 사용 완료:', newHistory);
    return true;
  } catch (error) {
    console.error('포인트 사용 중 오류:', error);
    return false;
  }
}
