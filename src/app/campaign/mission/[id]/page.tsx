/* ========================================
   🎯 미션형 캠페인 상세 페이지
   ======================================== */

/**
 * 미션형 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /mission/[id] (기존 /user/mission/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: missionCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModalType3 from "@/components/user/campaign_detail/modal/ApplicationModalType3";
import DetailGuidelinesSectionMission from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionMission";
import { missionCampaigns } from "@/data/user/mission/missionCampaigns";

interface MissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MissionDetailPage({ params }: MissionDetailPageProps) {
  // Next.js 15에서 params는 Promise이므로 React.use()로 unwrap
  const { id } = use(params);
  const campaign = missionCampaigns.find((c) => String(c.id) === id);

  if (!campaign) return notFound();

  return (
    <CampaignDetailPage
      campaign={campaign}
      altText="mission_tag"
      additionalSchedules={[
        {
          label: "등록 기간",
          value: campaign.detailedSchedule.registrationPeriod,
        },
      ]}
      guidelinesComponent={
        <DetailGuidelinesSectionMission
          description={campaign.description}
          productLink={campaign.productLink}
          onCopyProductLink={() => {
            if (campaign.productLink) {
              navigator.clipboard.writeText(campaign.productLink);
              alert("홍보링크가 복사되었습니다!");
            }
          }}
          keyword={campaign.keyword}
          onCopyKeyword={() => {
            navigator.clipboard.writeText(campaign.keyword);
            alert("키워드가 복사되었습니다!");
          }}
          requirements={campaign.requirements}
          guidelineTexts={campaign.guidelineTexts}
        />
      }
      renderApplicationModal={(isOpen, onClose) => (
        <ApplicationModalType3 isOpen={isOpen} onClose={onClose} />
      )}
    />
  );
}
