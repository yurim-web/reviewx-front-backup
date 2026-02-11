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
import Loading from "@/app/loading";
import ReviewCampaignForm from "@/components/partner/campaign_create_form/ReviewCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import { updateReviewCampaign, reviewCampaignsExtended } from "@/data/campaign/review/reviewCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { ReviewCampaignDataExtended } from "@/data/campaign/review/reviewCampaigns";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import Toast from "@/components/common/toast/Toast";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import checkboxStyles from "@/styles/partner/campaign_create/campaign_guide/checkboxes.module.css";

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
  originalData?: ReviewCampaignDataExtended
): CampaignFormData {
  const info = campaign.campaignInfo;
  const extended = originalData;

  // 브랜드명을 플랫폼 이름으로 매핑
  const brandNameToPlatform: Record<string, string> = {
    "네이버블로그": "네이버 블로그",
    "네이버클립": "네이버 클립",
    "인스타그램": "인스타그램",
    "릴스": "릴스",
    "유튜브": "유튜브",
    "쇼츠": "쇼츠",
  };

  const platformName = extended?.channel || info.brandName
    ? brandNameToPlatform[extended?.channel || info.brandName || ""] || "네이버 블로그"
    : "네이버 블로그";

  // requirements 파싱
  const requirements = extended?.requirements || [];
  const parsedRequirements = parseRequirements(requirements);

  // contentType에 따른 참여/제출 옵션 설정 (구매평도 contentType 있음)
  const contentType = extended?.contentType;
  let requireContentLink = false;
  let requireContentImage = false;
  
  if (contentType === "link") {
    requireContentLink = true;
    requireContentImage = false;
  } else if (contentType === "image") {
    requireContentLink = false;
    requireContentImage = true;
  } else if (contentType === "both") {
    requireContentLink = true;
    requireContentImage = true;
  }

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

  // 상세 이미지 URL 배열 변환
  // campaign_detail_images 배열이 있으면 사용, 없으면 campaign_detail_image를 배열로 변환
  const detailImageUrls = (extended?.campaign_detail_images && extended.campaign_detail_images.length > 0)
    ? extended.campaign_detail_images
    : extended?.campaign_detail_image 
    ? [extended.campaign_detail_image]
    : [];

  return {
    campaignType: info.campaignType as "구매평",
    platform: (platformName as any) || "네이버 블로그",
    title: info.title || "",
    category: extended?.subcategory || info.category || "기타",
    brandName: extended?.brandName || extended?.channel || info.brandName || "",
    providedItems: extended?.description || "",
    promotionLink: extended?.purchaseLink || "",
    currentPoints: "58,000",
    purchasePoints: additionalPoints, // 구매평은 purchasePoints 사용
    additionalPoints: additionalPoints,
    recruitmentCount: String(info.totalCount || ""),
    recruitmentPeriod: recruitmentPeriod,
    purchasePeriod: extended?.detailedSchedule?.purchasePeriod || info.purchasePeriod || "",
    announcementDate: extended?.detailedSchedule?.announcement || info.announcementDate || "",
    registrationPeriod: extended?.detailedSchedule?.registrationPeriod || info.registrationPeriod || "",
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
    requireContentLink: requireContentLink,
    requireContentImage: requireContentImage,
    guidelines: guidelines,
    contactPhone: extended?.contactPhone || (campaign as { contactPhone?: string })?.contactPhone || "010-0000-0000",
    fairTradeAgreement: true,
    isUrgent: extended?.isUrgent || false,
    thumbnailImageUrl: extended?.image || info.image || "",
    detailImagePreviews: detailImageUrls, // 상세 이미지 URL 배열
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

      if (campaign.campaignInfo.campaignType !== "구매평") {
        setError("구매평 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      // 원본 확장 데이터 찾기
      const originalData = reviewCampaignsExtended.find(
        (c) => c.id === campaignId
      );

      // localStorage에서 저장된 캠페인 확인
      let storedOriginalData: ReviewCampaignDataExtended | undefined;
      if (typeof window !== "undefined") {
        const storedCampaigns = localStorage.getItem("reviewCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
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
      const openStatus = isCampaignOpen(campaign.campaignInfo.recruitmentPeriod);
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
          imageUrl = "/images/main/campaign_img/eximg_5.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateReviewCampaign(campaignId, finalFormData, imageUrl);

      // 원본 확장 데이터에서 상세 이미지 등 확장 필드 가져오기
      const originalData = reviewCampaignsExtended.find(
        (c) => c.id === campaignId
      );
      
      // 상세 이미지 URL 배열 변환
      const detailImageUrls = (formData.detailImagePreviews && formData.detailImagePreviews.length > 0)
        ? formData.detailImagePreviews
        : originalData?.campaign_detail_images && originalData.campaign_detail_images.length > 0
        ? originalData.campaign_detail_images
        : originalData?.campaign_detail_image
        ? [originalData.campaign_detail_image]
        : [];

      // contentType 결정
      let contentType: "link" | "image" | "both" | undefined = undefined;
      if (finalFormData.requireContentLink && finalFormData.requireContentImage) {
        contentType = "both";
      } else if (finalFormData.requireContentLink) {
        contentType = "link";
      } else if (finalFormData.requireContentImage) {
        contentType = "image";
      }

      const storedCampaigns = localStorage.getItem("reviewCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          const existingCampaign = campaigns[index];
          campaigns[index] = {
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData || existingCampaign.applicantData || {
              applicants: [],
              selectedApplicants: []
            },
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            contentType: contentType || originalData?.contentType,
            isUrgent: isUrgent,
            registeredAt: originalData?.registeredAt || existingCampaign.registeredAt,
            description: formData.providedItems || originalData?.description || "",
            purchaseLink: formData.promotionLink || originalData?.purchaseLink || "",
            keyword: formData.keywords || originalData?.keyword || "",
            subcategory: formData.category || originalData?.subcategory || "",
            channel: originalData?.channel || "",
            points: Number(String(formData.additionalPoints || "").replace(/,/g, "")) || originalData?.points || 0,
            adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
            allowReParticipation: formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
            allowLateSubmission: formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
            contactPhone: formData.contactPhone || originalData?.contactPhone || "",
            detailedSchedule: originalData?.detailedSchedule || {
              applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
              applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
              announcement: formData.announcementDate || "",
              purchasePeriod: formData.purchasePeriod || "",
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines ? formData.guidelines.split("\n\n") : (originalData?.guidelineTexts || []),
          } as any;
          localStorage.setItem("reviewCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push({
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData || {
              applicants: [],
              selectedApplicants: []
            },
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            contentType: contentType || originalData?.contentType,
            isUrgent: isUrgent,
            registeredAt: originalData?.registeredAt,
            description: formData.providedItems || originalData?.description || "",
            purchaseLink: formData.promotionLink || originalData?.purchaseLink || "",
            keyword: formData.keywords || originalData?.keyword || "",
            subcategory: formData.category || originalData?.subcategory || "",
            channel: originalData?.channel || "",
            points: Number(String(formData.additionalPoints || "").replace(/,/g, "")) || originalData?.points || 0,
            adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
            allowReParticipation: formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
            allowLateSubmission: formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
            contactPhone: formData.contactPhone || originalData?.contactPhone || "",
            detailedSchedule: originalData?.detailedSchedule || {
              applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
              applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
              announcement: formData.announcementDate || "",
              purchasePeriod: formData.purchasePeriod || "",
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines ? formData.guidelines.split("\n\n") : (originalData?.guidelineTexts || []),
          } as any);
          localStorage.setItem("reviewCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem("reviewCampaigns", JSON.stringify([{
          ...updatedCampaign,
          applicantData: updatedCampaign.applicantData || {
            applicants: [],
            selectedApplicants: []
          },
          campaign_detail_images: detailImageUrls,
          campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
          contentType: contentType || originalData?.contentType,
          isUrgent: isUrgent,
          registeredAt: originalData?.registeredAt,
          description: formData.providedItems || originalData?.description || "",
          purchaseLink: formData.promotionLink || originalData?.purchaseLink || "",
          keyword: formData.keywords || originalData?.keyword || "",
          subcategory: formData.category || originalData?.subcategory || "",
          channel: originalData?.channel || "",
          points: Number(formData.additionalPoints?.replace(/,/g, "")) || originalData?.points || 0,
          adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
          allowReParticipation: formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
          allowLateSubmission: formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
          contactPhone: formData.contactPhone || originalData?.contactPhone || "",
          detailedSchedule: originalData?.detailedSchedule || {
            applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
            applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
            announcement: formData.announcementDate || "",
            purchasePeriod: formData.purchasePeriod || "",
            registrationPeriod: formData.registrationPeriod || "",
          },
          requirements: originalData?.requirements || [],
          guidelineTexts: formData.guidelines ? formData.guidelines.split("\n\n") : (originalData?.guidelineTexts || []),
        } as any]));
      }

      // console.log("구매평 캠페인 수정 완료:", updatedCampaign);
      
      // 토스트 메시지 표시
      setToast({ is_open: true, message: "저장되었습니다." });
      
      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("구매평 캠페인 수정 실패:", error);
      alert("캠페인 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
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
      {/* 파트너 서브헤더 */}
      <PartnerSubHeader />

      {/* 페이지 헤더 - 타이틀과 긴급 체크박스 */}
      <div className={headerStyles.page_header}>
        {/* 뒤로가기 버튼 */}
        <button
          className={headerStyles.mobile_back_button}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <img
            src="/images/header/header_arrow_back.svg"
            alt="뒤로가기"
            width={16}
            height={16}
          />
        </button>

        <h1 className={headerStyles.page_title}>캠페인 수정</h1>

        {/* 긴급 체크박스 - 캠페인 오픈 후에는 선택/해제 불가 (긴급이면 체크된 상태 유지) */}
        <div className={headerStyles.header_urgent_checkbox}>
          <label
            className={`${checkboxStyles.checkbox_label} ${
              isUrgent ? headerStyles.urgent_checked : ""
            } ${isOpen ? headerStyles.urgent_checkbox_disabled : ""}`}
            style={!isOpen && isUrgent ? { color: "#ff2626" } : {}}
          >
            <span>긴급</span>
            <input
              type="checkbox"
              className={headerStyles.urgent_checkbox}
              checked={isUrgent}
              onChange={(e) => !isOpen && setIsUrgent(e.target.checked)}
              disabled={isOpen}
              aria-label="긴급"
            />
          </label>
        </div>
      </div>

      <div className={layoutStyles.main_content}>
        <ReviewCampaignForm
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

