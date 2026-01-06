/* ========================================
   ⭐ 구매평 캠페인 상세 페이지
   ======================================== */

/**
 * 구매평 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /review/[id] (기존 /user/review/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: reviewCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReview from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReview";
import Toast from "@/components/common/toast/Toast";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { ReviewCampaignData } from "@/data/campaign/review/reviewCampaigns";

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * CampaignWithApplicants를 ReviewCampaignData 형식으로 변환하는 함수
 *
 * 설명:
 * - localStorage에 저장된 CampaignWithApplicants 형식의 캠페인을
 *   상세페이지에서 사용하는 ReviewCampaignData 형식으로 변환합니다.
 * - 일부 필드는 기본값으로 설정됩니다.
 */
/**
 * formData에서 requirements 배열을 생성하는 함수
 */
function generateRequirementsFromFormData(formData?: {
  minTextLength?: string | number;
  minImageCount?: string | number;
  videoCount?: string | number;
  videoDuration?: string | number;
  requireLinkAttachment?: boolean;
  requireKeywordAttachment?: boolean;
}): string[] {
  if (!formData) return [];

  const requirements: string[] = [];

  if (formData.minTextLength) {
    requirements.push(`text_${formData.minTextLength}`);
  }
  if (formData.minImageCount) {
    requirements.push(`photo_${formData.minImageCount}`);
  }
  if (formData.videoCount && formData.videoDuration) {
    requirements.push(`video_${formData.videoCount}_${formData.videoDuration}`);
  } else if (formData.videoDuration) {
    requirements.push(`video_1_${formData.videoDuration}`);
  }
  if (formData.requireLinkAttachment) {
    requirements.push("product_link");
  }
  if (formData.requireKeywordAttachment) {
    requirements.push("keyword");
  }

  return requirements;
}

/**
 * CampaignWithApplicants를 ReviewCampaignData 형식으로 변환하는 함수
 *
 * 설명:
 * - localStorage에 저장된 CampaignWithApplicants 형식의 캠페인을
 *   상세페이지에서 사용하는 ReviewCampaignData 형식으로 변환합니다.
 * - 확장 데이터(purchasePeriod, purchaseLink 등)가 있으면 사용합니다.
 */
function convertToReviewCampaignData(
  campaign: CampaignWithApplicants & {
    purchasePeriod?: string;
    purchaseLink?: string;
    keywords?: string;
    description?: string;
    guidelines?: string;
    detailImagePreviews?: string[]; // 상세 이미지 미리보기 URL 배열
    minTextLength?: string | number;
    minImageCount?: string | number;
    videoCount?: string | number;
    videoDuration?: string | number;
    requireLinkAttachment?: boolean;
    requireKeywordAttachment?: boolean;
    additionalPoints?: string | number;
    isUrgent?: boolean; // 긴급 캠페인 여부
  }
): ReviewCampaignData {
  const info = campaign.campaignInfo;

  // 모집기간에서 시작일과 종료일 추출
  const recruitmentPeriod = info.recruitmentPeriod || "";
  const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
  const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
    .split(separator)
    .map((s) => s.trim());

  // 등록기간 추출
  const registrationPeriod = info.registrationPeriod || "";

  // guidelines를 배열로 변환 (줄바꿈 기준)
  // 줄바꿈(\n)을 <br>로 변환하여 HTML로 표시
  const guidelineTexts = campaign.guidelines
    ? campaign.guidelines
        .split("\n\n")
        .filter((text) => text.trim() !== "")
        .map((text) => text.replace(/\n/g, "<br>"))
    : [];

  // 상세 이미지 배열 결정: detailImagePreviews가 있으면 사용, 없으면 썸네일 이미지 사용
  const detailImages =
    campaign.detailImagePreviews && campaign.detailImagePreviews.length > 0
      ? campaign.detailImagePreviews
      : [info.image];

  // requirements 배열 생성
  const requirements = generateRequirementsFromFormData({
    minTextLength: campaign.minTextLength,
    minImageCount: campaign.minImageCount,
    videoCount: campaign.videoCount,
    videoDuration: campaign.videoDuration,
    requireLinkAttachment: campaign.requireLinkAttachment,
    requireKeywordAttachment: campaign.requireKeywordAttachment,
  });

  // points 계산
  let points = 0;
  if (campaign.additionalPoints) {
    const pointsStr = String(campaign.additionalPoints).replace(/,/g, "");
    points = parseInt(pointsStr, 10) || 0;
  }

  /**
   * schedule 필드 생성 함수
   *
   * 설명:
   * - 모집 시작일(applicationStart)을 "1/15 (목) 10:00\n모집 오픈" 형식으로 포맷팅합니다.
   * - 오픈 예정일 때만 사용되며, 오픈 예정이 아닌 경우 빈 문자열을 반환합니다.
   */
  const generateSchedule = (): string => {
    if (!applicationStart) {
      return "";
    }

    try {
      // 모집 시작일 파싱
      const startDate = new Date(applicationStart);

      // 오늘 날짜 (시간 정보 제거)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      // 오늘 < applicationStart → 오픈 예정일 때만 schedule 생성
      if (today < startDate) {
        // 모집 시작일 파싱
        const startDateTime = new Date(applicationStart);

        // 날짜를 "M/d (E)" 형식으로 포맷팅
        // M: 월 (1-12)
        // d: 일 (1-31)
        // E: 요일 약어 (월, 화, 수 등)
        const formattedDate = format(startDateTime, "M/d (E)", {
          locale: ko,
        });

        // "모집 오픈" 텍스트와 함께 반환
        return `${formattedDate}\n모집 오픈`;
      }
    } catch (error) {
      console.error("[generateSchedule] 날짜 포맷팅 실패:", error);
    }

    return "";
  };

  return {
    id: info.id,
    title: info.title,
    category: "구매평",
    image: info.image,
    subcategory: info.category || "기타",
    channel: info.brandName || "",
    points: points,
    description: campaign.description || "",
    recruitment: {
      current: info.recruitedCount || 0,
      total: info.totalCount || 0,
    },
    schedule: generateSchedule(), // 오픈 예정일 때 자동으로 생성
    dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
    detailedSchedule: {
      applicationStart,
      applicationEnd,
      announcement: info.announcementDate || "",
      purchasePeriod: campaign.purchasePeriod || "",
      registrationPeriod,
    },
    campaign_detail_image: detailImages[0] || info.image, // 첫 번째 상세 이미지 또는 썸네일 이미지
    campaign_detail_images: detailImages, // 여러 상세 이미지 배열
    keyword: campaign.keywords || "",
    purchaseLink: campaign.purchaseLink || "",
    requirements: requirements.length > 0 ? requirements : [],
    guidelineTexts,
    // 긴급 캠페인 여부 (localStorage에서 불러온 값 사용)
    isUrgent: campaign.isUrgent === true,
  };
}

export default function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<ReviewCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 정적 데이터와 localStorage 데이터 모두 확인
  useEffect(() => {
    setIsLoading(true);
    // 1. 정적 데이터에서 먼저 찾기
    const staticCampaign = reviewCampaigns.find((c) => {
      const campaignId = String(c.id);
      // 정확히 일치하는 경우
      if (campaignId === id) return true;
      // ID 형식 변환 시도
      if (id.startsWith("review_")) {
        if (campaignId === id) return true;
        const idWithoutPrefix = id.replace(/^review_/, "");
        if (campaignId === idWithoutPrefix) return true;
      }
      if (!id.startsWith("review_") && !campaignId.startsWith("review_")) {
        return campaignId === id;
      }
      if (campaignId.startsWith("review_") && !id.startsWith("review_")) {
        const campaignIdWithoutPrefix = campaignId.replace(/^review_/, "");
        return campaignIdWithoutPrefix === id;
      }
      return false;
    });
    if (staticCampaign) {
      setCampaign(staticCampaign);
      setIsLoading(false);
      return;
    }

    // 2. localStorage에서 찾기
    if (typeof window !== "undefined") {
      try {
        const storedCampaigns = localStorage.getItem("reviewCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] =
            JSON.parse(storedCampaigns);
          // URL의 ID가 "review_903" 형식이거나 "903" 형식일 수 있음
          // localStorage의 ID는 "review_13" 형식이므로 둘 다 확인
          const storedCampaign = campaigns.find((c) => {
            const campaignId = String(c.campaignInfo.id);
            // 정확히 일치하는 경우
            if (campaignId === id) return true;
            // ID 형식 변환 시도
            // URL이 "review_903" 형식이고 localStorage ID가 "903" 형식인 경우
            if (id.startsWith("review_")) {
              const idWithoutPrefix = id.replace(/^review_/, "");
              if (campaignId === idWithoutPrefix) return true;
              if (campaignId === id) return true;
            }
            // URL이 "903" 형식이고 localStorage ID도 "903" 형식인 경우
            if (
              !id.startsWith("review_") &&
              !campaignId.startsWith("review_")
            ) {
              return campaignId === id;
            }
            // localStorage ID가 "review_903" 형식이고 URL이 "903" 형식인 경우
            if (campaignId.startsWith("review_") && !id.startsWith("review_")) {
              const campaignIdWithoutPrefix = campaignId.replace(
                /^review_/,
                ""
              );
              return campaignIdWithoutPrefix === id;
            }
            return false;
          });
          if (storedCampaign) {
            // CampaignWithApplicants를 ReviewCampaignData로 변환
            const convertedCampaign =
              convertToReviewCampaignData(storedCampaign);
            setCampaign(convertedCampaign);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("localStorage에서 캠페인 불러오기 실패:", error);
      }
    }

    // 3. 찾지 못한 경우
    setCampaign(null);
    setIsLoading(false);
  }, [id]);

  // 로딩 중일 때는 아무것도 표시하지 않음 (또는 로딩 스피너 표시)
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로딩이 완료되었는데 캠페인이 없으면 404
  if (!campaign) return notFound();

  return (
    <>
      <CampaignDetailPage
        campaign={campaign}
        altText="review_tag"
        additionalSchedules={[
          {
            label: "구매 기간",
            value: campaign.detailedSchedule.purchasePeriod,
          },
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionReview
            description={campaign.description}
            purchaseLink={campaign.purchaseLink}
            keyword={campaign.keyword}
            onCopyPurchaseLink={async () => {
              if (campaign.purchaseLink) {
                await navigator.clipboard.writeText(campaign.purchaseLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            onCopyKeyword={async () => {
              await navigator.clipboard.writeText(campaign.keyword);
              setToastMessage("복사되었습니다.");
              setShowToast(true);
            }}
            requirements={campaign.requirements}
            guidelineTexts={campaign.guidelineTexts}
          />
        }
        renderApplicationModal={(isOpen, onClose, campaign) => (
          <ApplicationModal
            isOpen={isOpen}
            onClose={onClose}
            type="review"
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
          />
        )}
      />
      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </>
  );
}
