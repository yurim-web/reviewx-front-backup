/* ========================================
   🎯 미션형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 미션형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 미션형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 */

"use client";

import { useState } from "react";
import { CampaignFormData, CampaignCreateFormBaseProps } from "@/types/domain/user";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import BaseModal from "@/components/common/modal/BaseModal";
import CampaignFormBase from "./CampaignFormBase";

interface MissionCampaignFormProps extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  initialData?: CampaignFormData | null;
  mode?: "create" | "edit";
  isOpen?: boolean;
  onUrgentLoad?: (isUrgent: boolean) => void;
  isUrgent?: boolean;
}

export default function MissionCampaignForm(props: MissionCampaignFormProps) {
  const [contentSubmitModal, setContentSubmitModal] = useState({ is_open: false });

  return (
    <CampaignFormBase
      {...props}
      campaignType="미션형"
      renderExtraModals={() => (
        <BaseModal
          is_open={contentSubmitModal.is_open}
          on_close={() => setContentSubmitModal({ is_open: false })}
          message="콘텐츠 제출 방식을 선택해 주세요.<br>링크 제출 또는 이미지 제출 중 하나 이상을 선택해 주세요."
          buttons={["확인"]}
        />
      )}
      onBeforeSubmit={(formData) => {
        if (!formData.requireContentLink && !formData.requireContentImage) {
          setContentSubmitModal({ is_open: true });
          return false;
        }
        return true;
      }}
      renderAfterProvidedItems={({ formData, updateFormData, isEditMode, isEditableField }) => (
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>홍보 링크</label>
          <input
            type="url"
            className={`${infoStyles.form_input} ${isEditMode && !isEditableField("promotionLink") ? infoStyles.read_only_input : ""}`}
            value={formData.promotionLink}
            onChange={(e) => updateFormData("promotionLink", e.target.value)}
            placeholder="캠페인 홍보 링크"
            readOnly={isEditMode && !isEditableField("promotionLink")}
          />
        </article>
      )}
      participationAdditionalOptions={[
        {
          id: "requireContentLink",
          label: "콘텐츠 링크 제출",
          checked: false,
          onChange: () => {},
          field: "requireContentLink",
        },
        {
          id: "requireContentImage",
          label: "콘텐츠 이미지 제출",
          checked: false,
          onChange: () => {},
          field: "requireContentImage",
        },
      ]}
    />
  );
}
