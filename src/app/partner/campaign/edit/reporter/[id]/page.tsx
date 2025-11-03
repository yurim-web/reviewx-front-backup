/* ========================================
   📰 기자단 캠페인 수정 페이지
   ======================================== */

/**
 * 기자단 캠페인 수정 페이지
 *
 * 목적: 파트너가 기자단 캠페인을 수정하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/edit/reporter/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ReporterCampaignForm from "@/components/partner/campaign/campaign_create_form/ReporterCampaignForm";
import { CampaignFormData } from "@/types/campaign";
import { updateReporterCampaign } from "@/data/partner/reporter";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign/campaign_create_form/common/PageHeader";

function campaignToFormData(campaign: CampaignWithApplicants): CampaignFormData {
  const info = campaign.campaignInfo;
  const platformName = info.brandName
    ? info.brandName.replace(/([가-힣])([가-힣])/g, "$1 $2").trim()
    : "";

  return {
    campaignType: info.category as "기자단",
    platform: (platformName as any) || "인스타그램",
    title: info.title || "",
    category: info.category || "",
    brandName: info.brandName || "",
    providedItems: "",
    promotionLink: "",
    currentPoints: "",
    additionalPoints: "",
    recruitmentCount: info.totalCount || "",
    recruitmentPeriod: info.recruitmentPeriod || "",
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

export default function ReporterCampaignEditPage() {
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

      if (campaign.campaignInfo.category !== "기자단") {
        setError("기자단 캠페인이 아닙니다.");
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

      let imageUrl = "/images/main/campaign_img/eximg_8.png";
      const existingCampaign = getCampaignById(campaignId);
      if (existingCampaign) {
        imageUrl = existingCampaign.campaignInfo.image;
      }

      const updatedCampaign = updateReporterCampaign(campaignId, finalFormData, imageUrl);

      const storedCampaigns = localStorage.getItem("reporterCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(updatedCampaign);
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem("reporterCampaigns", JSON.stringify([updatedCampaign]));
      }

      console.log("기자단 캠페인 수정 완료:", updatedCampaign);
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("기자단 캠페인 수정 실패:", error);
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
        <ReporterCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          mode="edit"
        />
      </div>
    </div>
  );
}

