/* ========================================
   🛒 구매평 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 구매평 캠페인 생성 폼 컴포넌트
 *
 * 목적: 구매평 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 */

"use client";

import { CampaignFormData, CampaignCreateFormBaseProps } from "@/types/domain/user";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import { DateRangeField } from "./common/fields/DateRangeField";
import { formatNumberWithComma } from "./common/utils/formUtils";
import CampaignFormBase from "./CampaignFormBase";

interface ReviewCampaignFormProps extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  initialData?: CampaignFormData | null;
  mode?: "create" | "edit";
  isOpen?: boolean;
  onUrgentLoad?: (isUrgent: boolean) => void;
  isUrgent?: boolean;
}

export default function ReviewCampaignForm(props: ReviewCampaignFormProps) {
  return (
    <CampaignFormBase
      {...props}
      campaignType="구매평"
      titlePlaceholder="구매 플랫폼, 브랜드, 제공하는 서비스/제품 등"
      showRegistrationPeriod={false}
      renderAfterProvidedItems={({ formData, updateFormData, isEditMode, isEditableField }) => (
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            구매 링크<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="url"
            className={`${infoStyles.form_input} ${isEditMode && !isEditableField("promotionLink") ? infoStyles.read_only_input : ""}`}
            value={formData.promotionLink}
            onChange={(e) => updateFormData("promotionLink", e.target.value)}
            placeholder="제품 구매 링크"
            readOnly={isEditMode && !isEditableField("promotionLink")}
          />
        </article>
      )}
      renderAfterRecruitmentCount={({
        formData,
        isEditMode,
        isEditableField,
        handleNumericInputWrapper,
        handleNumericChangeWrapper,
      }) => (
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            구매 지급 포인트<span className={infoStyles.required}>*</span>
          </label>
          <div className={infoStyles.points_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                className={`${infoStyles.form_input} ${isEditMode && !isEditableField("purchasePoints") ? infoStyles.read_only_input : ""}`}
                value={formatNumberWithComma(formData.purchasePoints)}
                onChange={(e) => handleNumericChangeWrapper("purchasePoints", e)}
                onKeyDown={(e) => handleNumericInputWrapper("purchasePoints", e)}
                placeholder="배송비 포함 구매 금액에 대한 지급 포인트"
                readOnly={isEditMode && !isEditableField("purchasePoints")}
              />
              <span className={infoStyles.points_unit}>P</span>
            </div>
          </div>
        </article>
      )}
      renderAfterRecruitmentFields={({ formData, updateFormData, isEditMode, isEditableField }) => (
        <>
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              구매 기간<span className={infoStyles.required}>*</span>
            </label>
            <DateRangeField
              value={formData.purchasePeriod || ""}
              onChange={(value) => updateFormData("purchasePeriod", value)}
              placeholder="구매기간을 선택해주세요."
              isEditMode={isEditMode}
              isEditable={isEditableField("purchasePeriod")}
            />
          </article>
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              등록 기간<span className={infoStyles.required}>*</span>
            </label>
            <DateRangeField
              value={formData.registrationPeriod}
              onChange={(value) => updateFormData("registrationPeriod", value)}
              placeholder=""
              isEditMode={isEditMode}
              isEditable={isEditableField("registrationPeriod")}
            />
          </article>
        </>
      )}
    />
  );
}
