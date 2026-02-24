/* ========================================
📦 캠페인 등록 페이지 (배송형)
======================================== */

/**
 * 캠페인 등록 페이지 (배송형)
 *
 * 목적: 파트너가 배송형 캠페인을 등록할 수 있는 페이지
 *
 * 사용 페이지:
 * - /partner/campaign/create/delivery
 */

"use client";

import { useEffect } from "react";
import { useCampaignCreate } from "@/hooks/useCampaignCreate";
import { registerDeliveryCampaign } from "@/utils/partner/campaignRegistration/deliveryRegistration";
import DeliveryCampaignForm from "@/components/partner/campaign_create_form/DeliveryCampaignForm";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import layoutStyles from "@/styles/partner/partner_layout.module.css";

export default function DeliveryCampaignCreatePage() {
  const { user, isSubmitting, isUrgent, setIsUrgent, handleSubmit, renderModals } = useCampaignCreate({
    onRegister: async (formData, isUrgent) => {
      return await registerDeliveryCampaign(formData, isUrgent, user?.id || "partner_test_001");
    },
    useConfirmModal: false, // delivery는 폼에서 확인 모달 처리
  });

  // 모바일 여부 감지 및 헤더 숨기기 처리
  useEffect(() => {
    const header = document.querySelector("header");
    const applyMobileHeader = () => {
      if (header) {
        header.style.display = window.innerWidth <= 768 ? "none" : "block";
      }
    };
    applyMobileHeader();
    window.addEventListener("resize", applyMobileHeader);
    return () => {
      window.removeEventListener("resize", applyMobileHeader);
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  return (
    <div className={layoutStyles.container}>
      <PartnerSubHeader />
      <div className={layoutStyles.main_content}>
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />
        <DeliveryCampaignForm
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
