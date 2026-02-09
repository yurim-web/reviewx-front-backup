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

import type { CampaignApplication, StatTab } from "@/types/domain/user";
import CampaignCard from "./CampaignCard";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

interface CampaignListProps {
  campaigns: CampaignApplication[];
  activeStatTab: StatTab;
  onTabChange?: (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티"
  ) => void;
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
        return campaign.status === "신청" || campaign.status === "선정" || campaign.status === "완료" || campaign.status === "취소/반려";
      default:
        return true;
    }
  });

  // 필터링 결과가 없는 경우 빈 상태 메시지 표시
  if (filteredCampaigns.length === 0) {
    // 필터 적용 여부 확인
    // originalCampaigns가 있고, 그 길이가 0보다 크면 필터가 적용된 것으로 판단
    const hasOriginalCampaigns =
      originalCampaigns && originalCampaigns.length > 0;

    // 필터가 적용된 경우: "일치하는 결과가 없습니다."
    if (hasOriginalCampaigns) {
      return (
        <div className={cardStyles.empty_state}>
          <p>일치하는 결과가 없습니다.</p>
        </div>
      );
    }

    // 필터가 적용되지 않은 경우: 탭별 메시지 표시
    const emptyMessages: Record<StatTab, string> = {
      신청: "신청 내역이 없습니다.",
      선정: "선정 내역이 없습니다.",
      완료: "완료 내역이 없습니다.",
      "취소/반려": "취소/반려 내역이 없습니다.",
      전체: "신청·선정·완료·취소/반려 내역이 없습니다.",
      패널티: "패널티 내역이 없습니다.",
      예정: "예정 내역이 없습니다.",
    };

    return (
      <div className={cardStyles.empty_state}>
        <p>{emptyMessages[activeStatTab] || "내역이 없습니다."}</p>
      </div>
    );
  }

  // 전체 탭에서는 카드별 실제 상태(선정/완료/취소·반려)에 맞는 카드 컴포넌트 표시
  const resolvedActiveTab = activeStatTab === "전체" ? undefined : activeStatTab;

  return (
    <div className={cardStyles.campaign_list}>
      {filteredCampaigns.map((campaign, index) => (
        <CampaignCard
          key={activeStatTab === "전체" ? `${campaign.id}-${campaign.status}-${index}` : campaign.id}
          campaign={campaign}
          activeTab={resolvedActiveTab ?? campaign.status}
          onTabChange={onTabChange}
          onCancelSuccess={onCancelSuccess}
        />
      ))}
    </div>
  );
}
