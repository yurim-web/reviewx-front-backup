/* ========================================
   📍 방문형 캠페인 생성 페이지
   ======================================== */

/**
 * 방문형 캠페인 생성 페이지
 *
 * 목적: 파트너가 방문형 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/visit
 *
 * 주요 기능:
 * - 방문형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 방문형 캠페인 상세 정보 입력 (지역, 방문 주소 등)
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 방문형 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VisitCampaignForm from "@/components/partner/campaign_create_form/VisitCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import { addVisitCampaign } from "@/data/campaign/visit/visitCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";

export default function VisitCampaignCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  /**
   * 캠페인 등록 처리
   *
   * 설명:
   * - 폼에서 입력받은 데이터를 visit.ts 구조로 변환합니다.
   * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
   * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
   *   localStorage를 사용하여 임시 저장합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 사용 (Data URL 형식)
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      let imageUrl =
        formData.thumbnailImageUrl || "/images/main/campaign_img/eximg_2.png"; // 업로드된 이미지 또는 기본 이미지

      // TODO: 실제 프로덕션에서는 이미지 업로드 API 호출
      // const imageUploadResponse = await uploadImages(formData.thumbnailImage, formData.detailImages);
      // imageUrl = imageUploadResponse.thumbnailUrl;

      // 폼 데이터를 CampaignWithApplicants 형태로 변환
      const newCampaign = addVisitCampaign(finalFormData, imageUrl);

      // TODO: 실제 프로덕션에서는 API 호출
      // await fetch('/api/campaigns', {
      //   method: 'POST',
      //   body: JSON.stringify(newCampaign),
      // });

      // 현재는 localStorage에 임시 저장 (실제 프로덕션에서는 API 사용)
      const storedCampaigns = localStorage.getItem("visitCampaigns");
      const campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];
      campaigns.push(newCampaign);
      localStorage.setItem("visitCampaigns", JSON.stringify(campaigns));

      console.log("방문형 캠페인 등록 완료:", newCampaign);

      // 등록 성공 시 캠페인 상태에 맞는 탭으로 이동
      const campaignStatus = newCampaign.campaignInfo.status;
      let redirectPath = "/partner/campaign_management"; // 기본: 전체 탭

      switch (campaignStatus) {
        case "대기 중":
          redirectPath = "/partner/campaign_management/scheduled"; // 예정 탭
          break;
        case "모집 중":
          redirectPath = "/partner/campaign_management/applied"; // 신청 탭
          break;
        case "진행 중":
          redirectPath = "/partner/campaign_management/progress"; // 진행 탭
          break;
        default:
          redirectPath = "/partner/campaign_management"; // 전체 탭
          break;
      }

      router.replace(redirectPath);
    } catch (error) {
      console.error("방문형 캠페인 등록 실패:", error);
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

        {/* 방문형 캠페인 등록 폼 */}
        <VisitCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
