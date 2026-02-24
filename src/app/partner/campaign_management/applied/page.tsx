/* ========================================
   📝 신청 탭 페이지
   ======================================== */

/**
 * 신청 탭 페이지
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/applied
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function AppliedPage() {
  return <CampaignManagementTabPage statTab="신청" />;
}
