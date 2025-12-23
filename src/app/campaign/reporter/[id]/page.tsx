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
import { use, useState } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReporter from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReporter";
import Toast from "@/components/common/toast/Toast";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

interface ReporterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReporterDetailPage({
  params,
}: ReporterDetailPageProps) {
  const { id } = use(params);
  const campaign = reporterCampaigns.find((c) => String(c.id) === id);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!campaign) return notFound();

  return (
    <>
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
            onCopyProductLink={async () => {
              if (campaign.productLink) {
                await navigator.clipboard.writeText(campaign.productLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            keyword={campaign.keyword}
            onCopyKeyword={async () => {
              await navigator.clipboard.writeText(campaign.keyword);
              setToastMessage("복사되었습니다.");
              setShowToast(true);
            }}
            requirements={campaign.requirements}
            guidelineTexts={campaign.guidelineTexts}
          />
        }
        renderApplicationModal={(isOpen, onClose, campaign) => (
          <ApplicationModal
            isOpen={isOpen}
            onClose={onClose}
            type="reporter"
            dayCount={campaign.dayCount}
          />
        )}
      />
      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </>
  );
}
