/* ========================================
   📦 배송형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 배송형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 배송형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 */

"use client";

import { CampaignFormData, CampaignCreateFormBaseProps } from "@/types/domain/user";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import { CustomDropdown } from "./common/selectors/CustomDropdown";
import { platforms } from "./common/constants/campaignFormConstants";
import CampaignFormBase from "./CampaignFormBase";

interface DeliveryCampaignFormProps extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  initialData?: CampaignFormData | null;
  mode?: "create" | "edit";
  isOpen?: boolean;
  onUrgentLoad?: (isUrgent: boolean) => void;
  isUrgent?: boolean;
}

export default function DeliveryCampaignForm(props: DeliveryCampaignFormProps) {
  return (
    <CampaignFormBase
      {...props}
      campaignType="배송형"
      renderBeforeImages={({ formData, updateFormData, isEditMode, isEditableField }) => (
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            등록 플랫폼<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.platform || ""}
            options={platforms}
            onChange={(value) => updateFormData("platform", value)}
            disabled={isEditMode && !isEditableField("platform")}
            placeholder="플랫폼 선택"
          />
        </article>
      )}
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
    />
  );
}
