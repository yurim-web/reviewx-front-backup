/* ========================================
   📦 배송형 캠페인 생성 페이지
   ======================================== */

/**
 * 배송형 캠페인 생성 페이지
 *
 * 목적: 파트너가 배송형 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/delivery
 *
 * 주요 기능:
 * - 배송형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 배송형 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 배송형 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryCampaignForm from "@/components/partner/campaign_create_form/DeliveryCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import { addDeliveryCampaign } from "@/data/campaign/delivery/deliveryCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import BaseModal from "@/components/common/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";

export default function DeliveryCampaignCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * 모바일 여부 감지 및 헤더 숨기기 처리
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 모바일에서는 헤더 숨기기
    const header = document.querySelector("header");
    if (window.innerWidth <= 768 && header) {
      header.style.display = "none";
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      // cleanup: 헤더 다시 표시
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

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
      const saved = localStorage.getItem("temp_delivery_campaign");
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
   * 캠페인 등록 처리 (폼에서 직접 호출)
   *
   * 설명:
   * - DeliveryCampaignForm에서 이미 확인 모달을 표시하므로,
   *   여기서는 바로 등록 처리를 진행합니다.
   * - 현재 isUrgent 상태 값을 함께 저장하여 등록 시 사용합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    // 디버깅: 폼 제출 시 isUrgent 상태 확인
    console.log("=== 배송형 캠페인 폼 제출 ===");
    console.log("현재 isUrgent 상태:", isUrgent);

    // 바로 등록 처리 진행 (확인 모달은 DeliveryCampaignForm에서 이미 표시됨)
    await handleConfirmRegistration(formData, isUrgent);
  };

  /**
   * 캠페인 등록 처리
   *
   * 설명:
   * - 폼에서 입력받은 데이터를 delivery.ts 구조로 변환합니다.
   * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
   * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
   *   localStorage를 사용하여 임시 저장합니다.
   */
  const handleConfirmRegistration = async (formData: CampaignFormData, isUrgentValue: boolean) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent: isUrgentValue };

      // 디버깅: isUrgent 값 확인
      console.log("=== 배송형 캠페인 등록 - 긴급 상태 확인 ===");
      console.log("isUrgentValue 값:", isUrgentValue);
      console.log("현재 isUrgent 상태:", isUrgent);

      // 이미지 URL 처리
      // localStorage 용량 문제로 base64 이미지는 저장하지 않고 기본 이미지 사용
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      let imageUrl = "/images/main/campaign_img/eximg_1.png"; // 기본 이미지 사용

      // TODO: 실제 프로덕션에서는 이미지 업로드 API 호출
      // const imageUploadResponse = await uploadImages(formData.thumbnailImage, formData.detailImages);
      // imageUrl = imageUploadResponse.thumbnailUrl;

      // 폼 데이터를 CampaignWithApplicants 형태로 변환
      const newCampaign = addDeliveryCampaign(finalFormData, imageUrl);

      // 상세 페이지에서 필요한 추가 정보를 포함한 확장 데이터 생성
      // 등록 시간 생성 (ISO 8601 형식: "2025-01-15T10:30:00")
      const registeredAt = new Date().toISOString();

      // 파트너명 가져오기 (partner_accounts에서)
      let partnerName = "";
      try {
        if (typeof window !== "undefined") {
          const storedAccounts = localStorage.getItem("partner_accounts");
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            const partnerAccount = accounts.find(
              (a: any) => a.id === (user?.id || 'partner_test_001')
            );
            if (partnerAccount) {
              // business_name 우선, 없으면 name 사용
              partnerName = partnerAccount.business_name || partnerAccount.name || "";
            }
          }
        }
      } catch (error) {
        console.error("파트너명 조회 중 오류:", error);
      }

      const extendedCampaign = {
        ...newCampaign,
        // 파트너 ID 추가 (로그인된 사용자)
        partner_id: user?.id || 'partner_test_001',
        // 파트너명 추가
        partnerName: partnerName,
        // campaignInfo에도 partnerName 추가
        campaignInfo: {
          ...newCampaign.campaignInfo,
          partnerName: partnerName,
        },
        // 긴급 캠페인 여부
        isUrgent: isUrgentValue === true,
        // 등록 시간 (현재 시간)
        registeredAt: registeredAt,
        // 채널 정보 (최상위 레벨에도 추가)
        channel: finalFormData.platform || "",
        // 상세 페이지에서 필요한 추가 정보
        description: finalFormData.providedItems || "",
        promotionLink: finalFormData.promotionLink || "",
        keywords: finalFormData.keywords || "",
        guidelines: finalFormData.guidelines || "",
        // 상세 이미지는 localStorage 용량 문제로 저장하지 않음 (미리보기 URL은 폼에서만 사용)
        // detailImagePreviews: finalFormData.detailImagePreviews || [],
        // requirements 생성용 필드들
        minTextLength: finalFormData.minTextLength,
        minImageCount: finalFormData.minImageCount,
        videoCount: finalFormData.videoCount,
        videoDuration: finalFormData.videoDuration,
        requireLinkAttachment: finalFormData.requireLinkAttachment,
        requireKeywordAttachment: finalFormData.requireKeywordAttachment,
        // points 계산용
        additionalPoints: finalFormData.additionalPoints,
      };

      // TODO: 실제 프로덕션에서는 API 호출
      // await fetch('/api/campaigns', {
      //   method: 'POST',
      //   body: JSON.stringify(newCampaign),
      // });

      // 현재는 localStorage에 임시 저장 (실제 프로덕션에서는 API 사용)
      try {
        const storedCampaigns = localStorage.getItem("deliveryCampaigns");
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
            "deliveryCampaigns",
            JSON.stringify(trimmedCampaigns)
          );
        } else {
          localStorage.setItem("deliveryCampaigns", campaignsString);
        }
      } catch (error: any) {
        // localStorage 할당량 초과 또는 기타 오류 처리
        if (error.name === "QuotaExceededError") {
          // 오래된 캠페인 제거 후 재시도
          const storedCampaigns = localStorage.getItem("deliveryCampaigns");
          if (storedCampaigns) {
            const campaigns = JSON.parse(storedCampaigns);
            // 절반만 남기고 나머지 제거
            const keepCount = Math.floor(campaigns.length / 2);
            const trimmedCampaigns = campaigns.slice(-keepCount);
            trimmedCampaigns.push(extendedCampaign);
            localStorage.setItem(
              "deliveryCampaigns",
              JSON.stringify(trimmedCampaigns)
            );
          } else {
            // 저장된 데이터가 없으면 새로 저장
            localStorage.setItem(
              "deliveryCampaigns",
              JSON.stringify([extendedCampaign])
            );
          }
        } else {
          console.error("localStorage 저장 실패:", error);
          setIsErrorModalOpen(true);
          return;
        }
      }

      console.log("배송형 캠페인 등록 완료:", newCampaign);

      // 등록 성공 시 캠페인 관리 전체 탭으로 이동
      // replace를 사용하여 히스토리에 등록 페이지를 남기지 않음
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("배송형 캠페인 등록 실패:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
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

        {/* 배송형 캠페인 등록 폼 */}
        <DeliveryCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onUrgentLoad={setIsUrgent}
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
