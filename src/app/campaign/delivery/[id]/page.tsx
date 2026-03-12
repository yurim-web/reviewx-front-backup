/* ========================================
   배송형 캠페인 상세 페이지
   ======================================== */

/**
 * DeliveryDetailPage
 *
 * 목적: 배송형 캠페인 상세 정보 표시
 *
 * 사용 페이지:
 * - /campaign/delivery/[id] (배송형 캠페인 상세)
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionDelivery from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionDelivery";
import Toast from "@/components/common/toast/Toast";
import type { DeliveryCampaignData } from "@/data/campaign/delivery/deliveryCampaigns";
import { useCampaignDetail } from "@/hooks/user/campaign/useCampaignDetail";
import type { CampaignDetailAdapted } from "@/hooks/user/campaign/useCampaignDetail";

interface DeliveryDetailPageProps {
  params: Promise<{ id: string }>;
}

/** CampaignDetailAdapted → DeliveryCampaignData 변환 */
function adaptApiToDelivery(api: CampaignDetailAdapted): DeliveryCampaignData {
  return {
    id: api.id,
    title: api.title,
    category: "배송형",
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
    promotionLink: "",
    requirements: api.requirements,
    guidelineTexts: api.guidelineTexts,
    isUrgent: api.isUrgent,
  };
}

export default function DeliveryDetailPage({ params }: DeliveryDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<DeliveryCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: apiCampaign, isLoading: isApiLoading } = useCampaignDetail(id);

  // 서버 API 데이터로 로드
  useEffect(() => {
    if (isApiLoading) return;

    if (apiCampaign) {
      setCampaign(adaptApiToDelivery(apiCampaign));
    } else {
      setCampaign(null);
    }
    setIsLoading(false);
  }, [id, apiCampaign, isApiLoading]);

  // 로딩 중일 때는 아무것도 표시하지 않음 (또는 로딩 스피너 표시)
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로딩이 완료되었는데 캠페인이 없으면 404
  if (!campaign) return notFound();

  return (
    <>
      <CampaignDetailPage
        campaign={campaign}
        altText="delivery_tag"
        additionalSchedules={[
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionDelivery
            description={campaign.description}
            promotionLink={campaign.promotionLink}
            keyword={campaign.keyword}
            onCopyPromotionLink={async () => {
              if (campaign.promotionLink) {
                await navigator.clipboard.writeText(campaign.promotionLink);
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
            type="delivery"
            campaignId={campaign.id}
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
            channelName={campaign.channel}
            channelUrl={undefined} // TODO: 사용자의 실제 연결된 채널 URL을 가져와야 함
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
