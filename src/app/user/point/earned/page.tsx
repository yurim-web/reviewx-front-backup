/* ========================================
   적립 포인트 내역 페이지
   ======================================== */

/**
 * EarnedPointPage
 *
 * 목적: 적립된 포인트 내역만 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/point/earned (적립 포인트 내역)
 */

"use client";

import PointHistoryPage from "@/components/user/point/PointHistoryPage";
import { PointHistory } from "@/types/domain/user";

/**
 * 적립 포인트 내역 페이지 컴포넌트
 *
 * 설명:
 * - 공통 컴포넌트를 사용하여 간단하게 구현했습니다.
 * - 필터 함수를 전달하여 적립 상태의 내역만 표시합니다.
 *
 */
export default function EarnedPointPage() {
  /**
   * 적립 내역 필터 함수
   *
   * 설명:
   * - type이 'earned'인 내역을 필터링합니다.
   * - 적립 완료(status: earned)와 적립 취소(status: failed) 모두 표시합니다.
   *
   */
  const filterEarnedHistory = (history: PointHistory) =>
    history.type === "earned";

  return (
    <PointHistoryPage
      activePointTab="earned"
      filterFunction={filterEarnedHistory}
    />
  );
}
