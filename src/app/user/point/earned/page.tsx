/* ========================================
   💰 적립 포인트 내역 페이지
   ======================================== */

/**
 * 적립 포인트 내역 페이지
 *
 * 목적: 적립된 포인트 내역만을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point/earned
 *
 * 주요 기능:
 * - 적립 상태의 포인트 내역만 표시
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 *
 * 리팩토링 설명:
 * - 공통 컴포넌트(PointHistoryPage)를 사용하여 코드 중복을 제거했습니다.
 * - 적립 상태(status === 'earned')만 필터링하는 함수를 전달합니다.
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
   * - status가 'earned'인 내역만 필터링합니다.
   * - 화살표 함수를 사용하여 간단하게 작성했습니다.
   *
   */
  const filterEarnedHistory = (history: PointHistory) =>
    history.status === "earned";

  return (
    <PointHistoryPage
      activePointTab="earned"
      filterFunction={filterEarnedHistory}
    />
  );
}
