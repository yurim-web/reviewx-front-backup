/* ========================================
   📍 방문형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 방문형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 방문형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 */

"use client";

import { useMemo } from "react";
import { CampaignFormData, CampaignCreateFormBaseProps } from "@/types/domain/user";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import { CustomDropdown } from "./common/selectors/CustomDropdown";
import { platforms, regions, sub_regions } from "./common/constants/campaignFormConstants";
import { getRegionKey } from "./common/utils/formUtils";
import CampaignFormBase from "./CampaignFormBase";

interface VisitCampaignFormProps extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  initialData?: CampaignFormData | null;
  mode?: "create" | "edit";
  isOpen?: boolean;
  onUrgentLoad?: (isUrgent: boolean) => void;
  isUrgent?: boolean;
}

export default function VisitCampaignForm(props: VisitCampaignFormProps) {
  return (
    <CampaignFormBase
      {...props}
      campaignType="방문형"
      titlePlaceholder="지역, 브랜드, 제공하는 서비스/제품 등"
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
      renderAfterCategory={(ctx) => <VisitRegionSelector ctx={ctx} />}
      renderAfterProvidedItems={({ formData, updateFormData, isEditMode, isEditableField }) => (
        <>
          {/* 방문 주소 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              방문 주소<span className={infoStyles.required}>*</span>
            </label>
            <div className={infoStyles.postal_input_group}>
              <input
                type="text"
                id="visit_zip_code"
                className={`${infoStyles.form_input} ${isEditMode && !isEditableField("visitAddress") ? infoStyles.read_only_input : ""}`}
                value={formData.visitZipCode ?? ""}
                onChange={(e) => updateFormData("visitZipCode", e.target.value)}
                placeholder="우편번호"
                readOnly={isEditMode && !isEditableField("visitAddress")}
              />
              <button
                type="button"
                className={infoStyles.charge_button}
                onClick={() => alert("우편번호 찾기 기능은 구현 예정입니다.")}
                disabled={isEditMode && !isEditableField("visitAddress")}
              >
                우편번호 찾기
              </button>
            </div>
            <input
              type="text"
              id="visit_base_address"
              className={`${infoStyles.form_input} ${infoStyles.visit_address_row} ${isEditMode && !isEditableField("visitAddress") ? infoStyles.read_only_input : ""}`}
              value={formData.visitBaseAddress ?? ""}
              onChange={(e) => updateFormData("visitBaseAddress", e.target.value)}
              placeholder="기본 주소"
              readOnly={isEditMode && !isEditableField("visitAddress")}
            />
            <input
              type="text"
              id="visit_detail_address"
              className={`${infoStyles.form_input} ${infoStyles.visit_address_row} ${isEditMode && !isEditableField("visitAddress") ? infoStyles.read_only_input : ""}`}
              value={formData.visitDetailAddress ?? ""}
              onChange={(e) => updateFormData("visitDetailAddress", e.target.value)}
              placeholder="상세 주소"
              readOnly={isEditMode && !isEditableField("visitAddress")}
            />
          </article>

          {/* 주소 상세 안내 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>주소 상세 안내</label>
            <input
              type="text"
              className={`${infoStyles.form_input} ${isEditMode && !isEditableField("addressDetail") ? infoStyles.read_only_input : ""}`}
              value={formData.addressDetail ?? ""}
              onChange={(e) => updateFormData("addressDetail", e.target.value)}
              placeholder="캠페인 방문 상세 주소 안내"
              readOnly={isEditMode && !isEditableField("addressDetail")}
            />
          </article>

          {/* 방문 링크 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>방문 링크</label>
            <input
              type="url"
              className={`${infoStyles.form_input} ${isEditMode && !isEditableField("visitLink") ? infoStyles.read_only_input : ""}`}
              value={formData.visitLink ?? ""}
              onChange={(e) => updateFormData("visitLink", e.target.value)}
              placeholder="캠페인 방문 링크"
              readOnly={isEditMode && !isEditableField("visitLink")}
            />
          </article>
        </>
      )}
      transformSubmitData={(data) => {
        const base = (data.visitBaseAddress as string)?.trim() || "";
        const detail = (data.visitDetailAddress as string)?.trim() || "";
        return {
          ...data,
          visitAddress: [base, detail].filter(Boolean).join(" ").trim(),
        };
      }}
    />
  );
}

/** 방문형 지역 선택 (시/도 + 시/구/군) */
function VisitRegionSelector({ ctx }: { ctx: import("./CampaignFormBase").CampaignFormContext }) {
  const { formData, updateFormData, isEditMode, isEditableField, infoStyles } = ctx;

  const subRegionPlaceholder = useMemo(() => {
    if (!formData.region) return "시/구/군 선택";
    if (formData.region.endsWith("시")) return "구 선택";
    if (formData.region.endsWith("도")) return "시/군 선택";
    return "시/구/군 선택";
  }, [formData.region]);

  return (
    <article className={infoStyles.form_group}>
      <div className={infoStyles.region_select_group}>
        <div className={infoStyles.region_dropdown_container}>
          <label className={infoStyles.form_label}>
            시/도<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.region || ""}
            options={regions}
            onChange={(value) => {
              updateFormData("region", value);
              updateFormData("subRegion", "");
            }}
            disabled={isEditMode && !isEditableField("region")}
            placeholder="시/도 선택"
          />
        </div>
        <div className={infoStyles.region_dropdown_container}>
          <label className={infoStyles.form_label}>
            시/구/군<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.subRegion || ""}
            options={formData.region ? sub_regions[getRegionKey(formData.region)] || [] : []}
            onChange={(value) => updateFormData("subRegion", value)}
            disabled={!formData.region || (isEditMode && !isEditableField("region"))}
            placeholder={subRegionPlaceholder}
          />
        </div>
      </div>
    </article>
  );
}
