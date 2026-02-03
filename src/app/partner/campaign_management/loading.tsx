/* ========================================
   ⏳ 캠페인 관리 페이지 로딩
   ======================================== */

/**
 * 캠페인 관리 페이지 로딩 컴포넌트
 *
 * 목적: Next.js의 기본 로딩 폴백을 커스텀 로딩 화면으로 대체합니다.
 *
 * 사용 위치:
 * - /partner/campaign_management/** (모든 하위 경로)
 */

import Loading from "@/app/loading";

export default function CampaignManagementLoading() {
  return <Loading />;
}
