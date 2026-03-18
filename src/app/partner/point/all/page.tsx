/* ========================================
   파트너 전체 포인트 내역 페이지
   ======================================== */

/**
 * 파트너 전체 포인트 내역 페이지
 *
 * 목적: 모든 파트너 포인트 내역을 보여주는 독립적인 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/point/all
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { usePartnerPointData } from "@/hooks/partner/usePartnerPointData";

function PartnerAllPointPage() {
  const { history, summary } = usePartnerPointData();

  return <PartnerPointPageLayout activePointTab="all" historyData={history} summary={summary} />;
}

export default withPartnerAuth(PartnerAllPointPage);
