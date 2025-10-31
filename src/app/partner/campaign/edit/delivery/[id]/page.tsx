/* ========================================
   📦 배송형 캠페인 수정 페이지
   ======================================== */

/**
 * 배송형 캠페인 수정 페이지
 *
 * 목적: 파트너가 배송형 캠페인을 수정하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/edit/delivery/[id]
 *
 * 주요 기능:
 * - 배송형 캠페인 기본 정보 수정
 * - 썸네일/상세 이미지 수정
 * - 배송형 캠페인 상세 정보 수정
 * - 참여/제출 옵션 수정
 * - 안내 사항 및 유의 사항 수정
 * - 배송형 캠페인 수정 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DeliveryCampaignForm from "@/components/partner/campaign/campaign_create_form/DeliveryCampaignForm";
import { CampaignFormData } from "@/types/campaign";
import { updateDeliveryCampaign } from "@/data/partner/delivery";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign/campaign_create_form/common/PageHeader";

/**
 * 캠페인 데이터를 폼 데이터로 변환
 * 
 * 설명:
 * - CampaignWithApplicants를 CampaignFormData로 변환합니다.
 * - 일부 필드는 현재 데이터 구조에 없으므로 기본값으로 설정합니다.
 * 
 * 📌 학습 포인트:
 * - 데이터 변환: 서버 데이터 구조를 폼 데이터 구조로 변환
 * - 기본값 처리: 없는 데이터는 빈 문자열이나 기본값으로 설정
 */
function campaignToFormData(campaign: CampaignWithApplicants): CampaignFormData {
  const info = campaign.campaignInfo;

  // 브랜드명을 플랫폼 형식으로 변환 (공백 추가)
  // 예: "네이버블로그" → "네이버 블로그"
  const platformName = info.brandName
    ? info.brandName.replace(/([가-힣])([가-힣])/g, "$1 $2").trim()
    : "";

  return {
    campaignType: info.category as "배송형",
    platform: (platformName as any) || "네이버 블로그",
    title: info.title || "",
    category: info.category || "",
    brandName: info.brandName || "",
    providedItems: "", // 현재 데이터에 없음
    promotionLink: "", // 현재 데이터에 없음
    currentPoints: "", // 현재 데이터에 없음
    additionalPoints: "", // 현재 데이터에 없음
    recruitmentCount: info.totalCount || "",
    recruitmentPeriod: info.recruitmentPeriod || "",
    announcementDate: info.announcementDate || "",
    registrationPeriod: info.registrationPeriod || "",
    keywords: "", // 현재 데이터에 없음
    adultOnly: false,
    allowReParticipation: false,
    allowLateSubmission: false,
    minTextLength: "",
    minImageCount: "",
    videoCount: "",
    videoDuration: "",
    requireLinkAttachment: false,
    requireKeywordAttachment: false,
    guidelines: "", // 현재 데이터에 없음
    isUrgent: false,
  };
}

export default function DeliveryCampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [initialData, setInitialData] = useState<CampaignFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캠페인 데이터 로드
  useEffect(() => {
    try {
      const campaign = getCampaignById(campaignId);
      if (!campaign) {
        setError("캠페인을 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      // 배송형 캠페인이 아닌 경우
      if (campaign.campaignInfo.category !== "배송형") {
        setError("배송형 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      // 캠페인 데이터를 폼 데이터로 변환
      const formData = campaignToFormData(campaign);
      setInitialData(formData);
      setIsLoading(false);
    } catch (err) {
      console.error("캠페인 로드 실패:", err);
      setError("캠페인을 불러오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, [campaignId]);

  /**
   * 캠페인 수정 처리
   *
   * 설명:
   * - 폼에서 입력받은 데이터를 delivery.ts 구조로 변환합니다.
   * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
   * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
   *   localStorage를 사용하여 임시 저장합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리 (실제로는 업로드 후 서버에서 URL을 받아야 함)
      // 현재는 기존 이미지 URL 유지 또는 업로드된 새 이미지 사용
      let imageUrl = "/images/main/campaign_img/eximg_1.png"; // 기본 이미지

      // 기존 캠페인 데이터 가져오기
      const existingCampaign = getCampaignById(campaignId);
      if (existingCampaign) {
        imageUrl = existingCampaign.campaignInfo.image;
      }

      // TODO: 실제 프로덕션에서는 이미지 업로드 API 호출
      // if (formData.thumbnailImage) {
      //   const imageUploadResponse = await uploadImages(formData.thumbnailImage, formData.detailImages);
      //   imageUrl = imageUploadResponse.thumbnailUrl;
      // }

      // 폼 데이터를 CampaignWithApplicants 형태로 변환하여 수정
      const updatedCampaign = updateDeliveryCampaign(campaignId, finalFormData, imageUrl);

      // TODO: 실제 프로덕션에서는 API 호출
      // await fetch(`/api/campaigns/${campaignId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updatedCampaign),
      // });

      // 현재는 localStorage에 임시 저장 (실제 프로덕션에서는 API 사용)
      const storedCampaigns = localStorage.getItem("deliveryCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("deliveryCampaigns", JSON.stringify(campaigns));
        } else {
          // localStorage에 없으면 추가
          campaigns.push(updatedCampaign);
          localStorage.setItem("deliveryCampaigns", JSON.stringify(campaigns));
        }
      } else {
        // localStorage에 없으면 새로 생성
        localStorage.setItem("deliveryCampaigns", JSON.stringify([updatedCampaign]));
      }

      console.log("배송형 캠페인 수정 완료:", updatedCampaign);

      // 수정 성공 시 캠페인 관리 페이지로 이동
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("배송형 캠페인 수정 실패:", error);
      alert("캠페인 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={layoutStyles.container}>
        <div className={layoutStyles.main_content}>
          <p>캠페인 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className={layoutStyles.container}>
        <div className={layoutStyles.main_content}>
          <p>{error || "캠페인 데이터를 불러올 수 없습니다."}</p>
          <button onClick={() => router.back()}>돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <PageHeader
          title="캠페인 수정"
          onUrgentChange={setIsUrgent}
          initialUrgent={isUrgent}
        />

        {/* 배송형 캠페인 수정 폼 */}
        <DeliveryCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
        />
      </div>
    </div>
  );
}

