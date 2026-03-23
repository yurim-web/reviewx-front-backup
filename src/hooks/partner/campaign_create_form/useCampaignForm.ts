/* ========================================
   캠페인 폼 공통 훅
   ======================================== */

/**
 * useCampaignForm
 *
 * 목적: 모든 캠페인 폼(방문형, 구매평, 미션형, 배송형, 기자단) 공통 폼 상태 관리
 *
 * 사용 페이지:
 * - /partner/campaign/create/delivery (배송형 캠페인 등록)
 * - /partner/campaign/create/visit (방문형 캠페인 등록)
 * - /partner/campaign/create/review (구매평 캠페인 등록)
 * - /partner/campaign/create/mission (미션형 캠페인 등록)
 * - /partner/campaign/create/reporter (기자단 캠페인 등록)
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { CampaignFormData } from "@/types/domain/user";
import { useAuth } from "@/hooks/useAuth";
import { usePartnerProfile } from "@/hooks/partner/mypage/usePartnerMypage";
import {
  handleNumericInput as utilHandleNumericInput,
  handleNumericChange as utilHandleNumericChange,
  validateImageFile,
  validateImagesForUpload,
  getDefaultCampaignDates,
} from "@/components/partner/campaign_create_form/common/utils/formUtils";

/**
 * 캠페인 타입별 필드 정의
 */
export type CampaignType = "방문형" | "구매평" | "미션형" | "배송형" | "기자단";

/**
 * 캠페인 타입별 오픈 후 수정 가능 필드 맵
 */
const EDITABLE_AFTER_OPEN_FIELDS: Record<CampaignType, Set<string>> = {
  방문형: new Set([
    "promotionLink",
    "additionalPoints",
    "adultOnly",
    "allowReParticipation",
    "allowLateSubmission",
    "minTextLength",
    "minImageCount",
    "videoCount",
    "videoDuration",
    "requireLinkAttachment",
    "requireKeywordAttachment",
    "contactPhone",
    "visitAddress",
    "addressDetail",
    "visitLink",
  ]),
  구매평: new Set([
    "promotionLink",
    "additionalPoints",
    "adultOnly",
    "allowReParticipation",
    "allowLateSubmission",
    "minTextLength",
    "minImageCount",
    "videoCount",
    "videoDuration",
    "requireLinkAttachment",
    "requireKeywordAttachment",
    "contactPhone",
  ]),
  미션형: new Set([
    "promotionLink",
    "additionalPoints",
    "adultOnly",
    "allowReParticipation",
    "allowLateSubmission",
    "minTextLength",
    "minImageCount",
    "videoCount",
    "videoDuration",
    "requireLinkAttachment",
    "requireKeywordAttachment",
    "requireContentLink",
    "requireContentImage",
    "contactPhone",
  ]),
  배송형: new Set([
    "promotionLink",
    "additionalPoints",
    "adultOnly",
    "allowReParticipation",
    "allowLateSubmission",
    "minTextLength",
    "minImageCount",
    "videoCount",
    "videoDuration",
    "requireLinkAttachment",
    "requireKeywordAttachment",
    "contactPhone",
    "deliveryAddress",
  ]),
  기자단: new Set([
    "promotionLink",
    "additionalPoints",
    "adultOnly",
    "allowReParticipation",
    "allowLateSubmission",
    "minTextLength",
    "minImageCount",
    "videoCount",
    "videoDuration",
    "requireLinkAttachment",
    "requireKeywordAttachment",
    "contactPhone",
  ]),
};

interface UseCampaignFormProps {
  /** 캠페인 타입 */
  campaignType: CampaignType;
  /** 초기 데이터 (수정 모드용) */
  initialData?: CampaignFormData | null;
  /** 폼 모드 */
  mode?: "create" | "edit";
  /** 캠페인 오픈 여부 (수정 모드용) */
  isOpen?: boolean;
  /** 긴급 상태 부모 전달 콜백 */
  onUrgentLoad?: (isUrgent: boolean) => void;
}

export function useCampaignForm({
  campaignType,
  initialData,
  mode = "create",
  isOpen = false,
  onUrgentLoad: _onUrgentLoad,
}: UseCampaignFormProps) {
  const { user } = useAuth();
  const { data: partnerProfile } = usePartnerProfile();
  const isEditMode = mode === "edit";

  /**
   * 수정 모드에서 편집 가능 필드 정의
   */
  const isEditableField = (field: string): boolean => {
    if (!isEditMode) {
      // 생성 모드에서는 모든 필드 편집 가능
      return true;
    }

    if (!isOpen) {
      // 오픈 전: 상호명(brandName) 제외 모든 항목 수정 가능
      return field !== "brandName";
    } else {
      // 오픈 후: 캠페인 타입별 수정 가능 필드 체크
      const editableFields = EDITABLE_AFTER_OPEN_FIELDS[campaignType];
      return editableFields.has(field);
    }
  };

  // 날짜 기본값 생성
  const defaultDates = !initialData
    ? getDefaultCampaignDates()
    : {
        recruitmentPeriod: "",
        announcementDate: "",
        registrationPeriod: "",
      };

  /**
   * 상호명 초기값 가져오기
   */
  const getDefaultBrandName = (): string => {
    return user?.business_name || "";
  };

  const defaultBrandName = !initialData ? getDefaultBrandName() : "";

  // 폼 데이터 상태
  const [formData, setFormData] = useState<CampaignFormData>(() => {
    const defaultState: CampaignFormData = {
      campaignType,
      platform: "",
      title: "",
      category: "",
      region: "",
      subRegion: "",
      brandName: defaultBrandName,
      providedItems: "",
      promotionLink: "",
      visitLink: "",
      visitAddress: "",
      visitZipCode: "",
      visitBaseAddress: "",
      visitDetailAddress: "",
      addressDetail: "",
      purchaseLink: "",
      purchasePoints: "",
      purchasePeriod: "",
      deliveryZipCode: "",
      deliveryBaseAddress: "",
      deliveryDetailAddress: "",
      currentPoints: "",
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
    };

    if (!initialData) return defaultState;

    return {
      ...initialData,
      visitZipCode: initialData.visitZipCode ?? "",
      visitBaseAddress: initialData.visitBaseAddress ?? initialData.visitAddress ?? "",
      visitDetailAddress: initialData.visitDetailAddress ?? "",
    };
  });

  // 이미지 업로드 관련 state
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

  // 프로필에서 담당자 번호 자동 세팅 (생성 모드 + 아직 입력 안 된 경우)
  useEffect(() => {
    if (!isEditMode && partnerProfile?.contactPhone && !formData.contactPhone) {
      const phone = partnerProfile.contactPhone;
      // 하이픈 포맷팅
      const numbers = phone.replace(/\D/g, "");
      let formatted = numbers;
      if (numbers.length > 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      } else if (numbers.length > 3) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      }
      setFormData((prev) => ({ ...prev, contactPhone: formatted }));
    }
  }, [isEditMode, partnerProfile, formData.contactPhone]);

  // 모달 상태 관리
  const [imageErrorModal, setImageErrorModal] = useState({
    is_open: false,
    message: "",
  });

  const [saveConfirmModal, setSaveConfirmModal] = useState({
    is_open: false,
  });

  const [loadConfirmModal, setLoadConfirmModal] = useState({
    is_open: false,
  });

  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    is_open: false,
    message: "",
  });

  // 불러오기 버튼 비활성화 여부
  const [isLoadDisabled, setIsLoadDisabled] = useState(true);

  /**
   * 폼 데이터 업데이트
   */
  const updateFormData = (
    field: keyof CampaignFormData,
    value: CampaignFormData[keyof CampaignFormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 수정 모드일 때 공정위 문구 기본 체크
   */
  useEffect(() => {
    if (!isEditMode) return;
    if (!formData.fairTradeAgreement) {
      setFormData((prev) => ({
        ...prev,
        fairTradeAgreement: true,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  /**
   * initialData가 있을 때 이미지 미리보기 및 체크박스 상태 설정
   */
  useEffect(() => {
    if (initialData && isEditMode) {
      // 썸네일 이미지 미리보기 설정
      if (initialData.thumbnailImageUrl) {
        setThumbnailPreview(initialData.thumbnailImageUrl);
      }

      // 상세 이미지 미리보기 설정
      if (initialData.detailImagePreviews && initialData.detailImagePreviews.length > 0) {
        setDetailPreviews(initialData.detailImagePreviews);
      }

      // 체크박스 상태 설정
      setCheckboxStates({
        minTextLength: !!initialData.minTextLength,
        minImageCount: !!initialData.minImageCount,
        videoCount: !!initialData.videoCount,
      });
    }
  }, [initialData, isEditMode]);

  /**
   * 체크박스 상태 업데이트
   */
  const updateCheckboxState = (field: keyof typeof checkboxStates, checked: boolean) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  /**
   * 숫자 입력 핸들러 래퍼 함수
   */
  const handleNumericInputWrapper = (field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    utilHandleNumericInput(e);
  };

  /**
   * 숫자 입력 변경 핸들러 래퍼 함수
   */
  const handleNumericChangeWrapper = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    utilHandleNumericChange(e, (value) => {
      updateFormData(field as keyof CampaignFormData, value);
    });
  };

  /**
   * 썸네일 이미지 선택 처리
   */
  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    const validation = validateImageFile(file);
    if (!validation.isValid && validation.errorMessage) {
      setImageErrorModal({
        is_open: true,
        message: validation.errorMessage,
      });
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
   */
  const handleDetailImagesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // 이미지 업로드 검증 (최대 7장) - 임시저장 복원된 previews도 포함하여 카운트
    const currentCount = Math.max(detailImages.length, detailPreviews.length);
    const validation = validateImagesForUpload(newFiles, currentCount, 7);

    if (!validation.isValid && validation.errorMessage) {
      setImageErrorModal({
        is_open: true,
        message: validation.errorMessage,
      });
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
   * 차감 포인트 계산
   */
  const deductedPoints = useMemo(() => {
    const recruitmentCount = Number(formData.recruitmentCount) || 0;
    const additionalPoints = Number(String(formData.additionalPoints).replace(/,/g, "")) || 0;
    return additionalPoints * recruitmentCount;
  }, [formData.recruitmentCount, formData.additionalPoints]);

  /**
   * 포인트 부족 경고 표시 여부
   */
  const showInsufficientPointsWarning = useMemo(() => {
    const currentPoints = Number(String(formData.currentPoints).replace(/,/g, "")) || 0;
    return currentPoints < deductedPoints;
  }, [formData.currentPoints, deductedPoints]);

  return {
    // 상태
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

    // 상태 업데이트 함수
    setImageErrorModal,
    setSaveConfirmModal,
    setLoadConfirmModal,
    setToast,
    setIsLoadDisabled,
    setThumbnailImage,
    setThumbnailPreview,
    setDetailImages,
    setDetailPreviews,

    // 핸들러
    updateFormData,
    updateCheckboxState,
    handleNumericInputWrapper,
    handleNumericChangeWrapper,
    handleThumbnailSelect,
    handleThumbnailRemove,
    handleDetailImagesSelect,
    handleDetailImageRemove,

    // 유틸리티
    isEditableField,
  };
}
