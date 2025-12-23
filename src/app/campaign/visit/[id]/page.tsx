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
import { use, useState } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionVisit from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionVisit";
import Toast from "@/components/common/toast/Toast";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";

interface VisitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitDetailPage({ params }: VisitDetailPageProps) {
  const { id } = use(params);
  const campaign = visitCampaigns.find((c) => String(c.id) === String(id));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!campaign) return notFound();

  return (
    <>
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
            onCopyVisitAddress={async () => {
              if (campaign.visitAddress) {
                await navigator.clipboard.writeText(campaign.visitAddress);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            onCopyVisitLink={async () => {
              if (campaign.visitLink) {
                await navigator.clipboard.writeText(campaign.visitLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
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
            type="visit"
            dayCount={campaign.dayCount}
            channelName={campaign.channel}
            channelUrl={undefined}
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
