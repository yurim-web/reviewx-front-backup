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
import ReporterCampaignForm from "@/components/partner/campaign_create_form/ReporterCampaignForm";
import { CampaignFormData } from "@/types/user/user";
import {
  updateReporterCampaign,
  reporterCampaignsExtended,
} from "@/data/campaign/reporter/reporterCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { ReporterCampaignDataExtended } from "@/data/campaign/reporter/reporterCampaigns";
import layoutStyles from "../../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import Toast from "@/components/common/toast/Toast";

/**
 * requirements 배열을 파싱하여 폼 데이터로 변환하는 함수
 */
function parseRequirements(requirements: string[]): {
  minTextLength: string;
  minImageCount: string;
  videoCount: string;
  videoDuration: string;
  requireLinkAttachment: boolean;
  requireKeywordAttachment: boolean;
} {
  let minTextLength = "";
  let minImageCount = "";
  let videoCount = "";
  let videoDuration = "";
  let requireLinkAttachment = false;
  let requireKeywordAttachment = false;

  requirements.forEach((req) => {
    if (req.startsWith("text_")) {
      const charCount = req.replace("text_", "");
      minTextLength = charCount;
    } else if (req.startsWith("photo_")) {
      const photoCount = req.replace("photo_", "");
      minImageCount = photoCount;
    } else if (req.startsWith("video_")) {
      const parts = req.replace("video_", "").split("_");
      if (parts.length === 2) {
        videoCount = parts[0];
        videoDuration = parts[1];
      } else if (parts.length === 1) {
        videoCount = "1";
        videoDuration = parts[0];
      }
    } else if (req === "product_link") {
      requireLinkAttachment = true;
    } else if (req === "keyword") {
      requireKeywordAttachment = true;
    }
  });

  return {
    minTextLength,
    minImageCount,
    videoCount,
    videoDuration,
    requireLinkAttachment,
    requireKeywordAttachment,
  };
}

function campaignToFormData(
  campaign: CampaignWithApplicants,
  originalData?: ReporterCampaignDataExtended
): CampaignFormData {
  const info = campaign.campaignInfo;
  const extended = originalData;

  // 브랜드명을 플랫폼 이름으로 매핑
  const brandNameToPlatform: Record<string, string> = {
    네이버블로그: "네이버 블로그",
    네이버클립: "네이버 클립",
    인스타그램: "인스타그램",
    릴스: "릴스",
    유튜브: "유튜브",
    쇼츠: "쇼츠",
  };

  const platformName =
    extended?.channel || info.brandName
      ? brandNameToPlatform[extended?.channel || info.brandName || ""] ||
        "인스타그램"
      : "인스타그램";

  // requirements 파싱
  const requirements = extended?.requirements || [];
  const parsedRequirements = parseRequirements(requirements);

  // guidelineTexts 배열을 하나의 문자열로 합치기
  const guidelines = extended?.guidelineTexts?.join("\n\n") || "";

  // 모집기간 형식 변환
  const recruitmentPeriod = extended?.detailedSchedule
    ? `${extended.detailedSchedule.applicationStart} ~ ${extended.detailedSchedule.applicationEnd}`
    : info.recruitmentPeriod || "";

  // 포인트를 콤마 형식으로 변환
  const additionalPoints = extended?.points
    ? extended.points.toLocaleString("ko-KR")
    : "";

  return {
    campaignType: info.campaignType as "기자단",
    platform: (platformName as any) || "인스타그램",
    title: info.title || "",
    category: extended?.subcategory || info.category || "기타",
    brandName: extended?.brandName || extended?.channel || info.brandName || "",
    providedItems: extended?.description || "",
    promotionLink: extended?.productLink || "",
    currentPoints: "58,000",
    additionalPoints: additionalPoints,
    recruitmentCount: String(info.totalCount || ""),
    recruitmentPeriod: recruitmentPeriod,
    announcementDate:
      extended?.detailedSchedule?.announcement || info.announcementDate || "",
    registrationPeriod:
      extended?.detailedSchedule?.registrationPeriod ||
      info.registrationPeriod ||
      "",
    keywords: extended?.keyword || "",
    adultOnly: extended?.adultOnly || false,
    allowReParticipation: extended?.allowReParticipation || false,
    allowLateSubmission: extended?.allowLateSubmission || false,
    minTextLength: parsedRequirements.minTextLength,
    minImageCount: parsedRequirements.minImageCount,
    videoCount: parsedRequirements.videoCount,
    videoDuration: parsedRequirements.videoDuration,
    requireLinkAttachment: parsedRequirements.requireLinkAttachment,
    requireKeywordAttachment: parsedRequirements.requireKeywordAttachment,
    guidelines: guidelines,
    contactPhone: extended?.contactPhone || "",
    fairTradeAgreement: true,
    isUrgent: extended?.isUrgent || false,
    thumbnailImageUrl: extended?.image || info.image || "",
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

  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    is_open: false,
    message: "",
  });

  /**
   * 캠페인 오픈 여부 확인
   */
  const isCampaignOpen = (recruitmentPeriod: string): boolean => {
    if (!recruitmentPeriod) return false;

    try {
      const parts = recruitmentPeriod.split("~").map((s) => s.trim());
      if (parts.length < 1) return false;

      const startDateStr = parts[0].split(" ")[0];
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return startDate <= today;
    } catch (error) {
      console.error("캠페인 오픈 여부 확인 실패:", error);
      return false;
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const campaign = getCampaignById(campaignId);
      if (!campaign) {
        setError("캠페인을 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      if (campaign.campaignInfo.campaignType !== "기자단") {
        setError("기자단 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      // 원본 확장 데이터 찾기
      const originalData = reporterCampaignsExtended.find(
        (c) => c.id === campaignId
      );

      // localStorage에서 저장된 캠페인 확인
      let storedOriginalData: ReporterCampaignDataExtended | undefined;
      if (typeof window !== "undefined") {
        const storedCampaigns = localStorage.getItem("reporterCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] =
            JSON.parse(storedCampaigns);
          const storedCampaign = campaigns.find(
            (c) => c.campaignInfo.id === campaignId
          );
          if (storedCampaign) {
            storedOriginalData = originalData;
          }
        }
      }

      const dataToUse = storedOriginalData || originalData;

      const formData = campaignToFormData(campaign, dataToUse);
      setInitialData(formData);

      // isUrgent 상태 설정
      setIsUrgent(dataToUse?.isUrgent || false);

      // 캠페인 오픈 여부 확인
      const openStatus = isCampaignOpen(
        campaign.campaignInfo.recruitmentPeriod
      );
      setIsOpen(openStatus);

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
          imageUrl = "/images/main/campaign_img/eximg_8.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateReporterCampaign(
        campaignId,
        finalFormData,
        imageUrl
      );

      const storedCampaigns = localStorage.getItem("reporterCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex(
          (c) => c.campaignInfo.id === campaignId
        );
        if (index !== -1) {
          campaigns[index] = updatedCampaign;
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(updatedCampaign);
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem(
          "reporterCampaigns",
          JSON.stringify([updatedCampaign])
        );
      }

      console.log("기자단 캠페인 수정 완료:", updatedCampaign);

      // 토스트 메시지 표시
      setToast({ is_open: true, message: "저장되었습니다." });

      // 페이지 새로고침
      router.refresh();
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
          isOpen={isOpen}
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
