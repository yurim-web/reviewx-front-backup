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
import { use } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionDelivery from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionDelivery";
import { deliveryCampaigns } from "@/data/user/delivery/deliveryCampaigns";

interface DeliveryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DeliveryDetailPage({
  params,
}: DeliveryDetailPageProps) {
  // Next.js 15에서 params는 Promise이므로 React.use()로 unwrap
  const { id } = use(params);
  const campaign = deliveryCampaigns.find((c) => String(c.id) === id);

  if (!campaign) return notFound();

  return (
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
          onCopyPromotionLink={() => {
            if (campaign.promotionLink) {
              navigator.clipboard.writeText(campaign.promotionLink);
              alert("홍보링크가 복사되었습니다!");
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
        <ApplicationModal isOpen={isOpen} onClose={onClose} />
      )}
    />
  );
}
