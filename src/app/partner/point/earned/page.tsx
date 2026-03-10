/* ========================================
   파트너 포인트 충전 내역 페이지
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

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { usePartnerPointData } from "@/hooks/partner/usePartnerPointData";
import type { PartnerPointHistory } from "@/types/domain/partner";

function PartnerEarnedPointPage() {
  const { history, summary } = usePartnerPointData();

  const filterEarnedHistory = (h: PartnerPointHistory) => h.type === "earned";

  return (
    <PartnerPointPageLayout
      activePointTab="earned"
      historyData={history}
      summary={summary}
      filterHistory={filterEarnedHistory}
    />
  );
}

export default withPartnerAuth(PartnerEarnedPointPage);
