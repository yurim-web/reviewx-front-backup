/* ========================================
   파트너 포인트 충전 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 충전 내역 페이지
 *
 * API: GET /partner/points?type=CHARGE
 *
 * 사용 페이지:
 * - /partner/point/earned
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import Loading from "@/app/loading";
import { usePartnerPointList } from "@/hooks/partner/point/usePartnerPoints";

function PartnerEarnedPointPage() {
  const { history, summary, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartnerPointList("CHARGE");

  if (isLoading) return <Loading />;

  return (
    <PartnerPointPageLayout
      activePointTab="earned"
      historyData={history}
      summary={summary}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  );
}

export default withPartnerAuth(PartnerEarnedPointPage);
