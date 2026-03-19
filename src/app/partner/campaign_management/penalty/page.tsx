/* ========================================
   ⚠️ 패널티 탭 페이지 (통합 레이아웃 사용)
   ======================================== */

/**
 * 패널티 탭 페이지
 *
 * 목적: 패널티 상태의 캠페인 목록을 보여주는 페이지입니다.
 * 이제 공통 헤더 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_management/penalty
 */

"use client";

import { useState } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import Loading from "@/app/loading";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { PartnerStatTab } from "@/types/domain/partner";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import cardStyles from "@/styles/partner/campaign_card.module.css";
import { usePartnerCampaigns } from "@/hooks/partner/campaign_management/usePartnerCampaigns";
import { usePartnerPenalty } from "@/hooks/partner/usePartnerPenalty";

/**
 * 패널티 탭 페이지 컴포넌트
 */
export default function PenaltyPage() {
  // 패널티 데이터 (API → fallback: 정적 목업)
  const { penaltyData, penaltyStatus, isLoading } = usePartnerPenalty();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 - 패널티 탭이 활성화된 상태로 설정
  const [activeStatTab] = useState<PartnerStatTab>("패널티");

  // 캠페인 통계 데이터 (메인 캠페인 관리 페이지와 동일한 로직 사용)
  const { stats } = usePartnerCampaigns("전체");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={undefined}
          apiStats={stats}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent penaltyData={penaltyData} userStatus={penaltyStatus} />
        </div>
      </div>
    </div>
  );
}
