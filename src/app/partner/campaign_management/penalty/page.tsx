/* ========================================
   ⚠️ 패널티 탭 페이지 (통합 레이아웃 사용)
   ======================================== */

/**
 * 패널티 탭 페이지
 *
 * 목적: 패널티 상태의 캠페인 목록을 보여주는 페이지입니다.
 * 이제 공통 헤더 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * 페이지 경로:
 * - /partner/campaign_management/penalty
 *
 * 주요 기능:
 * - 패널티 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 * - 공통 헤더 컴포넌트 사용으로 일관성 보장
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import type { PartnerMainTab } from "@/types/partner/partner";
import type { PartnerStatTab } from "@/types/partner/partner";
import layoutStyles from "../../../../styles/partner/layout.module.css";
import cardStyles from "../../../../styles/partner/campaign_card.module.css";
import {
  partnerPenaltyData,
  partnerPenaltyStatus,
} from "@/data/partner/penaltyData";

/**
 * 패널티 탭 페이지 컴포넌트
 */
export default function PenaltyPage() {
  const router = useRouter();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 - 패널티 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("패널티");

  /**
   * 통계 탭 변경 핸들러
   * 패널티가 아닌 다른 탭을 클릭하면 캠페인 관리 페이지로 이동
   */
  const handleStatTabChange = (tab: PartnerStatTab) => {
    if (tab === "패널티") {
      setActiveStatTab(tab);
    } else {
      // 패널티가 아닌 탭을 클릭하면 캠페인 관리 페이지로 이동
      router.push("/partner/campaign_management");
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent
            penaltyData={partnerPenaltyData}
            userStatus={partnerPenaltyStatus}
          />
        </div>
      </div>
    </div>
  );
}
