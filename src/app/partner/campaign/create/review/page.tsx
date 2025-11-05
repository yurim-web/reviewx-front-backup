/* ========================================
   🛒 구매평 캠페인 생성 페이지
   ======================================== */

/**
 * 구매평 캠페인 생성 페이지
 *
 * 목적: 파트너가 구매평 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/review
 *
 * 주요 기능:
 * - 구매평 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 구매평 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 구매평 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewCampaignForm from "@/components/partner/campaign/campaign_create_form/ReviewCampaignForm";
import { CampaignFormData } from "@/types/campaign";
import { addReviewCampaign } from "@/data/partner/review";
// 분리된 CSS 모듈들 import
import layoutStyles from "../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign/campaign_create_form/common/PageHeader";

export default function ReviewCampaignCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  /**
   * 캠페인 등록 처리
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 사용 (Data URL 형식)
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      let imageUrl = formData.thumbnailImageUrl || "/images/main/campaign_img/eximg_5.png"; // 업로드된 이미지 또는 기본 이미지

      // 폼 데이터를 CampaignWithApplicants 형태로 변환
      const newCampaign = addReviewCampaign(finalFormData, imageUrl);

      // localStorage에 임시 저장
      const storedCampaigns = localStorage.getItem("reviewCampaigns");
      const campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];
      campaigns.push(newCampaign);
      localStorage.setItem("reviewCampaigns", JSON.stringify(campaigns));

      console.log("구매평 캠페인 등록 완료:", newCampaign);

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
        case "진행 중":
          redirectPath = "/partner/campaign_management/progress";
          break;
        default:
          redirectPath = "/partner/campaign_management";
          break;
      }

      router.replace(redirectPath);
    } catch (error) {
      console.error("구매평 캠페인 등록 실패:", error);
      alert("캠페인 등록에 실패했습니다. 다시 시도해주세요.");
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

        {/* 구매평 캠페인 등록 폼 */}
        <ReviewCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
