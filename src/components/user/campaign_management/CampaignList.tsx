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
 */

import type { CampaignApplication, StatTab } from "@/types/domain/user";
import CampaignCard from "./CampaignCard";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

interface CampaignListProps {
  campaigns: CampaignApplication[];
  activeStatTab: StatTab;
  onTabChange?: (tab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티") => void;
  /** 신청 취소 성공 시 호출되는 콜백 함수 */
  onCancelSuccess?: (campaignId: string) => void;
  /** 필터 적용 전 원본 캠페인 목록 (필터 적용 여부 확인용) */
  originalCampaigns?: CampaignApplication[];
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
  onCancelSuccess,
  originalCampaigns,
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
      case "전체":
        return (
          campaign.status === "신청" ||
          campaign.status === "선정" ||
          campaign.status === "완료" ||
          campaign.status === "취소/반려"
        );
      default:
        return true;
    }
  });

  if (filteredCampaigns.length === 0) {
    // 필터가 적용된 상태에서 결과 없음
    const hasActiveFilters = originalCampaigns && originalCampaigns.length > 0;
    if (hasActiveFilters) {
      return (
        <div className={cardStyles.empty_state}>
          <p>일치하는 결과가 없습니다.</p>
        </div>
      );
    }

    // 데이터 자체가 없음 → 탭별 메시지
    const emptyMessages: Partial<Record<StatTab, string>> = {
      전체: "전체 내역이 없습니다.",
      신청: "신청 내역이 없습니다.",
      선정: "선정 내역이 없습니다.",
      완료: "완료 내역이 없습니다.",
      "취소/반려": "취소/반려 내역이 없습니다.",
    };
    const message = emptyMessages[activeStatTab] ?? "내역이 없습니다.";
    return (
      <div className={cardStyles.empty_state}>
        <p>{message}</p>
      </div>
    );
  }

  // 전체 탭에서는 카드별 실제 상태(선정/완료/취소·반려)에 맞는 카드 컴포넌트 표시
  const resolvedActiveTab = activeStatTab === "전체" ? undefined : activeStatTab;

  return (
    <div className={cardStyles.campaign_list}>
      {filteredCampaigns.map((campaign, index) => (
        <CampaignCard
          key={
            activeStatTab === "전체" ? `${campaign.id}-${campaign.status}-${index}` : campaign.id
          }
          campaign={campaign}
          activeTab={resolvedActiveTab ?? campaign.status}
          onTabChange={onTabChange}
          onCancelSuccess={onCancelSuccess}
        />
      ))}
    </div>
  );
}
