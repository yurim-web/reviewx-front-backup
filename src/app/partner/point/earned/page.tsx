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

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { PartnerPointHistory, PartnerPointSummary } from "@/types/domain/partner";
import {
  getPartnerPointHistory,
  getPartnerPointSummary,
  partnerPointHistoryData,
} from "@/data/partner/point/pointData";

/**
 * 파트너 포인트 충전 내역 페이지 컴포넌트
 *
 */
function PartnerEarnedPointPage() {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<PartnerPointHistory[]>([]);
  const [summary, setSummary] = useState<PartnerPointSummary>({
    total_points: 0,
    available_points: 0,
    pending_points: 0,
  });

  useEffect(() => {
    if (user?.id) {
      const userHistory = getPartnerPointHistory(user.id);
      const userSummary = getPartnerPointSummary(user.id);

      // 파트너 테스트 계정인 경우 목업 데이터와 실제 충전 내역을 합침
      if (user.id === 'partner_test_001') {
        const combinedHistory = [...userHistory, ...partnerPointHistoryData];
        setHistoryData(combinedHistory);
      } else {
        setHistoryData(userHistory);
      }

      setSummary(userSummary);
    }
  }, [user]);

  // 충전 내역만 필터링하는 함수
  // 📌 필터 함수:
  // - type이 "earned"인 내역만 반환
  const filterEarnedHistory = (history: PartnerPointHistory) =>
    history.type === "earned";

  return (
    <PartnerPointPageLayout
      activePointTab="earned"
      historyData={historyData}
      summary={summary}
      filterHistory={filterEarnedHistory}
    />
  );
}

export default withPartnerAuth(PartnerEarnedPointPage);
