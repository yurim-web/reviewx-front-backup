/* ========================================
   출금 포인트 내역 페이지
   ======================================== */

/**
 * WithdrawnPointPage
 *
 * 목적: 출금 관련 포인트 내역을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/point/withdrawn (출금 포인트 내역)
 */

"use client";

import PointHistoryPage from "@/components/user/point/PointHistoryPage";
import { PointHistory } from "@/types/domain/user";

/**
 * 출금 포인트 내역 페이지 컴포넌트
 *
 * 설명:
 * - 공통 컴포넌트를 사용하여 간단하게 구현했습니다.
 * - 필터 함수를 전달하여 출금 관련 내역만 표시합니다.
 *
 */
export default function WithdrawnPointPage() {
  /**
   * 출금 내역 필터 함수
   *
   * 설명:
   * - 출금 관련 타입(withdrawn, withdrawal_pending)과 상태(completed, pending, failed)만 필터링합니다.
   * - Array.includes() 메서드를 사용하여 배열에 포함되어 있는지 확인합니다.
   */
  const filterWithdrawnHistory = (history: PointHistory) =>
    (history.type === "withdrawn" || history.type === "withdrawal_pending") &&
    ["completed", "failed"].includes(history.status);

  return <PointHistoryPage activePointTab="withdrawn" filterFunction={filterWithdrawnHistory} />;
}
