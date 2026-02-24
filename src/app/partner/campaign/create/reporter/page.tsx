/* ========================================
📰 캠페인 등록 페이지 (기자단)
======================================== */

/**
 * 캠페인 등록 페이지 (기자단)
 *
 * 목적: 파트너가 기자단 캠페인을 등록할 수 있는 페이지
 *
 * 사용 페이지:
 * - /partner/campaign/create/reporter
 */

"use client";

import { useCampaignCreate } from "@/hooks/useCampaignCreate";
import { registerReporterCampaign } from "@/utils/partner/campaignRegistration/reporterRegistration";
import ReporterCampaignForm from "@/components/partner/campaign_create_form/ReporterCampaignForm";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

export default function ReporterCampaignCreatePage() {
  const { user, isSubmitting, isUrgent, setIsUrgent, handleSubmit, renderModals } = useCampaignCreate({
    onRegister: async (formData, isUrgent) => {
      return await registerReporterCampaign(formData, isUrgent, user?.id || "partner_test_001");
    },
    useConfirmModal: true,
  });

  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      <div className={layoutStyles.main_content}>
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />
        <ReporterCampaignForm
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
