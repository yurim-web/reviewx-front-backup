/* ========================================
   ❌ 취소 탭 페이지
   ======================================== */

/**
 * 취소 탭 페이지
 *
 * 목적: 취소 상태의 캠페인 목록을 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/cancelled
 */

import CampaignManagementTabPage from "@/components/partner/campaign_management/CampaignManagementTabPage";

export default function CancelledPage() {
  return <CampaignManagementTabPage statTab="취소" />;
}
