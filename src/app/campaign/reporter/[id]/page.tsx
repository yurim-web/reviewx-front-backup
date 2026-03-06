/* ========================================
   기자단 캠페인 상세 페이지
   ======================================== */

/**
 * ReporterDetailPage
 *
 * 목적: 기자단 캠페인 상세 정보 표시
 *
 * 사용 페이지:
 * - /campaign/reporter/[id] (기자단 캠페인 상세)
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReporter from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReporter";
import Toast from "@/components/common/toast/Toast";
import { reporterCampaignsExtended } from "@/data/campaign/reporter/reporterCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { ReporterCampaignData } from "@/data/campaign/reporter/reporterCampaigns";
import { useCampaignDetail } from "@/hooks/user/campaign/useCampaignDetail";
import type { CampaignDetailAdapted } from "@/hooks/user/campaign/useCampaignDetail";

interface ReporterDetailPageProps {
  params: Promise<{ id: string }>;
}

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
 * CampaignWithApplicants를 ReporterCampaignData 형식으로 변환하는 함수
 */
function convertToReporterCampaignData(
  campaign: CampaignWithApplicants & {
    description?: string;
    productLink?: string;
    keywords?: string;
    guidelines?: string;
    detailImagePreviews?: string[]; // 상세 이미지 미리보기 URL 배열
    campaign_detail_images?: string[]; // localStorage에 저장된 상세 이미지 배열
    campaign_detail_image?: string; // localStorage에 저장된 단일 상세 이미지
    guidelineTexts?: string[]; // localStorage에 저장된 가이드라인 텍스트 배열
    minTextLength?: string | number;
    minImageCount?: string | number;
    videoCount?: string | number;
    videoDuration?: string | number;
    requireLinkAttachment?: boolean;
    requireKeywordAttachment?: boolean;
    additionalPoints?: string | number;
    points?: string | number; // localStorage에 저장된 포인트
    isUrgent?: boolean; // 긴급 캠페인 여부
  }
): ReporterCampaignData {
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
  // localStorage에 guidelineTexts 배열이 있으면 우선 사용
  const guidelineTexts =
    campaign.guidelineTexts && Array.isArray(campaign.guidelineTexts)
      ? campaign.guidelineTexts.map((text: string) =>
          typeof text === "string" ? text.replace(/\n/g, "<br>") : text
        )
      : campaign.guidelines
        ? campaign.guidelines
            .split("\n\n")
            .filter((text) => text.trim() !== "")
            .map((text) => text.replace(/\n/g, "<br>"))
        : [];

  // 상세 이미지 배열 결정:
  // 1. campaign_detail_images가 있으면 사용 (localStorage 데이터)
  // 2. detailImagePreviews가 있으면 사용 (폼 데이터)
  // 3. campaign_detail_image가 있으면 단일 이미지로 배열 생성
  // 4. 없으면 썸네일 이미지 사용
  const detailImages =
    campaign.campaign_detail_images &&
    Array.isArray(campaign.campaign_detail_images) &&
    campaign.campaign_detail_images.length > 0
      ? campaign.campaign_detail_images
      : campaign.detailImagePreviews && campaign.detailImagePreviews.length > 0
        ? campaign.detailImagePreviews
        : campaign.campaign_detail_image
          ? [campaign.campaign_detail_image]
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
  // 1. localStorage에 저장된 points 필드 확인
  // 2. additionalPoints 필드 확인
  let points = 0;
  if (campaign.points !== undefined && campaign.points !== null) {
    points = Number(campaign.points) || 0;
  } else if (campaign.additionalPoints) {
    const pointsStr = String(campaign.additionalPoints).replace(/,/g, "");
    points = parseInt(pointsStr, 10) || 0;
  }

  /**
   * schedule 필드 생성 함수
   *
   * 설명:
   * - 모집 시작일(applicationStart)을 "1/15 (목) 10:00\n모집 오픈" 형식으로 포맷팅합니다.
   * - 오픈 예정일 때만 사용되며, 오픈 예정이 아닌 경우 빈 문자열을 반환합니다.
   *
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
    } catch (_error) {}

    return "";
  };

  return {
    id: info.id,
    title: info.title,
    category: "기자단",
    image: info.image,
    subcategory: info.category || "기타",
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
      registrationPeriod,
    },
    campaign_detail_image: detailImages[0] || info.image, // 첫 번째 상세 이미지 또는 썸네일 이미지
    campaign_detail_images: detailImages, // 여러 상세 이미지 배열
    channel: info.brandName || "",
    keyword: campaign.keywords || "",
    productLink: campaign.productLink || "",
    requirements: requirements.length > 0 ? requirements : [],
    guidelineTexts,
    // 긴급 캠페인 여부 (localStorage에서 불러온 값 사용)
    isUrgent: campaign.isUrgent === true,
  };
}

function adaptApiToReporter(api: CampaignDetailAdapted): ReporterCampaignData {
  return {
    id: api.id,
    title: api.title,
    category: "기자단",
    image: api.image,
    subcategory: api.subcategory,
    points: api.points,
    description: api.description,
    recruitment: api.recruitment,
    schedule: api.schedule,
    dayCount: api.dayCount,
    detailedSchedule: {
      applicationStart: api.detailedSchedule.applicationStart,
      applicationEnd: api.detailedSchedule.applicationEnd,
      announcement: api.detailedSchedule.announcement,
      registrationPeriod: api.detailedSchedule.registrationPeriod,
    },
    campaign_detail_image: api.image,
    campaign_detail_images: [api.image],
    channel: api.channel,
    keyword: api.keyword,
    requirements: api.requirements,
    guidelineTexts: api.guidelineTexts,
    isUrgent: api.isUrgent,
  };
}

export default function ReporterDetailPage({ params }: ReporterDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<ReporterCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: apiCampaign, isLoading: isApiLoading } = useCampaignDetail(id);

  useEffect(() => {
    if (isApiLoading) return;

    if (apiCampaign) {
      setCampaign(adaptApiToReporter(apiCampaign));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // 1. 정적 목업 데이터에서 먼저 찾기
    const normalizedUrlId = id.startsWith("reporter_") ? id.replace(/^reporter_/, "") : id;

    const staticCampaign = reporterCampaignsExtended.find((c) => {
      const campaignId = String(c.id);
      const normalizedCampaignId = campaignId.startsWith("reporter_")
        ? campaignId.replace(/^reporter_/, "")
        : campaignId;
      return normalizedCampaignId === normalizedUrlId;
    });

    if (staticCampaign) {
      // staticCampaign은 이미 ReporterCampaignData 형식
      const finalCampaign: ReporterCampaignData = {
        ...staticCampaign,
        guidelineTexts: staticCampaign.guidelineTexts || [],
      };
      setCampaign(finalCampaign);
      setIsLoading(false);
      return;
    }

    // 2. 목업 데이터에 없으면 localStorage에서 찾기 (사용자가 새로 만든 캠페인)
    if (typeof window !== "undefined") {
      try {
        const storedCampaigns = localStorage.getItem("reporterCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
          const storedCampaign = campaigns.find((c) => {
            const campaignId = String(c.campaignInfo.id);
            const normalizedCampaignId = campaignId.startsWith("reporter_")
              ? campaignId.replace(/^reporter_/, "")
              : campaignId;
            return normalizedCampaignId === normalizedUrlId;
          });
          if (storedCampaign) {
            const convertedCampaign = convertToReporterCampaignData(storedCampaign);
            setCampaign(convertedCampaign);
            setIsLoading(false);
            return;
          }
        }
      } catch (_error) {}
    }

    // 3. 목업과 localStorage 모두에서 찾지 못한 경우
    setCampaign(null);
    setIsLoading(false);
  }, [id, apiCampaign, isApiLoading]);

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
        altText="reporter_tag"
        additionalSchedules={[
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionReporter
            description={campaign.description}
            productLink={campaign.productLink}
            onCopyProductLink={async () => {
              if (campaign.productLink) {
                await navigator.clipboard.writeText(campaign.productLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            keyword={campaign.keyword}
            onCopyKeyword={async () => {
              await navigator.clipboard.writeText(campaign.keyword);
              setToastMessage("복사되었습니다.");
              setShowToast(true);
            }}
            requirements={campaign.requirements}
            guidelineTexts={campaign.guidelineTexts || []}
          />
        }
        renderApplicationModal={(isOpen, onClose, campaign) => (
          <ApplicationModal
            isOpen={isOpen}
            onClose={onClose}
            type="reporter"
            campaignId={campaign.id}
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
            channelName={campaign.channel}
            channelUrl={undefined}
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
