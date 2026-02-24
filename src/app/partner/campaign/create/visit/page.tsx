/* ========================================
📍 캠페인 등록 페이지 (방문형)
======================================== */

/**
 * 캠페인 등록 페이지 (방문형)
 *
 * 목적: 파트너가 방문형 캠페인을 등록할 수 있는 페이지
 *
 * 사용 페이지:
 * - /partner/campaign/create/visit
 */

"use client";

import { useCampaignCreate } from "@/hooks/useCampaignCreate";
import { registerVisitCampaign } from "@/utils/partner/campaignRegistration/visitRegistration";
import VisitCampaignForm from "@/components/partner/campaign_create_form/VisitCampaignForm";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

export default function VisitCampaignCreatePage() {
  const { user, isSubmitting, isUrgent, setIsUrgent, handleSubmit, renderModals } = useCampaignCreate({
    onRegister: async (formData, isUrgent) => {
      return await registerVisitCampaign(formData, isUrgent, user?.id || "partner_test_001");
    },
    useConfirmModal: true,
  });

  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      <div className={layoutStyles.main_content}>
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />
        <VisitCampaignForm
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
