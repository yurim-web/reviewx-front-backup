/* ========================================
   파트너 포인트 사용 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 사용 내역 페이지
 *
 * 목적: 파트너의 포인트 사용 내역만 보여주는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/point/withdrawn
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { usePartnerPointData } from "@/hooks/partner/usePartnerPointData";
import type { PartnerPointHistory } from "@/types/domain/partner";

function PartnerWithdrawnPointPage() {
  const { history, summary } = usePartnerPointData();

  const filterWithdrawnHistory = (h: PartnerPointHistory) =>
    h.type === "withdrawn" || h.type === "returned";

  return (
    <PartnerPointPageLayout
      activePointTab="withdrawn"
      historyData={history}
      summary={summary}
      filterHistory={filterWithdrawnHistory}
    />
  );
}

export default withPartnerAuth(PartnerWithdrawnPointPage);
