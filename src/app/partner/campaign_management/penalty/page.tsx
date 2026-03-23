/* ========================================
   패널티 내역 페이지
   ======================================== */

/**
 * 패널티 내역 페이지
 *
 * API: GET /partner/account/penalty?tab={warning|caution|blocked}
 *
 * 사용 페이지:
 * - /partner/campaign_management/penalty
 */

"use client";

import { useState } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import Loading from "@/app/loading";
import type { PartnerMainTab, PartnerStatTab } from "@/types/domain/partner";
import type { PenaltyTab } from "@/types/api/partnerPenalty";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import cardStyles from "@/styles/partner/campaign_card.module.css";
import { usePartnerCampaigns } from "@/hooks/partner/campaign_management/usePartnerCampaigns";
import { usePartnerPenalty } from "@/hooks/partner/usePartnerPenalty";

const GRADE_LABELS: Record<string, string> = {
  EXCELLENT: "우수",
  NORMAL: "일반",
  CAUTION: "주의",
  WARNING: "경고",
  RESTRICTED: "이용제한",
};

export default function PenaltyPage() {
  const [tab, setTab] = useState<PenaltyTab>("warning");
  const { data, isLoading } = usePartnerPenalty(tab);

  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
  const [activeStatTab] = useState<PartnerStatTab>("패널티");
  const { stats } = usePartnerCampaigns("전체");

  if (isLoading) {
    return <Loading />;
  }

  const summary = data?.summary;
  const penalties = data?.penalties ?? [];

  // API 응답 → PenaltyContent props 변환
  const penaltyData = penalties.map((p) => ({
    id: String(p.penaltyHistoryId),
    type: (tab === "warning" ? "경고" : tab === "caution" ? "주의" : "정지") as
      | "경고"
      | "주의"
      | "정지"
      | "제재",
    title: p.penaltyReason,
    campaignTitle: p.relatedCampaignTitle ?? undefined,
    date: p.imposedAt.slice(0, 10),
    penaltyCode: p.penaltyCode,
    penaltyScore: p.penaltyScore,
    penaltyDetail: p.penaltyDetail,
  }));

  // 등급 → 상태 매핑
  const gradeToStatus = (
    grade: string
  ):
    | "활동 가능"
    | "경고 조치"
    | "이용 정지 7일"
    | "이용 정지 15일"
    | "이용 정지 30일"
    | "영구 정지" => {
    const score = summary?.totalPenaltyScore ?? 0;
    if (grade === "EXCELLENT") return "활동 가능";
    if (grade === "NORMAL") return "경고 조치";
    if (grade === "CAUTION") {
      if (score <= 120) return "이용 정지 7일";
      if (score <= 140) return "이용 정지 15일";
      return "이용 정지 30일";
    }
    if (grade === "RESTRICTED") return "영구 정지";
    return "경고 조치";
  };

  const userStatus = {
    currentStatus: gradeToStatus(summary?.currentGrade ?? "NORMAL"),
    penaltyCount:
      (summary?.warningCount ?? 0) + (summary?.cautionCount ?? 0) + (summary?.blockedCount ?? 0),
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={undefined}
          apiStats={stats}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent penaltyData={penaltyData} userStatus={userStatus} />
        </div>
      </div>
    </div>
  );
}
