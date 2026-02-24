/* ========================================
🎴 Basic 카드 렌더러
======================================== */

/**
 * Basic 카드 렌더러
 *
 * 목적: review, mission 캠페인에서 사용하는 Basic 카드 렌더링 로직
 *
 * 사용 페이지:
 * - /partner/campaign_application/review/[id]
 * - /partner/campaign_application/mission/[id]
 */

import React from "react";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";
import { type BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import BasicCard from "@/components/partner/campaign_application/card_type/basic/BasicCard";
import BasicSelectedCard from "@/components/partner/campaign_application/card_type/basic/BasicSelectedCard";

/**
 * Basic 카드 렌더링 함수 (review, mission 공용)
 */
export function renderBasicCard(
  handleSelectApplicant: (applicant: AllApplicant) => void,
  handleCancelApplicant: (applicant: AllApplicant) => void
) {
  // eslint-disable-next-line react/display-name
  return (applicant: AllApplicant, isSelected: boolean = false): React.ReactNode => {
    const basicApplicant = applicant as BasicApplicant;

    if (isSelected) {
      return (
        <BasicSelectedCard
          applicant={basicApplicant}
          onCancel={handleCancelApplicant}
        />
      );
    }

    return (
      <BasicCard
        applicant={basicApplicant}
        onSelect={handleSelectApplicant}
      />
    );
  };
}
