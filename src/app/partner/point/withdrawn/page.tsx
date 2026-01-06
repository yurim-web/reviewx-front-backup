/* ========================================
   💰 파트너 포인트 사용 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 사용 내역 페이지
 *
 * 목적: 파트너의 포인트 사용 내역만 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/point/withdrawn
 *
 * 주요 기능:
 * - 포인트 사용 내역만 표시 (type: "withdrawn")
 * - 보유 포인트 현황 표시
 * - 포인트 충전 기능
 *
 * 📌 리팩토링:
 * - 공통 UI는 PartnerPointPageLayout 컴포넌트로 추출
 * - 이 페이지는 사용 내역만 필터링하여 표시
 */

"use client";

import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { PartnerPointHistory } from "@/types/partner/partner";
import {
  partnerPointHistoryData,
  partnerPointSummary,
} from "@/data/partner/point/pointData";

/**
 * 파트너 포인트 사용 내역 페이지 컴포넌트
 *
 * 📌 학습 포인트:
 * - 공통 컴포넌트를 사용하여 코드 중복 제거
 * - 필터 함수를 전달하여 사용 내역과 반환 내역을 표시
 *
 * 📌 사용 탭에 포함되는 내역:
 * - 사용(withdrawn): 리뷰어 포인트 지급 등
 * - 반환(returned): 리뷰어 포인트 반환, 캠페인 포인트 반환
 */
export default function PartnerWithdrawnPointPage() {
  // 사용 내역과 반환 내역을 필터링하는 함수
  // 📌 필터 함수:
  // - type이 "withdrawn" 또는 "returned"인 내역만 반환
  const filterWithdrawnHistory = (history: PartnerPointHistory) =>
    history.type === "withdrawn" || history.type === "returned";

  return (
    <PartnerPointPageLayout
      activePointTab="withdrawn"
      historyData={partnerPointHistoryData}
      summary={partnerPointSummary}
      filterHistory={filterWithdrawnHistory}
    />
  );
}
