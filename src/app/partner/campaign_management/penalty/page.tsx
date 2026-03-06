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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import Loading from "@/app/loading";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { PartnerStatTab } from "@/types/domain/partner";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import cardStyles from "../../../../styles/partner/campaign_card.module.css";
import { partnerPenaltyData, partnerPenaltyStatus } from "@/data/partner/penaltyData";
import { usePartnerCampaigns } from "@/hooks/partner/campaign_management/usePartnerCampaigns";

/**
 * 패널티 탭 페이지 컴포넌트
 */
export default function PenaltyPage() {
  const router = useRouter();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");

  // 통계 탭 상태 - 패널티 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("패널티");

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 캠페인 통계 데이터 (메인 캠페인 관리 페이지와 동일한 로직 사용)
  const { stats } = usePartnerCampaigns("전체");

  /**
   * 통계 탭 변경 핸들러
   * 패널티가 아닌 다른 탭을 클릭하면 캠페인 관리 페이지로 이동
   */
  const handleStatTabChange = (tab: PartnerStatTab) => {
    if (tab === "패널티") {
      setActiveStatTab(tab);
    } else {
      // 패널티가 아닌 탭을 클릭하면 각 탭 전용 페이지로 이동
      switch (tab) {
        case "전체":
          router.push("/partner/campaign_management");
          break;
        case "예정":
          router.push("/partner/campaign_management/scheduled");
          break;
        case "신청":
          router.push("/partner/campaign_management/applied");
          break;
        case "진행":
          router.push("/partner/campaign_management/progress");
          break;
        case "종료":
          router.push("/partner/campaign_management/completed");
          break;
        case "취소":
          router.push("/partner/campaign_management/cancelled");
          break;
        case "연장 요청":
          router.push("/partner/campaign_management/extension-request");
          break;
      }
    }
  };

  /**
   * 초기 로딩
   *
   * 설명:
   * - 페이지가 로드되면 로딩 상태를 표시합니다.
   * - 데이터 로드 후 로딩을 해제합니다.
   * - 안전장치로 최대 2초 후에는 강제로 로딩을 해제합니다.
   */
  useEffect(() => {
    // 탭 변경 시 로딩 시작
    setIsLoading(true);

    // 데이터가 준비되면 로딩 해제
    requestAnimationFrame(() => {
      setIsLoading(false);
    });

    // 안전장치: 최대 2초 후에는 강제로 로딩 해제
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(safetyTimer);
  }, [activeStatTab]);

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
          setActiveStatTab={handleStatTabChange}
          apiStats={stats}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent penaltyData={partnerPenaltyData} userStatus={partnerPenaltyStatus} />
        </div>
      </div>
    </div>
  );
}
