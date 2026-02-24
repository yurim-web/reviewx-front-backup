/* ========================================
   📅 예정 탭 페이지
   ======================================== */

/**
 * 예정 탭 페이지
 *
 * 목적: 예정 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/scheduled
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function ScheduledPage() {
  return <CampaignManagementTabPage statTab="예정" />;
}
