/* ========================================
   🎯 미션형 캠페인 수정 페이지
   ======================================== */

/**
 * 미션형 캠페인 수정 페이지
 *
 * 목적: 파트너가 미션형 캠페인을 수정하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/edit/mission/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MissionCampaignForm from "@/components/partner/campaign_create_form/MissionCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import { updateMissionCampaign } from "@/data/partner/mission";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import Toast from "@/components/common/toast/Toast";

function campaignToFormData(campaign: CampaignWithApplicants): CampaignFormData {
  const info = campaign.campaignInfo;

  return {
    campaignType: info.campaignType as "미션형",
    platform: "",
    title: info.title || "",
    category: info.category || "기타",
    brandName: info.brandName || "",
    providedItems: "",
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
    requireContentLink: false,
    requireContentImage: false,
    guidelines: "",
    isUrgent: false,
  };
}

export default function MissionCampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [initialData, setInitialData] = useState<CampaignFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    is_open: false,
    message: "",
  });

  useEffect(() => {
    try {
      const campaign = getCampaignById(campaignId);
      if (!campaign) {
        setError("캠페인을 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      if (campaign.campaignInfo.campaignType !== "미션형") {
        setError("미션형 캠페인이 아닙니다.");
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
          imageUrl = "/images/main/campaign_img/eximg_4.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateMissionCampaign(campaignId, finalFormData, imageUrl);

      const storedCampaigns = localStorage.getItem("missionCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("missionCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(updatedCampaign);
          localStorage.setItem("missionCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem("missionCampaigns", JSON.stringify([updatedCampaign]));
      }

      console.log("미션형 캠페인 수정 완료:", updatedCampaign);
      
      // 토스트 메시지 표시
      setToast({ is_open: true, message: "저장되었습니다." });
      
      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("미션형 캠페인 수정 실패:", error);
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
        <MissionCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          mode="edit"
        />
      </div>
      
      {/* 토스트 메시지 */}
      <Toast
        message={toast.message}
        isOpen={toast.is_open}
        onClose={() => setToast({ is_open: false, message: "" })}
      />
    </div>
  );
}

