/* ========================================
   🎯 미션형 캠페인 생성 페이지
   ======================================== */

/**
 * 미션형 캠페인 생성 페이지
 *
 * 목적: 파트너가 미션형 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/mission
 *
 * 주요 기능:
 * - 미션형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 미션형 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 미션형 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MissionCampaignForm from "@/components/partner/campaign_create_form/MissionCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import { addMissionCampaign } from "@/data/campaign/mission/missionCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import BaseModal from "@/components/common/modal/BaseModal";

export default function MissionCampaignCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<CampaignFormData | null>(null);
  const [pendingIsUrgent, setPendingIsUrgent] = useState(false); // 확인 모달 열 때의 isUrgent 값 저장

  /**
   * localStorage에서 저장된 데이터의 isUrgent 값 불러오기
   *
   * 설명:
   * - 임시 저장된 데이터가 있으면 isUrgent 값을 불러와서 설정합니다.
   * - 컴포넌트 마운트 시 한 번만 실행됩니다.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("temp_mission_campaign");
      if (saved) {
        const savedData = JSON.parse(saved);
        if (savedData?.isUrgent === true) {
          setIsUrgent(true);
        }
      }
    } catch (error) {
      console.error("저장된 긴급 상태 불러오기 실패:", error);
    }
  }, []);

  /**
   * 캠페인 등록 확인 모달 열기
   *
   * 설명:
   * - 폼 제출 시 먼저 확인 모달을 표시합니다.
   * - 사용자가 확인을 누르면 실제 등록이 진행됩니다.
   * - 현재 isUrgent 상태 값을 함께 저장하여 확인 모달이 열린 후에도 변경되지 않도록 합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    // 디버깅: 폼 제출 시 isUrgent 상태 확인
    console.log("=== 미션형 캠페인 폼 제출 ===");
    console.log("현재 isUrgent 상태:", isUrgent);

    setPendingFormData(formData);
    setPendingIsUrgent(isUrgent); // 현재 isUrgent 값을 저장
    setIsConfirmModalOpen(true);
  };

  /**
   * 캠페인 등록 처리 (확인 모달에서 확인 버튼 클릭 시 실행)
   */
  const handleConfirm = async () => {
    if (!pendingFormData) return;

    setIsSubmitting(true);
    setIsConfirmModalOpen(false);

    try {
      const formData = pendingFormData;
      // 긴급 상태를 폼 데이터에 추가
      // 폼 제출 시 저장한 pendingIsUrgent 값을 사용 (확인 모달이 열린 후 변경되지 않도록)
      const finalFormData = { ...formData, isUrgent: pendingIsUrgent };

      // 디버깅: isUrgent 값 확인
      console.log("=== 미션형 캠페인 등록 - 긴급 상태 확인 ===");
      console.log("pendingIsUrgent 값:", pendingIsUrgent);
      console.log("현재 isUrgent 상태:", isUrgent);

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 사용 (Data URL 형식)
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      let imageUrl =
        formData.thumbnailImageUrl || "/images/main/campaign_img/eximg_4.png"; // 업로드된 이미지 또는 기본 이미지

      // 폼 데이터를 CampaignWithApplicants 형태로 변환
      const newCampaign = addMissionCampaign(finalFormData, imageUrl);

      // 상세 페이지에서 필요한 추가 정보를 포함한 확장 데이터 생성
      // 등록 시간 생성 (ISO 8601 형식: "2025-01-15T10:30:00")
      const registeredAt = new Date().toISOString();

      // contentType 결정: requireContentLink와 requireContentImage 체크박스에 따라 결정
      // - requireContentLink만 true → "link"
      // - requireContentImage만 true → "image"
      // - 둘 다 true → "both"
      let contentType: "link" | "image" | "both" | undefined = undefined;
      if (finalFormData.requireContentLink && finalFormData.requireContentImage) {
        contentType = "both";
      } else if (finalFormData.requireContentLink) {
        contentType = "link";
      } else if (finalFormData.requireContentImage) {
        contentType = "image";
      }

      const extendedCampaign = {
        ...newCampaign,
        // 긴급 캠페인 여부 (폼 제출 시 저장한 값 사용)
        isUrgent: pendingIsUrgent === true,
        // 등록 시간 (현재 시간)
        registeredAt: registeredAt,
        // 상세 페이지에서 필요한 추가 정보
        description: finalFormData.providedItems || "",
        productLink: finalFormData.promotionLink || "",
        keywords: finalFormData.keywords || "",
        guidelines: finalFormData.guidelines || "",
        // contentType (미션형 캠페인 전용)
        contentType: contentType,
        // 상세 이미지 미리보기 URL 배열 (Data URL) - localStorage 저장용
        detailImagePreviews: pendingFormData.detailImagePreviews || [],
        // requirements 생성용 필드들
        minTextLength: pendingFormData.minTextLength,
        minImageCount: pendingFormData.minImageCount,
        videoCount: pendingFormData.videoCount,
        videoDuration: pendingFormData.videoDuration,
        requireLinkAttachment: pendingFormData.requireLinkAttachment,
        requireKeywordAttachment: pendingFormData.requireKeywordAttachment,
        // points 계산용
        additionalPoints: pendingFormData.additionalPoints,
      };

      // localStorage에 임시 저장
      try {
        const storedCampaigns = localStorage.getItem("missionCampaigns");
        const campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];

        // 중복 ID 제거 (같은 ID가 있으면 새 것으로 교체)
        const existingIndex = campaigns.findIndex(
          (c: any) => c.id === (extendedCampaign as any).id
        );
        if (existingIndex >= 0) {
          campaigns[existingIndex] = extendedCampaign;
        } else {
          campaigns.push(extendedCampaign);
        }

        // 최대 50개까지만 유지 (오래된 것부터 제거)
        const MAX_CAMPAIGNS = 50;
        if (campaigns.length > MAX_CAMPAIGNS) {
          campaigns.splice(0, campaigns.length - MAX_CAMPAIGNS);
        }

        const campaignsString = JSON.stringify(campaigns);

        // localStorage 크기 제한 확인 (약 5MB 제한, 안전하게 4MB로 제한)
        const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB
        if (campaignsString.length > MAX_STORAGE_SIZE) {
          // 가장 오래된 캠페인부터 제거하여 크기 줄이기
          let trimmedCampaigns = [...campaigns];
          while (
            JSON.stringify(trimmedCampaigns).length > MAX_STORAGE_SIZE &&
            trimmedCampaigns.length > 1
          ) {
            trimmedCampaigns.shift(); // 가장 오래된 것 제거
          }
          localStorage.setItem(
            "missionCampaigns",
            JSON.stringify(trimmedCampaigns)
          );
        } else {
          localStorage.setItem("missionCampaigns", campaignsString);
        }
      } catch (error: any) {
        // localStorage 할당량 초과 또는 기타 오류 처리
        if (error.name === "QuotaExceededError") {
          // 오래된 캠페인 제거 후 재시도
          const storedCampaigns = localStorage.getItem("missionCampaigns");
          if (storedCampaigns) {
            const campaigns = JSON.parse(storedCampaigns);
            // 절반만 남기고 나머지 제거
            const keepCount = Math.floor(campaigns.length / 2);
            const trimmedCampaigns = campaigns.slice(-keepCount);
            trimmedCampaigns.push(extendedCampaign);
            localStorage.setItem(
              "missionCampaigns",
              JSON.stringify(trimmedCampaigns)
            );
          } else {
            // 저장된 데이터가 없으면 새로 저장
            localStorage.setItem(
              "missionCampaigns",
              JSON.stringify([extendedCampaign])
            );
          }
        } else {
          console.error("localStorage 저장 실패:", error);
          setIsErrorModalOpen(true);
          return;
        }
      }

      console.log("미션형 캠페인 등록 완료:", newCampaign);

      // 등록 성공 시 캠페인 상태에 맞는 탭으로 이동
      const campaignStatus = newCampaign.campaignInfo.status;
      let redirectPath = "/partner/campaign_management";

      switch (campaignStatus) {
        case "대기 중":
          redirectPath = "/partner/campaign_management/scheduled";
          break;
        case "모집 중":
          redirectPath = "/partner/campaign_management/applied";
          break;
        case "등록 중":
          redirectPath = "/partner/campaign_management/progress";
          break;
        default:
          redirectPath = "/partner/campaign_management";
          break;
      }

      router.replace(redirectPath);
    } catch (error) {
      console.error("미션형 캠페인 등록 실패:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
      setPendingIsUrgent(false); // 초기화
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <PageHeader
          title="새 캠페인 등록"
          onUrgentChange={setIsUrgent}
          initialUrgent={isUrgent}
        />

        {/* 미션형 캠페인 등록 폼 */}
        <MissionCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onUrgentLoad={setIsUrgent}
        />

        {/* 확인 모달 */}
        <BaseModal
          is_open={isConfirmModalOpen}
          on_close={() => {
            setIsConfirmModalOpen(false);
            setPendingFormData(null);
          }}
          message="캠페인 진행 시에는 삭제/수정이 불가합니다.<br>캠페인을 등록하시겠습니까?"
          buttons={["취소", "확인"]}
          on_confirm={handleConfirm}
        />

        {/* 오류 모달 */}
        <BaseModal
          is_open={isErrorModalOpen}
          on_close={() => setIsErrorModalOpen(false)}
          message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
          buttons={["확인"]}
        />
      </div>
    </div>
  );
}
