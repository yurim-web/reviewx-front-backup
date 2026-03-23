/* ========================================
   파트너 전체 포인트 내역 페이지
   ======================================== */

/**
 * 파트너 전체 포인트 내역 페이지
 *
 * API: GET /partner/points?type=ALL
 *
 * 사용 페이지:
 * - /partner/point/all
 */

"use client";

import { withPartnerAuth } from "@/components/auth/withAuth";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import Loading from "@/app/loading";
import { usePartnerPointList } from "@/hooks/partner/point/usePartnerPoints";

function PartnerAllPointPage() {
  const { history, summary, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePartnerPointList("ALL");

  if (isLoading) return <Loading />;

  return (
    <PartnerPointPageLayout
      activePointTab="all"
      historyData={history}
      summary={summary}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  );
}

export default withPartnerAuth(PartnerAllPointPage);
