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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import MissionCampaignForm from "@/components/partner/campaign_create_form/MissionCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import { addMissionCampaign } from "@/data/campaign/mission/missionCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import BaseModal from "@/components/common/modal/BaseModal";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import { getPartnerName } from "@/utils/partner/partnerHelpers";
import { saveCampaignToStorage } from "@/utils/partner/campaignStorage";

export default function MissionCampaignCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CampaignFormData | null>(null);
  const [pendingIsUrgent, setPendingIsUrgent] = useState(false); // 확인 모달 열 때의 isUrgent 값 저장

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
    // console.log("=== 미션형 캠페인 폼 제출 ===");
    // console.log("현재 isUrgent 상태:", isUrgent);

    setPendingFormData(formData);
    setPendingIsUrgent(isUrgent); // 현재 isUrgent 값을 저장
    setIsConfirmModalOpen(true);
  };

  /**
   * 캠페인 등록 처리 (확인 모달에서 확인 버튼 클릭 시 실행)
   */
  const handleConfirm = async () => {
    if (!pendingFormData || isSubmitting) return;

    setIsConfirmModalOpen(false);
    setIsSubmitting(true);

    try {
      const formData = pendingFormData;
      // 긴급 상태를 폼 데이터에 추가
      // 폼 제출 시 저장한 pendingIsUrgent 값을 사용 (확인 모달이 열린 후 변경되지 않도록)
      const finalFormData = { ...formData, isUrgent: pendingIsUrgent };

      // 디버깅: isUrgent 값 확인
      // console.log("=== 미션형 캠페인 등록 - 긴급 상태 확인 ===");
      // console.log("pendingIsUrgent 값:", pendingIsUrgent);
      // console.log("현재 isUrgent 상태:", isUrgent);

      // 이미지 URL 처리
      // localStorage 용량 문제로 base64 이미지는 저장하지 않고 기본 이미지 사용
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      const imageUrl = "/images/main/campaign_img/eximg_4.png"; // 기본 이미지 사용

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

      // 파트너명 가져오기 (partner_accounts에서)
      const partnerName = getPartnerName(user?.id || "partner_test_001");

      const extendedCampaign = {
        ...newCampaign,
        // 파트너 ID 추가
        partner_id: user?.id || "partner_test_001",
        // 파트너명 추가
        partnerName: partnerName,
        // campaignInfo에도 partnerName 추가
        campaignInfo: {
          ...newCampaign.campaignInfo,
          partnerName: partnerName,
        },
        // 긴급 캠페인 여부 (폼 제출 시 저장한 값 사용)
        isUrgent: pendingIsUrgent === true,
        // 등록 시간 (현재 시간)
        registeredAt: registeredAt,
        // 채널 정보 (최상위 레벨에도 추가)
        channel: finalFormData.platform || "",
        // 상세 페이지에서 필요한 추가 정보
        description: finalFormData.providedItems || "",
        productLink: finalFormData.promotionLink || "",
        keywords: finalFormData.keywords || "",
        guidelines: finalFormData.guidelines || "",
        // contentType (미션형 캠페인 전용)
        contentType: contentType,
        // 상세 이미지는 localStorage 용량 문제로 저장하지 않음 (미리보기 URL은 폼에서만 사용)
        // detailImagePreviews: pendingFormData.detailImagePreviews || [],
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

      // 현재는 localStorage에 임시 저장 (실제 프로덕션에서는 API 사용)
      const saved = saveCampaignToStorage(
        extendedCampaign as Record<string, unknown>,
        "missionCampaigns"
      );
      if (!saved) {
        setIsErrorModalOpen(true);
        return;
      }

      // console.log("미션형 캠페인 등록 완료:", newCampaign);

      // 등록 성공 시 캠페인 관리 전체 탭으로 이동
      router.replace("/partner/campaign_management");
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
      {/* 파트너 서브헤더 */}
      <PartnerSubHeader />

      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />

        {/* 미션형 캠페인 등록 폼 */}
        <MissionCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onUrgentLoad={setIsUrgent}
          isUrgent={isUrgent}
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
