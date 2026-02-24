/* ========================================
   캠페인 카드 컴포넌트 (메인 라우터)
   ======================================== */

/**
 * 캠페인 카드 컴포넌트 (메인 라우터)
 *
 * 목적: activeTab에 따라 적절한 탭별 캠페인 카드 컴포넌트를 렌더링합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 *
 */

import type { CampaignApplication, StatTab } from "@/types/domain/user";
import ApplicationTabCard from "./campaigncard/ApplicationTabCard";
import SelectedTabCard from "./campaigncard/SelectedTabCard";
import CompletedTabCard from "./campaigncard/CompletedTabCard";
import RejectedTabCard from "./campaigncard/RejectedTabCard";
import PenaltyTabCard from "./campaigncard/PenaltyTabCard";

interface CampaignCardProps {
  campaign: CampaignApplication;
  activeTab: StatTab;
  onTabChange?: (tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티") => void;
  /** 신청 취소 성공 시 호출되는 콜백 함수 */
  onCancelSuccess?: (campaignId: string) => void;
}

export default function CampaignCard({ campaign, activeTab, onCancelSuccess }: CampaignCardProps) {
  switch (activeTab) {
    case "신청":
      return <ApplicationTabCard campaign={campaign} onCancelSuccess={onCancelSuccess} />;

    case "선정":
      return <SelectedTabCard campaign={campaign} />;

    case "완료":
      return <CompletedTabCard campaign={campaign} />;

    case "취소/반려":
      return <RejectedTabCard campaign={campaign} />;

    case "패널티":
      return <PenaltyTabCard campaign={campaign} />;

    default:
      // 기본값: 신청 탭으로 처리
      return <ApplicationTabCard campaign={campaign} onCancelSuccess={onCancelSuccess} />;
  }
}
