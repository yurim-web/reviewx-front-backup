/* ========================================
   ✅ 종료 탭 페이지
   ======================================== */

/**
 * 종료 탭 페이지
 *
 * 목적: 종료 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/completed
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function CompletedPage() {
  return <CampaignManagementTabPage statTab="종료" />;
}
