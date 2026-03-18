/* ========================================
   캠페인 관리 - 패널티 페이지
   ======================================== */

/**
 * PenaltyPage
 *
 * 목적: 사용자의 패널티 현황과 내역을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/penalty (패널티 탭)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import type { MainTab, StatTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useUserPenalty } from "@/hooks/user/campaign_management/useUserPenalty";
import { useAllCampaigns } from "@/hooks/user/campaign_management/useAllCampaigns";
import Loading from "@/app/loading";

function PenaltyPage() {
  const { penaltyData, penaltyStatus, isLoading: penaltyLoading } = useUserPenalty();
  const { stats, isLoading: campaignsLoading } = useAllCampaigns();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab, setActiveStatTab] = useState<StatTab>("패널티");

  if (penaltyLoading || campaignsLoading) return <Loading />;

  const handleStatTabChange = (tab: StatTab) => {
    if (tab === "패널티") {
      setActiveStatTab(tab);
    } else {
      switch (tab) {
        case "전체":
          router.push("/user/campaign_management/all");
          break;
        case "신청":
          router.push("/user/campaign_management/applied");
          break;
        case "선정":
          router.push("/user/campaign_management/selected");
          break;
        case "완료":
          router.push("/user/campaign_management/completed");
          break;
        case "취소/반려":
          router.push("/user/campaign_management/cancelled");
          break;
      }
    }
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
          stats={stats}
        />

        <div className={cardStyles.penalty_list}>
          <PenaltyContent penaltyData={penaltyData} userStatus={penaltyStatus} />
        </div>
      </div>
    </div>
  );
}

export default withUserAuth(PenaltyPage);
