/* ========================================
   파트너 포인트 사용 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 사용 내역 페이지
 *
 * API: GET /partner/points?type=USE
 *
 * 사용 페이지:
 * - /partner/point/withdrawn
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import Loading from "@/app/loading";
import { usePartnerPointList } from "@/hooks/partner/point/usePartnerPoints";

function PartnerWithdrawnPointPage() {
  const { history, summary, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartnerPointList("USE");

  if (isLoading) return <Loading />;

  return (
    <PartnerPointPageLayout
      activePointTab="withdrawn"
      historyData={history}
      summary={summary}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  );
}

export default withPartnerAuth(PartnerWithdrawnPointPage);
