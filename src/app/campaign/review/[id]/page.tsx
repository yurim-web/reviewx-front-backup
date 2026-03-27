/* ========================================
   구매평 캠페인 상세 페이지
   ======================================== */

/**
 * ReviewDetailPage
 *
 * 목적: 구매평 캠페인 상세 정보 표시
 *
 * 사용 페이지:
 * - /campaign/review/[id] (구매평 캠페인 상세)
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReview from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReview";
import Toast from "@/components/common/toast/Toast";
import type { ReviewCampaignData } from "@/data/campaign/review/reviewCampaigns";
import { useCampaignDetail } from "@/hooks/user/campaign/useCampaignDetail";
import type { CampaignDetailAdapted } from "@/hooks/user/campaign/useCampaignDetail";
import Loading from "@/app/loading";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

function adaptApiToReview(api: CampaignDetailAdapted): ReviewCampaignData {
  return {
    id: api.id,
    title: api.title,
    category: "구매평",
    image: api.image,
    subcategory: api.subcategory,
    points: api.points,
    description: api.description,
    recruitment: api.recruitment,
    schedule: api.schedule,
    dayCount: api.dayCount,
    detailedSchedule: {
      applicationStart: api.detailedSchedule.applicationStart,
      applicationEnd: api.detailedSchedule.applicationEnd,
      announcement: api.detailedSchedule.announcement,
      purchasePeriod: api.detailedSchedule.purchasePeriod,
      registrationPeriod: api.detailedSchedule.registrationPeriod,
    },
    campaign_detail_image: api.detailImages[0] || api.image,
    campaign_detail_images: api.detailImages,
    channel: api.channel,
    keyword: api.keyword,
    requirements: api.requirements,
    guidelineTexts: api.guidelineTexts,
    isUrgent: api.isUrgent,
    purchaseLink: api.purchaseLink,
  };
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<ReviewCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: apiCampaign, isLoading: isApiLoading } = useCampaignDetail("purchase", id);

  // 서버 API 데이터로 로드
  useEffect(() => {
    if (isApiLoading) return;

    if (apiCampaign) {
      setCampaign(adaptApiToReview(apiCampaign));
    } else {
      setCampaign(null);
    }
    setIsLoading(false);
  }, [id, apiCampaign, isApiLoading]);

  if (isLoading) return <Loading />;

  // 로딩이 완료되었는데 캠페인이 없으면 404
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
            campaignId={campaign.id}
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
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
