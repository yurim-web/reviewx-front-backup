/* ========================================
   🚶 방문형 캠페인 상세 페이지
   ======================================== */

/**
 * 방문형 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /visit/[id] (기존 /user/visit/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: visitCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModalType3 from "@/components/user/campaign_detail/modal/ApplicationModalType3";
import DetailGuidelinesSectionVisit from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionVisit";
import { visitCampaigns } from "@/data/user/visit/visitCampaigns";

interface VisitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitDetailPage({ params }: VisitDetailPageProps) {
  const { id } = use(params);
  const campaign = visitCampaigns.find((c) => String(c.id) === String(id));

  if (!campaign) return notFound();

  return (
    <CampaignDetailPage
      campaign={campaign}
      altText="visit_tag"
      additionalSchedules={[
        {
          label: "등록 기간",
          value: campaign.detailedSchedule.purchasePeriod,
        },
      ]}
      guidelinesComponent={
        <DetailGuidelinesSectionVisit
          description={campaign.description}
          visitAddress={campaign.visitAddress}
          addressGuide={campaign.addressGuide}
          visitLink={campaign.visitLink}
          keyword={campaign.keyword}
          onCopyVisitAddress={() => {
            if (campaign.visitAddress) {
              navigator.clipboard.writeText(campaign.visitAddress);
              alert("방문 주소가 복사되었습니다!");
            }
          }}
          onCopyVisitLink={() => {
            if (campaign.visitLink) {
              navigator.clipboard.writeText(campaign.visitLink);
              alert("방문 링크가 복사되었습니다!");
            }
          }}
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
