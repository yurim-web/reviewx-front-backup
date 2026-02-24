/* ========================================
🛒 캠페인 등록 페이지 (구매평)
======================================== */

/**
 * 캠페인 등록 페이지 (구매평)
 *
 * 목적: 파트너가 구매평 캠페인을 등록할 수 있는 페이지
 *
 * 사용 페이지:
 * - /partner/campaign/create/review
 */

"use client";

import { useCampaignCreate } from "@/hooks/useCampaignCreate";
import { registerReviewCampaign } from "@/utils/partner/campaignRegistration/reviewRegistration";
import ReviewCampaignForm from "@/components/partner/campaign_create_form/ReviewCampaignForm";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

export default function ReviewCampaignCreatePage() {
  const { user, isSubmitting, isUrgent, setIsUrgent, handleSubmit, renderModals } = useCampaignCreate({
    onRegister: async (formData, isUrgent) => {
      return await registerReviewCampaign(formData, isUrgent, user?.id || "partner_test_001");
    },
    useConfirmModal: true,
  });

  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      <div className={layoutStyles.main_content}>
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />
        <ReviewCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onUrgentLoad={setIsUrgent}
          isUrgent={isUrgent}
        />
        {renderModals()}
      </div>
    </div>
  );
}
