/* ========================================
   💰 파트너 포인트 충전 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 충전 내역 페이지
 *
 * 목적: 파트너의 포인트 충전 내역만 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/point/earned
 *
 * 주요 기능:
 * - 포인트 충전 내역만 표시 (type: "earned")
 * - 보유 포인트 현황 표시
 * - 포인트 충전 기능
 *
 * 📌 리팩토링:
 * - 공통 UI는 PartnerPointPageLayout 컴포넌트로 추출
 * - 이 페이지는 충전 내역만 필터링하여 표시
 */

"use client";

import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { PartnerPointHistory } from "@/types/domain/partner";
import {
  partnerPointHistoryData,
  partnerPointSummary,
} from "@/data/partner/point/pointData";

/**
 * 파트너 포인트 충전 내역 페이지 컴포넌트
 *
 */
export default function PartnerEarnedPointPage() {
  // 충전 내역만 필터링하는 함수
  // 📌 필터 함수:
  // - type이 "earned"인 내역만 반환
  const filterEarnedHistory = (history: PartnerPointHistory) =>
    history.type === "earned";

  return (
    <PartnerPointPageLayout
      activePointTab="earned"
      historyData={partnerPointHistoryData}
      summary={partnerPointSummary}
      filterHistory={filterEarnedHistory}
    />
  );
}
