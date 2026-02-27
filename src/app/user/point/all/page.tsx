/* ========================================
   전체 포인트 내역 페이지
   ======================================== */

/**
 * AllPointPage
 *
 * 목적: 모든 포인트 내역(적립/출금)을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 */

"use client";

import PointHistoryPage from "@/components/user/point/PointHistoryPage";
import { PointHistory } from "@/types/domain/user";

/**
 * 전체 포인트 내역 페이지 컴포넌트
 *
 * 설명:
 * - 공통 컴포넌트를 사용하여 간단하게 구현했습니다.
 * - 필터 함수를 전달하여 모든 내역을 표시합니다.
 *
 */
export default function AllPointPage() {
  /**
   * 전체 내역 필터 함수
   *
   * 설명:
   * - 모든 포인트 내역을 표시하기 위해 항상 true를 반환합니다.
   * - 필터링 없이 모든 데이터를 보여줍니다.
   *
   */
  const filterAllHistory = (history: PointHistory) =>
    !(history.type === "withdrawal_pending" && history.status === "pending");

  return <PointHistoryPage activePointTab="all" filterFunction={filterAllHistory} />;
}
