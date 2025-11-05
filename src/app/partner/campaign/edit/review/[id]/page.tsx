/* ========================================
   🛒 구매평 캠페인 수정 페이지
   ======================================== */

/**
 * 구매평 캠페인 수정 페이지
 *
 * 목적: 파트너가 구매평 캠페인을 수정하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/edit/review/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ReviewCampaignForm from "@/components/partner/campaign_create_form/ReviewCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import { updateReviewCampaign } from "@/data/partner/review";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/PageHeader";

function campaignToFormData(campaign: CampaignWithApplicants): CampaignFormData {
  const info = campaign.campaignInfo;
  // 브랜드명을 플랫폼 이름으로 매핑
  const brandNameToPlatform: Record<string, string> = {
    "네이버블로그": "네이버 블로그",
    "네이버클립": "네이버 클립",
    "인스타그램": "인스타그램",
    "릴스": "릴스",
    "유튜브": "유튜브",
    "쇼츠": "쇼츠",
  };

  const platformName = info.brandName
    ? brandNameToPlatform[info.brandName] || "네이버 블로그"
    : "네이버 블로그";

  return {
    campaignType: info.campaignType as "구매평",
    platform: (platformName as any) || "네이버 블로그",
    title: info.title || "",
    category: info.category || "기타",
    brandName: info.brandName || "",
    providedItems: "",
    promotionLink: "",
    currentPoints: "",
    purchasePoints: "",
    additionalPoints: "",
    recruitmentCount: info.totalCount || "",
    recruitmentPeriod: info.recruitmentPeriod || "",
    purchasePeriod: info.purchasePeriod || "",
    announcementDate: info.announcementDate || "",
    registrationPeriod: info.registrationPeriod || "",
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
    guidelines: "",
    isUrgent: false,
  };
}

export default function ReviewCampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [initialData, setInitialData] = useState<CampaignFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const campaign = getCampaignById(campaignId);
      if (!campaign) {
        setError("캠페인을 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      if (campaign.campaignInfo.campaignType !== "구매평") {
        setError("구매평 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      const formData = campaignToFormData(campaign);
      setInitialData(formData);
      setIsLoading(false);
    } catch (err) {
      console.error("캠페인 로드 실패:", err);
      setError("캠페인을 불러오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, [campaignId]);

  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 우선 사용 (새로 업로드한 이미지)
      // 없으면 기존 이미지 URL 유지
      let imageUrl = formData.thumbnailImageUrl;

      // 새 이미지가 없으면 기존 이미지 URL 사용
      if (!imageUrl) {
        const existingCampaign = getCampaignById(campaignId);
        if (existingCampaign) {
          imageUrl = existingCampaign.campaignInfo.image;
        } else {
          imageUrl = "/images/main/campaign_img/eximg_5.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateReviewCampaign(campaignId, finalFormData, imageUrl);

      const storedCampaigns = localStorage.getItem("reviewCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("reviewCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(updatedCampaign);
          localStorage.setItem("reviewCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem("reviewCampaigns", JSON.stringify([updatedCampaign]));
      }

      console.log("구매평 캠페인 수정 완료:", updatedCampaign);
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("구매평 캠페인 수정 실패:", error);
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
      <div className={layoutStyles.main_content}>
        <PageHeader
          title="캠페인 수정"
          onUrgentChange={setIsUrgent}
          initialUrgent={isUrgent}
        />
        <ReviewCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          mode="edit"
        />
      </div>
    </div>
  );
}

