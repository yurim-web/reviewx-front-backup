/* ========================================
   🚀 진행 탭 페이지
   ======================================== */

/**
 * 진행 탭 페이지
 *
 * 목적: 진행 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/progress
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function ProgressPage() {
  return <CampaignManagementTabPage statTab="진행" />;
}
