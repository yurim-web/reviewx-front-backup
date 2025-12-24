/* ========================================
   🎯 미션형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 미션형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 미션형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 * 주요 기능:
 * - 미션형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 미션형 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CampaignFormData,
  CampaignCreateFormBaseProps,
} from "@/types/user/user";
// 분리된 CSS 모듈들 import
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import guideStyles from "@/styles/partner/campaign_create/campaign_guide.module.css";
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
import { FairTradeAgreement } from "./common/fields/FairTradeAgreement";
import { FloatingActionButtons } from "./common/layout/FloatingActionButtons";
import {
  formatNumberWithComma,
  handleNumericInput,
  handleNumericChange,
  validateImageFile,
  validateImagesForUpload,
  getDefaultCampaignDates,
} from "./common/utils/formUtils";
import BaseModal from "@/components/common/modal/BaseModal";
import Toast from "@/components/common/toast/Toast";

interface MissionCampaignFormProps
  extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  /** 캠페인 수정 시 초기 데이터 (선택사항) */
  initialData?: CampaignFormData | null;
  /** 폼 동작 모드: 생성/수정 */
  mode?: "create" | "edit";
}

export default function MissionCampaignForm({
  onSubmit,
  isSubmitting,
  initialData,
  mode = "create",
}: MissionCampaignFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  // 수정 모드에서 편집 가능 필드 정의 (이미지, 제공 내역, 홍보 링크, 추가 지급 포인트, 참여/제출 옵션)
  const isEditableField = (field: string): boolean => {
    const editable = new Set([
      "images",
      "providedItems",
      "promotionLink",
      "additionalPoints",
      // 참여/제출 옵션 필드들
      "adultOnly",
      "allowReParticipation",
      "allowLateSubmission",
      "requireContentLink",
      "requireContentImage",
    ]);
    return editable.has(field);
  };

  // 이미지 업로드 관련 state (썸네일/상세 이미지 분리)
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  // 체크박스 상태 관리
  const [checkboxStates, setCheckboxStates] = useState({
    minTextLength: false,
    minImageCount: false,
    videoCount: false,
  });

  // 이미지 업로드 오류 모달 상태
  const [imageErrorModal, setImageErrorModal] = useState({
    is_open: false,
    message: "",
  });

  // 콘텐츠 제출 방식 선택 안내 모달 상태
  const [contentSubmitModal, setContentSubmitModal] = useState({
    is_open: false,
  });

  // 임시 저장 확인 모달 상태
  const [saveConfirmModal, setSaveConfirmModal] = useState({
    is_open: false,
  });

  // 불러오기 확인 모달 상태
  const [loadConfirmModal, setLoadConfirmModal] = useState({
    is_open: false,
  });

  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    is_open: false,
    message: "",
  });

  // 날짜 기본값 생성 (생성 모드이고 initialData가 없을 때만)
  const defaultDates = !initialData
    ? getDefaultCampaignDates()
    : {
        recruitmentPeriod: "",
        announcementDate: "",
        registrationPeriod: "",
      };

  const [formData, setFormData] = useState<CampaignFormData>(
    initialData || {
      campaignType: "미션형",
      title: "",
      category: "",
      brandName: "",
      providedItems: "",
      promotionLink: "",
      currentPoints: "58,000",
      additionalPoints: "",
      recruitmentCount: "",
      recruitmentPeriod: defaultDates.recruitmentPeriod,
      announcementDate: defaultDates.announcementDate,
      registrationPeriod: defaultDates.registrationPeriod,
      keywords: "",
      adultOnly: false,
      allowReParticipation: false,
      allowLateSubmission: false,
      minTextLength: "",
      minImageCount: "",
      videoCount: "",
      videoDuration: "",
      requireLinkAttachment: false,
      requireKeywordAttachment: false,
      requireContentLink: false,
      requireContentImage: false,
      guidelines: "",
      contactPhone: "",
      fairTradeAgreement: false,
      isUrgent: false,
    }
  );

  /**
   * 폼 데이터 업데이트
   */
  const updateFormData = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 체크박스 상태 업데이트
   */
  const updateCheckboxState = (
    field: keyof typeof checkboxStates,
    checked: boolean
  ) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [field]: checked,
    }));

    // 체크박스가 해제되면 해당 필드를 빈 문자열로 설정
    if (!checked) {
      const fieldMapping: Record<
        keyof typeof checkboxStates,
        keyof CampaignFormData
      > = {
        minTextLength: "minTextLength",
        minImageCount: "minImageCount",
        videoCount: "videoCount",
      };
      updateFormData(fieldMapping[field], "");
    }
  };

  /**
   * 숫자 입력 핸들러 래퍼 함수
   */
  const handleNumericInputWrapper = (
    field: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    handleNumericInput(e);
  };

  /**
   * 숫자 입력 변경 핸들러 래퍼 함수
   */
  const handleNumericChangeWrapper = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleNumericChange(e, (value) => {
      updateFormData(field as keyof CampaignFormData, value);
    });
  };

  /**
   * 썸네일 이미지 선택 처리
   *
   * 설명:
   * - 썸네일은 1장만 업로드 가능합니다.
   * - 우선순위: 개수 > 용량 > 확장자 순서로 검증합니다.
   */
  const handleThumbnailSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증 (우선순위: 확장자 > 용량)
    const validation = validateImageFile(file);
    if (!validation.isValid && validation.errorMessage) {
      setImageErrorModal({
        is_open: true,
        message: validation.errorMessage,
      });
      // input 값 초기화
      event.target.value = "";
      return;
    }

    setThumbnailImage(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setThumbnailPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // input 값 초기화
    event.target.value = "";
  };

  /**
   * 썸네일 이미지 제거 처리
   */
  const handleThumbnailRemove = () => {
    setThumbnailImage(null);
    setThumbnailPreview(null);
  };

  /**
   * 상세 이미지 선택 처리
   *
   * 설명:
   * - 상세 이미지는 최대 7장까지 업로드 가능합니다.
   * - 우선순위: 개수 > 용량 > 확장자 순서로 검증합니다.
   */
  const handleDetailImagesSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // 이미지 업로드 검증 (우선순위: 개수 > 용량 > 확장자)
    const validation = validateImagesForUpload(
      newFiles,
      detailImages.length,
      7 // 최대 7장
    );

    if (!validation.isValid && validation.errorMessage) {
      setImageErrorModal({
        is_open: true,
        message: validation.errorMessage,
      });
      // input 값 초기화
      event.target.value = "";
      return;
    }

    // 검증 통과한 파일들 추가
    setDetailImages((prev) => [...prev, ...newFiles]);

    // 이미지 미리보기 생성
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setDetailPreviews((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // input 값 초기화
    event.target.value = "";
  };

  /**
   * 상세 이미지 제거 처리
   */
  const handleDetailImageRemove = (index: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
    setDetailPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 캠페인 유형 변경 시 페이지 이동
   */
  const handleCampaignTypeChange = (type: string) => {
    if (type === "미션형") return; // 현재 타입과 같으면 이동하지 않음

    // 캠페인 유형에 따른 페이지 경로 매핑
    const typeRoutes: Record<string, string> = {
      배송형: "/partner/campaign/create/delivery",
      방문형: "/partner/campaign/create/visit",
      구매평: "/partner/campaign/create/review",
      기자단: "/partner/campaign/create/reporter",
    };

    router.push(typeRoutes[type]);
  };

  /**
   * 필수 요소 유효성 검사
   * 라벨에 *가 있는 모든 필드를 체크합니다.
   *
   */
  const isFormValid = useMemo(() => {
    if (isEditMode) return true;

    // 포인트 검증: 보유 포인트가 0보다 커야 합니다.
    const currentPoints =
      Number(String(formData.currentPoints).replace(/,/g, "")) || 0;
    if (currentPoints <= 0) {
      return false;
    }

    // 썸네일과 상세 이미지가 최소 1개 이상 업로드되었는지 확인
    const hasImages = thumbnailImage !== null && detailImages.length > 0;

    // 필수 텍스트 필드들이 모두 입력되었는지 확인
    const hasRequiredFields =
      formData.title.trim() !== "" &&
      formData.category !== "" &&
      formData.providedItems.trim() !== "" &&
      formData.recruitmentCount !== "" &&
      formData.recruitmentPeriod.trim() !== "" &&
      formData.announcementDate.trim() !== "" &&
      formData.registrationPeriod.trim() !== "" &&
      formData.keywords.trim() !== "" &&
      formData.guidelines.trim() !== "";

    const isValid = hasImages && hasRequiredFields;

    // 버튼이 활성화되었을 때 콘솔에 로그 출력
    if (isValid) {
      console.log("필수 입력완료 버튼 활성화");
    }

    // 디버깅: 필드별 상태 확인
    console.log("=== 폼 검증 상태 ===");
    console.log(
      "이미지 업로드:",
      hasImages,
      "썸네일:",
      thumbnailImage !== null,
      "상세 이미지:",
      detailImages.length
    );
    console.log("제목:", formData.title.trim() !== "" ? "✓" : "✗");
    console.log("카테고리:", formData.category !== "" ? "✓" : "✗");
    console.log("제공내역:", formData.providedItems.trim() !== "" ? "✓" : "✗");
    console.log("모집인원:", formData.recruitmentCount !== "" ? "✓" : "✗");
    console.log(
      "모집기간:",
      formData.recruitmentPeriod.trim() !== "" ? "✓" : "✗"
    );
    console.log(
      "선정날짜:",
      formData.announcementDate.trim() !== "" ? "✓" : "✗"
    );
    console.log(
      "등록기간:",
      formData.registrationPeriod.trim() !== "" ? "✓" : "✗"
    );
    console.log("키워드:", formData.keywords.trim() !== "" ? "✓" : "✗");
    console.log("안내사항:", formData.guidelines.trim() !== "" ? "✓" : "✗");
    console.log("버튼 활성화:", isValid ? "✓" : "✗");

    return isValid;
  }, [formData, thumbnailImage, detailImages]);

  /**
   * 차감 포인트 계산
   *
   * 설명:
   * - 미션형 캠페인의 차감 포인트는 {추가 지급 포인트 × 모집 인원}입니다.
   */
  const deductedPoints = useMemo(() => {
    const recruitmentCount = Number(formData.recruitmentCount) || 0;
    const additionalPoints =
      Number(String(formData.additionalPoints).replace(/,/g, "")) || 0;
    return additionalPoints * recruitmentCount;
  }, [formData.recruitmentCount, formData.additionalPoints]);

  /**
   * 포인트 부족 경고 표시 여부
   */
  const showInsufficientPointsWarning = useMemo(() => {
    const currentPoints =
      Number(String(formData.currentPoints).replace(/,/g, "")) || 0;
    return currentPoints < deductedPoints;
  }, [formData.currentPoints, deductedPoints]);

  /**
   * 포인트 충전 버튼 클릭 처리
   *
   * 설명:
   * - 포인트 충전 페이지로 이동합니다.
   * - 캠페인 등록 페이지에서 온 것임을 표시하기 위해 sessionStorage에 플래그를 저장합니다.
   */
  const handleChargeClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("from_campaign_create", "true");
    }
    router.push("/partner/point/charge");
  };

  // localStorage 키 (캠페인 타입별로 구분)
  const STORAGE_KEY = "temp_mission_campaign";

  /**
   * 컴포넌트 마운트 시 저장된 임시 데이터 확인
   *
   * 설명:
   * - 생성 모드이고 initialData가 없을 때만 확인합니다.
   * - 저장된 데이터가 있고 유효한 경우에만 불러오기 모달을 표시합니다.
   */
  useEffect(() => {
    if (isEditMode || initialData) return; // 수정 모드이거나 initialData가 있으면 실행하지 않음

    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      // JSON 파싱하여 유효한 데이터인지 확인
      const savedData = JSON.parse(saved);

      // 저장된 데이터가 객체이고 비어있지 않은 경우에만 모달 표시
      if (
        savedData &&
        typeof savedData === "object" &&
        Object.keys(savedData).length > 0
      ) {
        setLoadConfirmModal({ is_open: true });
      }
    } catch (error) {
      // JSON 파싱 실패 시 무효한 데이터로 간주하고 무시
      console.error("임시 저장 데이터 확인 실패:", error);
    }
  }, [isEditMode, initialData]);

  /**
   * 임시 저장 처리
   *
   * 설명:
   * - 임시 저장 확인 모달을 표시합니다.
   */
  const handleSave = () => {
    setSaveConfirmModal({ is_open: true });
  };

  /**
   * 임시 저장 확인 처리
   *
   * 설명:
   * - localStorage에 현재 폼 데이터를 저장합니다.
   * - 이미지 파일은 저장할 수 없으므로 제외합니다.
   */
  const handleSaveConfirm = () => {
    try {
      if (typeof window === "undefined") return;

      // 이미지를 제외한 formData만 저장 (File 객체는 JSON으로 변환할 수 없음)
      const dataToSave = { ...formData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

      // 모달 닫기
      setSaveConfirmModal({ is_open: false });

      // 토스트 메시지 표시
      setToast({ is_open: true, message: "저장되었습니다." });
    } catch (error) {
      console.error("임시 저장 실패:", error);
      alert("임시 저장에 실패했습니다.");
    }
  };

  /**
   * 불러오기 확인 처리
   *
   * 설명:
   * - localStorage에서 저장된 데이터를 불러와서 formData에 적용합니다.
   */
  const handleLoadConfirm = () => {
    try {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const savedData = JSON.parse(saved) as CampaignFormData;

      // 저장된 데이터로 formData 업데이트
      setFormData(savedData);

      // 모달 닫기
      setLoadConfirmModal({ is_open: false });
    } catch (error) {
      console.error("임시 저장 데이터 불러오기 실패:", error);
      alert("임시 저장 데이터를 불러오는데 실패했습니다.");
      setLoadConfirmModal({ is_open: false });
    }
  };

  /**
   * 불러오기 버튼 비활성화 여부
   *
   * 설명:
   * - localStorage에 저장된 데이터가 없으면 비활성화합니다.
   */
  const isLoadDisabledCheck = useMemo(() => {
    if (isSubmitting) return true;
    if (isEditMode || initialData) return true;

    if (typeof window === "undefined") return true;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return !saved;
    } catch {
      return true;
    }
  }, [isSubmitting, isEditMode, initialData]);

  /**
   * 폼 제출 처리
   *
   * 설명:
   * - 콘텐츠 제출 방식(링크 제출 또는 이미지 제출) 중 하나 이상이 선택되어 있어야 합니다.
   * - 선택되지 않았을 경우 안내 모달을 표시합니다.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 콘텐츠 제출 방식 검증 (미션형 캠페인만)
    const hasContentSubmitOption =
      formData.requireContentLink || formData.requireContentImage;

    if (!hasContentSubmitOption) {
      // 콘텐츠 제출 방식이 선택되지 않은 경우 안내 모달 표시
      setContentSubmitModal({ is_open: true });
      return;
    }

    // 업로드된 이미지 파일을 폼 데이터에 추가
    const formDataWithImages = {
      ...formData,
      // 썸네일 이미지
      thumbnailImage: thumbnailImage || undefined,
      // 썸네일 미리보기 URL (Data URL) - 캠페인 카드 표시용
      thumbnailImageUrl: thumbnailPreview || undefined,
      // 상세 이미지
      detailImages: detailImages,
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

      {/* 콘텐츠 제출 방식 선택 안내 모달 */}
      <BaseModal
        is_open={contentSubmitModal.is_open}
        on_close={() => setContentSubmitModal({ is_open: false })}
        message="콘텐츠 제출 방식을 선택해 주세요.<br>링크 제출 또는 이미지 제출 중 하나 이상을 선택해 주세요."
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
        onSave={handleSave}
        onLoad={() => setLoadConfirmModal({ is_open: true })}
        isSaveDisabled={isSubmitting}
        isLoadDisabled={isLoadDisabledCheck}
      />

      <form onSubmit={handleSubmit} className={infoStyles.campaign_form}>
        {/* 캠페인 정보 섹션 */}
        <section className={styles.section}>
          <h2 className={styles.section_title}>캠페인 정보</h2>

          {/* 캠페인 유형 선택 */}
          <CampaignTypeSelector
            currentType="미션형"
            onTypeChange={handleCampaignTypeChange}
            disabled={isEditMode}
          />

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
              className={infoStyles.form_input}
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              placeholder="캠페인 제목"
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
              className={infoStyles.form_input}
              value={formData.brandName}
              readOnly
            />
          </article>

          {/* 제공 내역 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              제공 내역<span className={infoStyles.required}>*</span>
            </label>
            <input
              type="text"
              className={infoStyles.form_input}
              value={formData.providedItems}
              onChange={(e) => updateFormData("providedItems", e.target.value)}
              placeholder="제공 내역을 입력하세요"
              readOnly={isEditMode && !isEditableField("providedItems")}
            />
          </article>

          {/* 홍보 링크 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>홍보 링크</label>
            <input
              type="url"
              className={infoStyles.form_input}
              value={formData.promotionLink}
              onChange={(e) => updateFormData("promotionLink", e.target.value)}
              placeholder="링크를 입력하세요"
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
                  className={infoStyles.form_input}
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
              className={infoStyles.form_input}
              value={formData.keywords}
              onChange={(e) => updateFormData("keywords", e.target.value)}
              placeholder="최대 10개 입력 가능"
              readOnly={isEditMode && !isEditableField("keywords")}
            />
          </article>

          {/* 기본 미션 설정 */}
          <article className={infoStyles.form_group}>
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
            />
          </article>

          {/* 참여/제출 옵션 (미션형 특수: requireContentLink, requireContentImage 포함) */}
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
            additionalOptions={[
              {
                id: "requireContentLink",
                label: "콘텐츠 링크 제출",
                checked: formData.requireContentLink || false,
                onChange: (value) =>
                  updateFormData("requireContentLink", value),
                field: "requireContentLink",
              },
              {
                id: "requireContentImage",
                label: "콘텐츠 이미지 제출",
                checked: formData.requireContentImage || false,
                onChange: (value) =>
                  updateFormData("requireContentImage", value),
                field: "requireContentImage",
              },
            ]}
          />

          {/* 안내 사항 */}
          <article className={infoStyles.form_group}>
            <label className={infoStyles.form_label}>
              안내 사항<span className={infoStyles.required}>*</span>
            </label>
            <textarea
              className={guideStyles.fixed_height_textarea}
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
        />

        {/* 등록하기 버튼 */}
        <div className={guideStyles.submit_button_container}>
          <button
            type="submit"
            className={guideStyles.submit_button}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting
              ? isEditMode
                ? "저장 중..."
                : "등록 중..."
              : isEditMode
              ? "저장하기"
              : "등록하기"}
          </button>
        </div>
      </form>
    </>
  );
}
