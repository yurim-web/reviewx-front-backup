/* ========================================
   📍 캠페인 폼 유효성 검증 훅
   ======================================== */

/**
 * 캠페인 폼 유효성 검증 훅
 *
 * 목적: 캠페인 폼의 필수 입력 항목 검증 로직을 제공합니다.
 *
 * 주요 기능:
 * - 필수 필드 검증
 * - 이미지 업로드 검증
 * - 기본 미션 설정 검증
 * - 포인트 검증
 * - 휴대폰 번호 검증
 */

"use client";

import { useMemo } from "react";
import { CampaignFormData } from "@/types/domain/user";
import { validatePhone } from "@/utils/validation";
import type { CampaignType } from "./useCampaignForm";

interface UseCampaignFormValidationProps {
  /** 캠페인 타입 */
  campaignType: CampaignType;
  /** 폼 데이터 */
  formData: CampaignFormData;
  /** 썸네일 이미지 파일 */
  thumbnailImage: File | null;
  /** 썸네일 미리보기 URL */
  thumbnailPreview: string | null;
  /** 상세 이미지 파일 배열 */
  detailImages: File[];
  /** 상세 이미지 미리보기 URL 배열 */
  detailPreviews: string[];
  /** 체크박스 상태 */
  checkboxStates: {
    minTextLength: boolean;
    minImageCount: boolean;
    videoCount: boolean;
  };
  /** 수정 모드 여부 */
  isEditMode: boolean;
}

export function useCampaignFormValidation({
  campaignType,
  formData,
  thumbnailImage,
  thumbnailPreview,
  detailImages,
  detailPreviews,
  checkboxStates,
  isEditMode,
}: UseCampaignFormValidationProps) {
  /**
   * 필수 요소 유효성 검사
   */
  const isFormValid = useMemo(() => {
    // 포인트 검증: 보유 포인트가 0보다 커야 함
    const currentPoints =
      Number(String(formData.currentPoints).replace(/,/g, "")) || 0;
    if (currentPoints <= 0) {
      console.log("❌ 포인트 검증 실패:", currentPoints);
      return false;
    }

    // 이미지 검증
    const hasImages = isEditMode
      ? (thumbnailPreview !== null || thumbnailImage !== null) &&
        (detailPreviews.length > 0 || detailImages.length > 0)
      : thumbnailImage !== null && detailImages.length > 0;

    if (!hasImages) {
      console.log("❌ 이미지 검증 실패:", {
        thumbnailImage: !!thumbnailImage,
        thumbnailPreview: !!thumbnailPreview,
        detailImagesCount: detailImages.length,
        detailPreviewsCount: detailPreviews.length,
      });
    }

    /**
     * 기본 미션 설정 필수 입력 검증
     *
     * - 체크박스가 체크되어 있으면 해당 input 필드에 값이 필수
     */
    const hasValidMissionSettings =
      // 글자 수 체크박스
      (!checkboxStates.minTextLength ||
        (checkboxStates.minTextLength &&
          formData.minTextLength !== "" &&
          Number(String(formData.minTextLength).replace(/,/g, "")) > 0)) &&
      // 이미지 장수 체크박스
      (!checkboxStates.minImageCount ||
        (checkboxStates.minImageCount &&
          formData.minImageCount !== "" &&
          Number(String(formData.minImageCount).replace(/,/g, "")) > 0)) &&
      // 동영상 개수 체크박스
      (!checkboxStates.videoCount ||
        (checkboxStates.videoCount &&
          formData.videoCount !== "" &&
          Number(String(formData.videoCount).replace(/,/g, "")) > 0 &&
          formData.videoDuration !== "" &&
          Number(String(formData.videoDuration).replace(/,/g, "")) > 0));

    if (!hasValidMissionSettings) {
      console.log("❌ 미션 설정 검증 실패:", {
        checkboxStates,
        minTextLength: formData.minTextLength,
        minImageCount: formData.minImageCount,
        videoCount: formData.videoCount,
        videoDuration: formData.videoDuration,
      });
    }

    // 캠페인 타입별 필수 필드 검증
    const hasRequiredFields = validateRequiredFieldsByCampaignType(
      campaignType,
      formData,
      hasValidMissionSettings
    );

    if (!hasRequiredFields) {
      console.log("❌ 필수 필드 검증 실패");
    }

    const isValid = hasImages && hasRequiredFields;

    console.log("=== 폼 유효성 검증 결과 ===", {
      campaignType,
      currentPoints,
      hasImages,
      hasValidMissionSettings,
      hasRequiredFields,
      isValid,
    });

    return isValid;
  }, [
    campaignType,
    formData,
    thumbnailImage,
    thumbnailPreview,
    detailImages,
    detailPreviews,
    checkboxStates,
    isEditMode,
  ]);

  return {
    isFormValid,
  };
}

/**
 * 캠페인 타입별 필수 필드 검증
 */
function validateRequiredFieldsByCampaignType(
  campaignType: CampaignType,
  formData: CampaignFormData,
  hasValidMissionSettings: boolean
): boolean {
  // 기본 공통 필수 필드
  const checks = {
    title: formData.title.trim() !== "",
    category: formData.category !== "",
    providedItems: formData.providedItems.trim() !== "",
    recruitmentCount: formData.recruitmentCount !== "",
    recruitmentPeriod: formData.recruitmentPeriod.trim() !== "",
    announcementDate: formData.announcementDate.trim() !== "",
    registrationPeriod: formData.registrationPeriod.trim() !== "",
    keywords: formData.keywords.trim() !== "",
    guidelines: formData.guidelines.trim() !== "",
    contactPhone: validatePhone((formData.contactPhone || "").trim()),
    fairTradeAgreement: formData.fairTradeAgreement === true,
    hasValidMissionSettings: hasValidMissionSettings,
  };

  const baseFieldsValid = Object.values(checks).every(v => v === true);

  if (!baseFieldsValid) {
    console.log("❌ 기본 필드 검증 실패:", checks);
  }

  // 캠페인 타입별 추가 필수 필드 검증
  switch (campaignType) {
    case "방문형":
      return (
        baseFieldsValid &&
        (formData.platform || "").trim() !== "" &&
        formData.region !== "" &&
        formData.subRegion !== "" &&
        (formData.visitBaseAddress?.trim() ?? "") !== ""
      );

    case "배송형":
      const deliveryChecks = {
        baseFieldsValid,
        platform: (formData.platform || "").trim() !== "",
      };
      const deliveryValid = Object.values(deliveryChecks).every(v => v === true);
      if (!deliveryValid) {
        console.log("❌ 배송형 추가 필드 검증 실패:", deliveryChecks);
      }
      return deliveryValid;

    case "구매평":
      return (
        baseFieldsValid &&
        (formData.platform || "").trim() !== "" &&
        (formData.purchaseLink?.trim() ?? "") !== ""
      );

    case "기자단":
      return (
        baseFieldsValid &&
        (formData.platform || "").trim() !== ""
      );

    case "미션형":
      // 미션형은 platform 필드가 없음
      return baseFieldsValid;

    default:
      return baseFieldsValid;
  }
}
