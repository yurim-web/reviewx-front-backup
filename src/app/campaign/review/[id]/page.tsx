/* ========================================
   ⭐ 구매평 캠페인 상세 페이지
   ======================================== */

/**
 * 구매평 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /review/[id] (기존 /user/review/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: reviewCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReview from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReview";
import Toast from "@/components/common/toast/Toast";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = use(params);
  const campaign = reviewCampaigns.find((c) => String(c.id) === id);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!campaign) return notFound();

  return (
    <>
      <CampaignDetailPage
        campaign={campaign}
        altText="review_tag"
        additionalSchedules={[
          {
            label: "구매 기간",
            value: campaign.detailedSchedule.purchasePeriod,
          },
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionReview
            description={campaign.description}
            purchaseLink={campaign.purchaseLink}
            keyword={campaign.keyword}
            onCopyPurchaseLink={async () => {
              if (campaign.purchaseLink) {
                await navigator.clipboard.writeText(campaign.purchaseLink);
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
            type="review"
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
