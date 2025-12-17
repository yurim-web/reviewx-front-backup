/* ========================================
   📰 기자단 캠페인 상세 페이지
   ======================================== */

/**
 * 기자단 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /reporter/[id] (기존 /user/reporter/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: reporterCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModalType3 from "@/components/user/campaign_detail/modal/ApplicationModalType3";
import DetailGuidelinesSectionReporter from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReporter";
import { reporterCampaigns } from "@/data/user/reporter/reporterCampaigns";

interface ReporterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReporterDetailPage({
  params,
}: ReporterDetailPageProps) {
  // Next.js 15에서 params는 Promise이므로 React.use()로 unwrap
  const { id } = use(params);
  const campaign = reporterCampaigns.find((c) => String(c.id) === id);

  if (!campaign) return notFound();

  return (
    <CampaignDetailPage
      campaign={campaign}
      altText="reporter_tag"
      additionalSchedules={[
        {
          label: "등록 기간",
          value: campaign.detailedSchedule.registrationPeriod,
        },
      ]}
      guidelinesComponent={
        <DetailGuidelinesSectionReporter
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
