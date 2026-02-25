/* ========================================
   💰 파트너 포인트 충전 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 충전 내역 페이지
 *
 * 목적: 파트너의 포인트 충전 내역만 보여주는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/point/earned
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
  partnerPointSummary,
} from "@/data/partner/point/pointData";

/**
 * 파트너 포인트 충전 내역 페이지 컴포넌트
 *
 */
function PartnerEarnedPointPage() {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState<PartnerPointHistory[]>([]);
  const [summary, setSummary] = useState<PartnerPointSummary>(partnerPointSummary);

  useEffect(() => {
    if (user?.id) {
      // getPartnerPointHistory는 항상 목업 데이터를 포함하고 localStorage 데이터를 추가로 합칩니다
      const userHistory = getPartnerPointHistory(user.id);
      const userSummary = getPartnerPointSummary(user.id);
      setHistoryData(userHistory);
      setSummary(userSummary);
    } else {
      // 로그인되지 않은 경우 목업 데이터만 표시 (getPartnerPointHistory는 userId가 없어도 목업 데이터 반환)
      const userHistory = getPartnerPointHistory();
      setHistoryData(userHistory);
      setSummary(partnerPointSummary);
    }
  }, [user]);

  // 충전 내역만 필터링하는 함수
  // 📌 필터 함수:
  // - type이 "earned"인 내역만 반환
  const filterEarnedHistory = (history: PartnerPointHistory) => history.type === "earned";

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
