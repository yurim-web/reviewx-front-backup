/* ========================================
   SA 관리자 진행 상황 페이지
   ======================================== */

/**
 * ProgressPage
 *
 * 목적: SA 관리자가 캠페인 진행 상황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress
 */

"use client";

import ProgressPageCommon from "@/components/manager/common/campaign/progress/ProgressPageCommon";
import Loading from "@/app/loading";
import { useSACampaignProgress } from "@/hooks/manager/sa/campaign/useSACampaignProgress";

export default function ProgressPage() {
  const { campaigns, isLoading, reportCampaign } = useSACampaignProgress();
  if (isLoading) return <Loading />;
  return (
    <ProgressPageCommon manager_type="sa" campaigns={campaigns} onReportCampaign={reportCampaign} />
  );
}
