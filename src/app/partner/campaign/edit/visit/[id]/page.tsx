/* ========================================
   📍 방문형 캠페인 수정 페이지
   ======================================== */

/**
 * 방문형 캠페인 수정 페이지
 *
 * 목적: 파트너가 방문형 캠페인을 수정하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/edit/visit/[id]
 *
 * 주요 기능:
 * - 방문형 캠페인 기본 정보 수정
 * - 썸네일/상세 이미지 수정
 * - 방문형 캠페인 상세 정보 수정
 * - 참여/제출 옵션 수정
 * - 안내 사항 및 유의 사항 수정
 * - 방문형 캠페인 수정 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import VisitCampaignForm from "@/components/partner/campaign_create_form/VisitCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import { updateVisitCampaign } from "@/data/partner/visit";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/PageHeader";

/**
 * 캠페인 데이터를 폼 데이터로 변환
 */
function campaignToFormData(
  campaign: CampaignWithApplicants
): CampaignFormData {
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
    campaignType: info.campaignType as "방문형",
    platform: (platformName as any) || "네이버 블로그",
    title: info.title || "",
    category: info.category || "기타",
    region: "", // 현재 데이터에 없음
    brandName: info.brandName || "",
    providedItems: "", // 현재 데이터에 없음
    visitLink: "", // 현재 데이터에 없음
    visitAddress: "", // 현재 데이터에 없음
    addressDetail: "", // 현재 데이터에 없음
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

export default function VisitCampaignEditPage() {
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

      if (campaign.campaignInfo.campaignType !== "방문형") {
        setError("방문형 캠페인이 아닙니다.");
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
          imageUrl = "/images/main/campaign_img/eximg_2.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateVisitCampaign(
        campaignId,
        finalFormData,
        imageUrl
      );

      const storedCampaigns = localStorage.getItem("visitCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex(
          (c) => c.campaignInfo.id === campaignId
        );
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("visitCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(updatedCampaign);
          localStorage.setItem("visitCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem(
          "visitCampaigns",
          JSON.stringify([updatedCampaign])
        );
      }

      console.log("방문형 캠페인 수정 완료:", updatedCampaign);
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("방문형 캠페인 수정 실패:", error);
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
        <VisitCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          mode="edit"
        />
      </div>
    </div>
  );
}
