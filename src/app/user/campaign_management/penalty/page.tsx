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
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import { userPenaltyData, userPenaltyStatus } from "@/data/user/penaltyData";

export default function PenaltyPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("패널티");

  const handleStatTabChange = (tab: "신청" | "선정" | "완료" | "취소/반려" | "전체" | "패널티") => {
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
        />

        <div className={cardStyles.penalty_list}>
          <PenaltyContent penaltyData={userPenaltyData} userStatus={userPenaltyStatus} />
        </div>
      </div>
    </div>
  );
}
