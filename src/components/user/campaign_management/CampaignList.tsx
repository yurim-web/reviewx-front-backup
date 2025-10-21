/* ========================================
   📝 캠페인 목록 컴포넌트
   ======================================== */

/**
 * 캠페인 목록 컴포넌트
 *
 * 목적: 캠페인 관리 페이지에서 선택된 탭에 따라 필터링된 캠페인 목록을 표시하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 선택된 탭에 따라 필터링된 캠페인 목록 표시
 * - 패널티 탭: PenaltyContent 컴포넌트 표시
 * - 나머지 탭: 해당 상태의 캠페인 카드 목록 표시
 * - 빈 상태 메시지 표시 (해당 상태의 캠페인이 없는 경우)
 * - 조건부 렌더링으로 다른 UI 표시
 */

import type { CampaignApplication, StatTab } from "@/types/campaignManagement";
import CampaignCard from "./CampaignCard";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

interface CampaignListProps {
  campaigns: CampaignApplication[];
  activeStatTab: StatTab;
  onTabChange?: (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  ) => void;
}

/**
 * 캠페인 목록을 표시하는 컴포넌트
 * - 패널티 탭: PenaltyContent 컴포넌트 표시
 * - 그 외: 해당 상태의 캠페인 카드 목록
 */
export default function CampaignList({
  campaigns,
  activeStatTab,
  onTabChange,
}: CampaignListProps) {
  /* ========================================
     패널티 탭은 메인 페이지에서 별도 처리
  ======================================== */

  /**
   * 현재 선택된 탭에 맞는 캠페인만 필터링
   */
  const filteredCampaigns = campaigns.filter((campaign) => {
    switch (activeStatTab) {
      case "신청":
        return campaign.status === "신청";
      case "선정":
        return campaign.status === "선정";
      case "완료":
        return campaign.status === "완료";
      case "취소/반려":
        return campaign.status === "취소/반려";
      default:
        return true;
    }
  });

  // 필터링 결과가 없는 경우 빈 상태 메시지 표시
  if (filteredCampaigns.length === 0) {
    return (
      <div className={cardStyles.empty_state}>
        <p>{activeStatTab} 상태의 캠페인이 없습니다.</p>
      </div>
    );
  }

  // 캠페인 카드 목록 렌더링
  return (
    <div className={cardStyles.campaign_list}>
      {filteredCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          activeTab={activeStatTab}
          onTabChange={onTabChange}
        />
      ))}
    </div>
  );
}
