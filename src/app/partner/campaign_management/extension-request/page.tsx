/* ========================================
   ⏰ 연장 요청 탭 페이지
   ======================================== */

/**
 * 연장 요청 탭 페이지
 *
 * 목적: 연장 요청 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/extension-request
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function ExtensionRequestPage() {
  return <CampaignManagementTabPage statTab="연장 요청" />;
}
