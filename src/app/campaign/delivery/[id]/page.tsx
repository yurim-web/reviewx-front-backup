/* ========================================
   🚚 배송형 캠페인 상세 페이지
   ======================================== */

/**
 * 배송형 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /delivery/[id] (기존 /user/delivery/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: deliveryCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionDelivery from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionDelivery";
import Toast from "@/components/common/toast/Toast";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";

interface DeliveryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DeliveryDetailPage({
  params,
}: DeliveryDetailPageProps) {
  const { id } = use(params);
  const campaign = deliveryCampaigns.find((c) => String(c.id) === id);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
            dayCount={campaign.dayCount}
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
