/**
 * 캠페인 목록 컴포넌트 (Campaign List Component)
 *
 * 📚 학습 포인트:
 * 1. 조건부 렌더링으로 다른 UI 표시
 * 2. 배열 필터링과 map을 통한 리스트 렌더링
 * 3. 컴포넌트 간 분기 처리와 역할 분담
 *
 * 🎯 기능:
 * - 선택된 탭에 따라 필터링된 캠페인 목록 표시
 * - 패널티 탭: PenaltyContent 컴포넌트 표시
 * - 나머지 탭: 해당 상태의 캠페인 카드 목록 표시
 */

import type { CampaignApplication, StatTab } from "@/types/campaignManagement";
import CampaignCard from "./CampaignCard";
import PenaltyContent from "./PenaltyContent"; // 패널티 컴포넌트 다시 import
import styles from "../../../styles/user/campaign_management/campaign_management.module.css";

interface CampaignListProps {
  campaigns: CampaignApplication[];
  activeStatTab: StatTab;
}

/**
 * 캠페인 목록을 표시하는 컴포넌트
 * - 패널티 탭: PenaltyContent 컴포넌트 표시
 * - 그 외: 해당 상태의 캠페인 카드 목록
 */
export default function CampaignList({
  campaigns,
  activeStatTab,
}: CampaignListProps) {
  /* ========================================
     패널티 탭 처리
     - 패널티 탭인 경우 PenaltyContent 컴포넌트 렌더링
  ======================================== */
  if (activeStatTab === "패널티") {
    return <PenaltyContent />;
  }

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
      <div className={styles.empty_state}>
        <p>{activeStatTab} 상태의 캠페인이 없습니다.</p>
      </div>
    );
  }

  // 캠페인 카드 목록 렌더링
  return (
    <>
      {filteredCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          activeTab={activeStatTab}
        />
      ))}
    </>
  );
}
