/* ========================================
   캠페인 생성 폼 공통 베이스 컴포넌트
   ======================================== */

/**
 * CampaignFormBase
 *
 * 목적: 5개 캠페인 유형(배송/방문/구매평/미션/기자단)의 공통 폼 구조를 통합
 *
 * 사용처:
 * - DeliveryCampaignForm, VisitCampaignForm, ReviewCampaignForm
 * - MissionCampaignForm, ReporterCampaignForm
 */

"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { CampaignFormData, CampaignCreateFormBaseProps } from "@/types/domain/user";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import buttonStyles from "@/styles/partner/campaign_create/campaign_guide/submit_buttons.module.css";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";

import { CampaignTypeSelector } from "./common/selectors/CampaignTypeSelector";
import { CustomDropdown } from "./common/selectors/CustomDropdown";
import { categories as fallbackCategories } from "./common/constants/campaignFormConstants";
import {
  useCampaignCreatePage,
  CampaignCreatePageData,
} from "@/hooks/partner/campaign_create_form/useCampaignCreatePage";
import NoticeSection from "./common/sections/NoticeSection";
import { ThumbnailAndDetailImages } from "./common/images/ThumbnailAndDetailImages";
import { PointsManagementSection } from "./common/sections/PointsManagementSection";
import { RecruitmentFieldsSection } from "./common/sections/RecruitmentFieldsSection";
import { SimpleGuideSection } from "./common/sections/SimpleGuideSection";
import { ParticipationOptionsSection } from "./common/sections/ParticipationOptionsSection";
import { ContactPhoneField } from "./common/fields/ContactPhoneField";
import { GuidelinesTextarea } from "./common/fields/GuidelinesTextarea";
import { FairTradeAgreement } from "./common/fields/FairTradeAgreement";
import { FloatingActionButtons } from "./common/layout/FloatingActionButtons";
import { formatNumberWithComma } from "./common/utils/formUtils";
import BaseModal from "@/components/common/modal/BaseModal";
import Toast from "@/components/common/toast/Toast";

import { useCampaignForm } from "@/hooks/partner/campaign_create_form/useCampaignForm";
import { useCampaignFormValidation } from "@/hooks/partner/campaign_create_form/useCampaignFormValidation";
import { useCampaignFormStorage } from "@/hooks/partner/campaign_create_form/useCampaignFormStorage";

/** 캠페인 유형 라벨 */
export type CampaignTypeLabel = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

/** 유형 변경 시 라우팅 맵 */
const CAMPAIGN_TYPE_ROUTES: Record<string, string> = {
  배송형: "/partner/campaign/create/delivery",
  방문형: "/partner/campaign/create/visit",
  구매평: "/partner/campaign/create/review",
  기자단: "/partner/campaign/create/reporter",
  미션형: "/partner/campaign/create/mission",
};

/** useCampaignForm 훅에서 반환하는 값들을 외부에 노출하는 컨텍스트 */
export interface CampaignFormContext {
  formData: CampaignFormData;
  updateFormData: (
    field: keyof CampaignFormData,
    value: CampaignFormData[keyof CampaignFormData]
  ) => void;
  isEditMode: boolean;
  isEditableField: (field: string) => boolean;
  handleNumericInputWrapper: (field: string, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNumericChangeWrapper: (field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  infoStyles: Record<string, string>;
  /** API 09 pageData (카테고리/채널/지역/파트너 정보) */
  pageData: CampaignCreatePageData | null;
}

export interface CampaignFormBaseProps extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  campaignType: CampaignTypeLabel;
  initialData?: CampaignFormData | null;
  mode?: "create" | "edit";
  isOpen?: boolean;
  onUrgentLoad?: (isUrgent: boolean) => void;
  isUrgent?: boolean;
  /** 제목 placeholder */
  titlePlaceholder?: string;
  /** "캠페인 정보" 섹션 슬롯: CampaignTypeSelector 뒤, Images 앞 (플랫폼 등) */
  renderBeforeImages?: (ctx: CampaignFormContext) => ReactNode;
  /** "캠페인 정보" 섹션 슬롯: 카테고리 뒤, 브랜드명 앞 (지역 선택 등) */
  renderAfterCategory?: (ctx: CampaignFormContext) => ReactNode;
  /** "캠페인 정보" 섹션 슬롯: 제공 내역 뒤, 모집 인원 앞 (링크/주소 등) */
  renderAfterProvidedItems?: (ctx: CampaignFormContext) => ReactNode;
  /** "캠페인 정보" 섹션 슬롯: 모집 인원 뒤, 포인트 관리 앞 (구매 지급 포인트 등) */
  renderAfterRecruitmentCount?: (ctx: CampaignFormContext) => ReactNode;
  /** "캠페인 정보" 섹션 슬롯: RecruitmentFields 뒤 (구매기간/등록기간 등) */
  renderAfterRecruitmentFields?: (ctx: CampaignFormContext) => ReactNode;
  /** 추가 모달 (미션형 contentSubmitModal 등) */
  renderExtraModals?: () => ReactNode;
  /** ParticipationOptionsSection 추가 옵션 (미션형 콘텐츠 제출 방식 등) */
  participationAdditionalOptions?: Array<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    field: string;
  }>;
  /** RecruitmentFieldsSection showRecruitmentCount (기본 false) */
  showRecruitmentCount?: boolean;
  /** RecruitmentFieldsSection showRegistrationPeriod (기본 true) */
  showRegistrationPeriod?: boolean;
  /** 제출 전 검증 (false 반환 시 제출 중단) */
  onBeforeSubmit?: (formData: CampaignFormData) => boolean;
  /** 제출 데이터 변환 (방문형 주소 결합 등) */
  transformSubmitData?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export default function CampaignFormBase({
  campaignType,
  onSubmit,
  isSubmitting,
  initialData,
  mode = "create",
  isOpen = false,
  onUrgentLoad,
  isUrgent = false,
  titlePlaceholder = "브랜드, 제공하는 서비스/제품 등",
  renderBeforeImages,
  renderAfterCategory,
  renderAfterProvidedItems,
  renderAfterRecruitmentCount,
  renderAfterRecruitmentFields,
  renderExtraModals,
  participationAdditionalOptions,
  showRecruitmentCount = false,
  showRegistrationPeriod,
  onBeforeSubmit,
  transformSubmitData,
}: CampaignFormBaseProps) {
  const router = useRouter();

  const {
    formData,
    setFormData,
    thumbnailImage,
    thumbnailPreview,
    detailImages,
    detailPreviews,
    checkboxStates,
    imageErrorModal,
    saveConfirmModal,
    loadConfirmModal,
    toast,
    isLoadDisabled,
    deductedPoints,
    showInsufficientPointsWarning,
    isEditMode,
    setImageErrorModal,
    setSaveConfirmModal,
    setLoadConfirmModal,
    setToast,
    setIsLoadDisabled,
    setThumbnailPreview,
    setDetailPreviews,
    updateFormData,
    updateCheckboxState,
    handleNumericInputWrapper,
    handleNumericChangeWrapper,
    handleThumbnailSelect,
    handleThumbnailRemove,
    handleDetailImagesSelect,
    handleDetailImageRemove,
    isEditableField,
  } = useCampaignForm({
    campaignType,
    initialData,
    mode,
    isOpen,
    onUrgentLoad,
  });

  const { isFormValid } = useCampaignFormValidation({
    campaignType,
    formData,
    thumbnailImage,
    thumbnailPreview,
    detailImages,
    detailPreviews,
    checkboxStates,
    isEditMode,
  });

  const { pageData, isLoading: isPageLoading } = useCampaignCreatePage();

  // API 09 파트너 정보로 보유 포인트·브랜드명 초기화 (항상 API 값 우선)
  useEffect(() => {
    if (!pageData || isEditMode || initialData) return;
    if (pageData.partner.currentPoint != null) {
      updateFormData("currentPoints", String(pageData.partner.currentPoint));
    }
    if (pageData.partner.businessName && !formData.brandName) {
      updateFormData("brandName", pageData.partner.businessName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData]);

  const { handleChargeClick, handleSaveConfirm, handleLoadConfirm } = useCampaignFormStorage({
    campaignType,
    formData,
    setFormData,
    initialData,
    isEditMode,
    setLoadConfirmModal,
    setToast,
    onUrgentLoad,
    setIsLoadDisabled,
    isSubmitting,
    thumbnailPreview,
    detailPreviews,
    setThumbnailPreview,
    setDetailPreviews,
    checkboxStates,
    updateCheckboxState,
    pageData,
  });

  useEffect(() => {
    if (formData.isUrgent !== isUrgent) {
      updateFormData("isUrgent", isUrgent);
    }
  }, [isUrgent, formData.isUrgent, updateFormData]);

  // API 09 로딩 중 Loading 컴포넌트 표시
  if (isPageLoading) return <Loading />;

  const handleCampaignTypeChange = (type: string) => {
    if (type === campaignType) return;
    router.push(CAMPAIGN_TYPE_ROUTES[type]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onBeforeSubmit && !onBeforeSubmit(formData)) return;

    let formDataWithImages: Record<string, unknown> = {
      ...formData,
      thumbnailImage: thumbnailImage || undefined,
      thumbnailImageUrl: thumbnailPreview || undefined,
      detailImages,
      detailImagePreviews: detailPreviews,
      // API 09 ID 매핑 (API 10 등록 시 사용)
      _categoryId: pageData?.categoryNameToId[formData.category] ?? 0,
      _channelId: formData.platform
        ? (pageData?.channelNameToId[formData.platform] ?? undefined)
        : undefined,
      _regionId: formData.subRegion
        ? (pageData?.regionNameToId[`${formData.region}_${formData.subRegion}`] ??
          pageData?.regionNameToId[formData.subRegion] ??
          undefined)
        : undefined,
    };

    if (transformSubmitData) {
      formDataWithImages = transformSubmitData(formDataWithImages);
    }

    onSubmit(formDataWithImages as unknown as CampaignFormData);
  };

  // 슬롯 렌더 프롭에 전달할 컨텍스트
  const ctx: CampaignFormContext = {
    formData,
    updateFormData,
    isEditMode,
    isEditableField,
    handleNumericInputWrapper,
    handleNumericChangeWrapper,
    isOpen,
    infoStyles,
    pageData,
  };

  return (
    <>
      {/* 공통 모달 */}
      <BaseModal
        is_open={imageErrorModal.is_open}
        on_close={() => setImageErrorModal({ is_open: false, message: "" })}
        message={imageErrorModal.message}
        buttons={["확인"]}
      />
      {renderExtraModals?.()}
      <BaseModal
        is_open={saveConfirmModal.is_open}
        on_close={() => setSaveConfirmModal({ is_open: false })}
        message="임시 저장하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleSaveConfirm}
      />
      <BaseModal
        is_open={loadConfirmModal.is_open}
        on_close={() => setLoadConfirmModal({ is_open: false })}
        message="마지막에 저장된 내용을 불러오시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleLoadConfirm}
      />
      <Toast
        message={toast.message}
        isOpen={toast.is_open}
        onClose={() => setToast({ is_open: false, message: "" })}
      />
      <FloatingActionButtons
        onSave={() => setSaveConfirmModal({ is_open: true })}
        onLoad={() => setLoadConfirmModal({ is_open: true })}
        isSaveDisabled={isSubmitting}
        isLoadDisabled={isLoadDisabled}
      />

      <form onSubmit={handleSubmit} className={infoStyles.campaign_form}>
        {/* ========== 캠페인 정보 섹션 ========== */}
        <section className={styles.section}>
          <h2 className={styles.section_title}>캠페인 정보</h2>

          <CampaignTypeSelector
            currentType={campaignType}
            onTypeChange={handleCampaignTypeChange}
            disabled={isEditMode}
          />

          {/* 슬롯: 플랫폼 드롭다운 (배송/방문/기자단) */}
          {renderBeforeImages?.(ctx)}

          <ThumbnailAndDetailImages
            thumbnailImage={thumbnailImage}
            thumbnailPreview={thumbnailPreview}
            detailImages={detailImages}
            detailPreviews={detailPreviews}
            onThumbnailSelect={handleThumbnailSelect}
            onThumbnailRemove={handleThumbnailRemove}
            onDetailImagesSelect={handleDetailImagesSelect}
            onDetailImageRemove={handleDetailImageRemove}
            isEditMode={isEditMode}
            isEditable={isEditableField("images")}
          />

          {/* 캠페인 제목 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              캠페인 제목<span className={infoStyles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${infoStyles.form_input} ${isEditMode && !isEditableField("title") ? infoStyles.read_only_input : ""}`}
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              placeholder={titlePlaceholder}
              readOnly={isEditMode && !isEditableField("title")}
            />
          </article>

          {/* 카테고리 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              카테고리<span className={infoStyles.required}>*</span>
            </label>
            <CustomDropdown
              value={formData.category}
              options={pageData?.categoryOptions ?? fallbackCategories}
              onChange={(value) => updateFormData("category", value)}
              disabled={isEditMode && !isEditableField("category")}
              placeholder="카테고리 선택"
            />
          </article>

          {/* 슬롯: 지역 선택 (방문형) */}
          {renderAfterCategory?.(ctx)}

          {/* 브랜드명 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              브랜드명<span className={infoStyles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${infoStyles.form_input} ${infoStyles.read_only_input}`}
              value={formData.brandName}
              readOnly
              placeholder="{상호명}"
            />
          </article>

          {/* 제공 내역 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              제공 내역<span className={infoStyles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${infoStyles.form_input} ${isEditMode && !isEditableField("providedItems") ? infoStyles.read_only_input : ""}`}
              value={formData.providedItems}
              onChange={(e) => updateFormData("providedItems", e.target.value)}
              placeholder="제공하는 서비스/제품/포인트 등 한줄 설명"
              readOnly={isEditMode && !isEditableField("providedItems")}
            />
          </article>

          {/* 슬롯: 링크/주소 필드 (유형별) */}
          {renderAfterProvidedItems?.(ctx)}

          {/* 모집 인원 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              모집 인원<span className={infoStyles.required}>*</span>
            </label>
            <div className={infoStyles.count_input_group}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="number"
                  className={`${infoStyles.form_input} ${isEditMode && !isEditableField("recruitmentCount") ? infoStyles.read_only_input : ""}`}
                  value={formData.recruitmentCount}
                  onChange={(e) => updateFormData("recruitmentCount", e.target.value)}
                  placeholder="0"
                  min="0"
                  readOnly={isEditMode && !isEditableField("recruitmentCount")}
                />
                <span className={infoStyles.count_unit}>명</span>
              </div>
            </div>
          </article>

          {/* 슬롯: 구매 지급 포인트 (구매평) */}
          {renderAfterRecruitmentCount?.(ctx)}

          <PointsManagementSection
            currentPoints={formData.currentPoints}
            additionalPoints={formData.additionalPoints}
            deductedPoints={deductedPoints}
            onAdditionalPointsChange={(value) => updateFormData("additionalPoints", value)}
            onChargeClick={handleChargeClick}
            isEditMode={isEditMode}
            isEditable={isEditableField("additionalPoints")}
            showInsufficientPointsWarning={showInsufficientPointsWarning}
          />

          <RecruitmentFieldsSection
            recruitmentCount={String(formData.recruitmentCount || "")}
            recruitmentPeriod={formData.recruitmentPeriod}
            announcementDate={formData.announcementDate}
            registrationPeriod={formData.registrationPeriod}
            onRecruitmentCountChange={(value) => updateFormData("recruitmentCount", value)}
            onRecruitmentPeriodChange={(value) => updateFormData("recruitmentPeriod", value)}
            onAnnouncementDateChange={(value) => updateFormData("announcementDate", value)}
            onRegistrationPeriodChange={(value) => updateFormData("registrationPeriod", value)}
            isEditMode={isEditMode}
            isEditableField={isEditableField}
            showRecruitmentCount={showRecruitmentCount}
            {...(showRegistrationPeriod !== undefined && { showRegistrationPeriod })}
          />

          {/* 슬롯: 구매기간/등록기간 (구매평) */}
          {renderAfterRecruitmentFields?.(ctx)}
        </section>

        {/* ========== 캠페인 안내 섹션 ========== */}
        <section className={styles.section}>
          <h2 className={styles.section_title}>캠페인 안내</h2>

          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              키워드/태그<span className={infoStyles.required}>*</span>
            </label>
            <input
              type="text"
              className={`${infoStyles.form_input} ${isEditMode && !isEditableField("keywords") ? infoStyles.read_only_input : ""}`}
              value={formData.keywords}
              onChange={(e) => updateFormData("keywords", e.target.value)}
              placeholder="본문 내 첨부 키워드/해시태그/계정 태그 등"
              readOnly={isEditMode && !isEditableField("keywords")}
            />
          </article>

          <article
            className={`${infoStyles.form_group} ${isEditMode && isOpen ? infoStyles.form_group_locked : ""}`}
          >
            <label className={infoStyles.form_label}>기본 미션 설정</label>
            <SimpleGuideSection
              checkboxStates={checkboxStates}
              formData={{
                minTextLength: String(formData.minTextLength || ""),
                minImageCount: String(formData.minImageCount || ""),
                videoCount: String(formData.videoCount || ""),
                videoDuration: String(formData.videoDuration || ""),
                requireLinkAttachment: formData.requireLinkAttachment,
                requireKeywordAttachment: formData.requireKeywordAttachment,
              }}
              onCheckboxChange={(field, checked) => {
                updateCheckboxState(field, checked);
                if (!checked) {
                  if (field === "minTextLength") {
                    updateFormData("minTextLength", "");
                  } else if (field === "minImageCount") {
                    updateFormData("minImageCount", "");
                  } else if (field === "videoCount") {
                    updateFormData("videoCount", "");
                    updateFormData("videoDuration", "");
                  }
                }
              }}
              onNumericChange={handleNumericChangeWrapper}
              onNumericKeyDown={handleNumericInputWrapper}
              formatNumberWithComma={formatNumberWithComma}
              onFieldClear={(field) => updateFormData(field as keyof CampaignFormData, "")}
              onAttachmentChange={(field, value) => updateFormData(field, value)}
              isEditMode={isEditMode}
              isEditableField={isEditableField}
              isOpen={isOpen}
            />
          </article>

          <ParticipationOptionsSection
            adultOnly={formData.adultOnly}
            allowReParticipation={formData.allowReParticipation}
            allowLateSubmission={formData.allowLateSubmission}
            onAdultOnlyChange={(value) => updateFormData("adultOnly", value)}
            onAllowReParticipationChange={(value) => updateFormData("allowReParticipation", value)}
            onAllowLateSubmissionChange={(value) => updateFormData("allowLateSubmission", value)}
            isEditMode={isEditMode}
            isEditableField={isEditableField}
            additionalOptions={participationAdditionalOptions?.map((opt) => ({
              ...opt,
              checked: Boolean(formData[opt.field as keyof CampaignFormData]),
              onChange: (value: boolean) =>
                updateFormData(opt.field as keyof CampaignFormData, value),
            }))}
          />

          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              안내 사항<span className={infoStyles.required}>*</span>
            </label>
            <GuidelinesTextarea
              value={formData.guidelines}
              onChange={(e) => updateFormData("guidelines", e.target.value)}
              placeholder="캠페인 전체 안내 사항, 미션, 기타 참고 사항 등"
              readOnly={isEditMode && !isEditableField("guidelines")}
            />
          </article>

          <NoticeSection />

          <ContactPhoneField
            value={formData.contactPhone || ""}
            onChange={(value) => updateFormData("contactPhone", value)}
            isEditMode={isEditMode}
            isEditable={isEditableField("contactPhone")}
          />
        </section>

        <FairTradeAgreement
          agreed={formData.fairTradeAgreement || false}
          onChange={(agreed) => updateFormData("fairTradeAgreement", agreed)}
          isEditMode={isEditMode}
          isOpen={isOpen}
        />

        <div className={buttonStyles.submit_button_container}>
          <button
            type="submit"
            className={buttonStyles.submit_button}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting
              ? isEditMode
                ? "저장 중..."
                : "등록 중..."
              : isEditMode
                ? "저장"
                : "등록"}
          </button>
        </div>
      </form>
    </>
  );
}
