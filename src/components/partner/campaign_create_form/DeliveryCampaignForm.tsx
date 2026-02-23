/* ========================================
   📦 배송형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 배송형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 배송형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 * 주요 기능:
 * - 배송형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 배송형 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 */

"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CampaignFormData,
  CampaignCreateFormBaseProps,
} from "@/types/domain/user";
// 분리된 CSS 모듈들 import
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import buttonStyles from "@/styles/partner/campaign_create/campaign_guide/submit_buttons.module.css";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";

// 공통 컴포넌트들 import
import { CampaignTypeSelector } from "./common/selectors/CampaignTypeSelector";
import { CustomDropdown } from "./common/selectors/CustomDropdown";
import { platforms, categories } from "./common/constants/constants";
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

// 커스텀 훅 import
import { useCampaignForm } from "@/hooks/partner/campaign_create_form/useCampaignForm";
import { useCampaignFormValidation } from "@/hooks/partner/campaign_create_form/useCampaignFormValidation";
import { useCampaignFormStorage } from "@/hooks/partner/campaign_create_form/useCampaignFormStorage";

interface DeliveryCampaignFormProps extends Omit<
  CampaignCreateFormBaseProps,
  "campaignType"
> {
  /** 캠페인 수정 시 초기 데이터 (선택사항) */
  initialData?: CampaignFormData | null;
  /** 폼 동작 모드: 생성/수정 */
  mode?: "create" | "edit";
  /** 캠페인 오픈 여부 (수정 모드에서만 사용) */
  isOpen?: boolean;
  /** 불러온 데이터의 긴급 상태를 부모 컴포넌트로 전달하는 콜백 */
  onUrgentLoad?: (isUrgent: boolean) => void;
  /** 페이지의 긴급 상태 (PageHeader에서 변경된 값) */
  isUrgent?: boolean;
}

export default function DeliveryCampaignForm({
  onSubmit,
  isSubmitting,
  initialData,
  mode = "create",
  isOpen = false,
  onUrgentLoad,
  isUrgent = false,
}: DeliveryCampaignFormProps) {
  const router = useRouter();

  // 공통 폼 상태 관리 훅
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
    campaignType: "배송형",
    initialData,
    mode,
    isOpen,
    onUrgentLoad,
  });

  // 유효성 검증 훅
  const { isFormValid } = useCampaignFormValidation({
    campaignType: "배송형",
    formData,
    thumbnailImage,
    thumbnailPreview,
    detailImages,
    detailPreviews,
    checkboxStates,
    isEditMode,
  });

  // localStorage 관리 훅
  const { handleChargeClick, handleSaveConfirm, handleLoadConfirm } =
    useCampaignFormStorage({
      campaignType: "배송형",
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
    });

  /**
   * 페이지의 isUrgent 상태가 변경될 때 formData 동기화
   */
  useEffect(() => {
    if (formData.isUrgent !== isUrgent) {
      updateFormData("isUrgent", isUrgent);
    }
  }, [isUrgent]);

  /**
   * 캠페인 유형 변경 시 페이지 이동
   */
  const handleCampaignTypeChange = (type: string) => {
    if (type === "배송형") return;

    const typeRoutes: Record<string, string> = {
      방문형: "/partner/campaign/create/visit",
      구매평: "/partner/campaign/create/review",
      기자단: "/partner/campaign/create/reporter",
      미션형: "/partner/campaign/create/mission",
    };

    router.push(typeRoutes[type]);
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 업로드된 이미지 파일을 폼 데이터에 추가
    const formDataWithImages = {
      ...formData,
      thumbnailImage: thumbnailImage || undefined,
      thumbnailImageUrl: thumbnailPreview || undefined,
      detailImages: detailImages,
      detailImagePreviews: detailPreviews,
    };

    onSubmit(formDataWithImages);
  };

  return (
    <>
      {/* 이미지 업로드 오류 모달 */}
      <BaseModal
        is_open={imageErrorModal.is_open}
        on_close={() => setImageErrorModal({ is_open: false, message: "" })}
        message={imageErrorModal.message}
        buttons={["확인"]}
      />

      {/* 임시 저장 확인 모달 */}
      <BaseModal
        is_open={saveConfirmModal.is_open}
        on_close={() => setSaveConfirmModal({ is_open: false })}
        message="임시 저장하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleSaveConfirm}
      />

      {/* 불러오기 확인 모달 */}
      <BaseModal
        is_open={loadConfirmModal.is_open}
        on_close={() => setLoadConfirmModal({ is_open: false })}
        message="마지막에 저장된 내용을 불러오시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleLoadConfirm}
      />

      {/* 토스트 메시지 */}
      <Toast
        message={toast.message}
        isOpen={toast.is_open}
        onClose={() => setToast({ is_open: false, message: "" })}
      />

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButtons
        onSave={() => setSaveConfirmModal({ is_open: true })}
        onLoad={() => setLoadConfirmModal({ is_open: true })}
        isSaveDisabled={isSubmitting}
        isLoadDisabled={isLoadDisabled}
      />

      <form onSubmit={handleSubmit} className={infoStyles.campaign_form}>
        {/* 캠페인 정보 섹션 */}
        <section className={styles.section}>
          <h2 className={styles.section_title}>캠페인 정보</h2>

          {/* 캠페인 유형 선택 */}
          <CampaignTypeSelector
            currentType="배송형"
            onTypeChange={handleCampaignTypeChange}
            disabled={isEditMode}
          />

          {/* 플랫폼 선택 */}
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

          {/* 썸네일 및 상세 이미지 업로드 */}
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
              placeholder="브랜드, 제공하는 서비스/제품 등"
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
              options={categories}
              onChange={(value) => updateFormData("category", value)}
              disabled={isEditMode && !isEditableField("category")}
              placeholder="카테고리 선택"
            />
          </article>

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

          {/* 홍보 링크 */}
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
                  onChange={(e) =>
                    updateFormData("recruitmentCount", e.target.value)
                  }
                  placeholder="0"
                  min="0"
                  readOnly={isEditMode && !isEditableField("recruitmentCount")}
                />
                <span className={infoStyles.count_unit}>명</span>
              </div>
            </div>
          </article>

          {/* 포인트 관리 섹션 */}
          <PointsManagementSection
            currentPoints={formData.currentPoints}
            additionalPoints={formData.additionalPoints}
            deductedPoints={deductedPoints}
            onAdditionalPointsChange={(value) =>
              updateFormData("additionalPoints", value)
            }
            onChargeClick={handleChargeClick}
            isEditMode={isEditMode}
            isEditable={isEditableField("additionalPoints")}
            showInsufficientPointsWarning={showInsufficientPointsWarning}
          />

          {/* 모집 관련 필드 */}
          <RecruitmentFieldsSection
            recruitmentCount={String(formData.recruitmentCount || "")}
            recruitmentPeriod={formData.recruitmentPeriod}
            announcementDate={formData.announcementDate}
            registrationPeriod={formData.registrationPeriod}
            onRecruitmentCountChange={(value) =>
              updateFormData("recruitmentCount", value)
            }
            onRecruitmentPeriodChange={(value) =>
              updateFormData("recruitmentPeriod", value)
            }
            onAnnouncementDateChange={(value) =>
              updateFormData("announcementDate", value)
            }
            onRegistrationPeriodChange={(value) =>
              updateFormData("registrationPeriod", value)
            }
            isEditMode={isEditMode}
            isEditableField={isEditableField}
            showRecruitmentCount={false}
          />
        </section>

        {/* 캠페인 안내 섹션 */}
        <section className={styles.section}>
          <h2 className={styles.section_title}>캠페인 안내</h2>

          {/* 키워드 */}
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

          {/* 기본 미션 설정 */}
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
              onFieldClear={(field) =>
                updateFormData(field as keyof CampaignFormData, "")
              }
              onAttachmentChange={(field, value) =>
                updateFormData(field, value)
              }
              isEditMode={isEditMode}
              isEditableField={isEditableField}
              isOpen={isOpen}
            />
          </article>

          {/* 참여/제출 옵션 */}
          <ParticipationOptionsSection
            adultOnly={formData.adultOnly}
            allowReParticipation={formData.allowReParticipation}
            allowLateSubmission={formData.allowLateSubmission}
            onAdultOnlyChange={(value) => updateFormData("adultOnly", value)}
            onAllowReParticipationChange={(value) =>
              updateFormData("allowReParticipation", value)
            }
            onAllowLateSubmissionChange={(value) =>
              updateFormData("allowLateSubmission", value)
            }
            isEditMode={isEditMode}
            isEditableField={isEditableField}
          />

          {/* 안내 사항 */}
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

          {/* 유의 사항 */}
          <NoticeSection />

          {/* 문의 담당자 휴대폰 번호 */}
          <ContactPhoneField
            value={formData.contactPhone || ""}
            onChange={(value) => updateFormData("contactPhone", value)}
            isEditMode={isEditMode}
            isEditable={isEditableField("contactPhone")}
          />
        </section>

        {/* 공정위 문구 동의 */}
        <FairTradeAgreement
          agreed={formData.fairTradeAgreement || false}
          onChange={(agreed) => updateFormData("fairTradeAgreement", agreed)}
          isEditMode={isEditMode}
          isOpen={isOpen}
        />

        {/* 등록하기 버튼 */}
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
