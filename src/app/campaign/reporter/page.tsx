/* ========================================
   기자단 캠페인 목록 페이지
   ======================================== */

/**
 * ReporterPage
 *
 * 목적: 기자단 캠페인 목록 표시 및 필터링
 *
 * 사용 페이지:
 * - /campaign/reporter (기자단 캠페인 목록)
 */

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
} from "@/data/campaign/campaignFilterOptions";
import type { CampaignWithApplicants } from "@/types/domain/partner";
import type { ReporterCampaignData } from "@/data/campaign/reporter/reporterCampaigns";

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
function convertStoredToReporterCampaignData(
  campaign: CampaignWithApplicants & {
    description?: string;
    productLink?: string;
    keywords?: string;
    guidelines?: string;
    minTextLength?: string | number;
    minImageCount?: string | number;
    videoCount?: string | number;
    videoDuration?: string | number;
    requireLinkAttachment?: boolean;
    requireKeywordAttachment?: boolean;
    additionalPoints?: string | number;
    isUrgent?: boolean; // 긴급 캠페인 여부
    registeredAt?: string; // 등록 시간
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
  const guidelineTexts = campaign.guidelines
    ? campaign.guidelines.split("\n\n").filter((text) => text.trim() !== "")
    : [];

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
    campaign_detail_image: info.image,
    channel: info.brandName || "",
    keyword: campaign.keywords || "",
    productLink: campaign.productLink || "",
    requirements: requirements.length > 0 ? requirements : [],
    guidelineTexts,
    isUrgent: campaign.isUrgent === true, // 긴급 캠페인 여부
    registeredAt: campaign.registeredAt || undefined, // 등록 시간
  };
}

export default function ReporterPage() {
  // localStorage에서 가져온 캠페인과 정적 데이터를 합친 배열
  const [allCampaigns, setAllCampaigns] = useState<ReporterCampaignData[]>(reporterCampaigns);

  // localStorage에서 데이터를 가져와서 정적 데이터와 합치기
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("reporterCampaigns");
      if (!stored) {
        setAllCampaigns(reporterCampaigns);
        return;
      }

      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (!Array.isArray(storedCampaigns)) {
        setAllCampaigns(reporterCampaigns);
        return;
      }

      // localStorage의 캠페인을 ReporterCampaignData 형식으로 변환
      const convertedCampaigns = storedCampaigns.map((campaign) =>
        convertStoredToReporterCampaignData(campaign)
      );

      // localStorage 내에서도 중복 ID 제거 (같은 ID가 있으면 마지막 것만 유지)
      const uniqueStoredCampaigns = new Map<string, ReporterCampaignData>();
      convertedCampaigns.forEach((campaign) => {
        uniqueStoredCampaigns.set(campaign.id, campaign);
      });
      const deduplicatedStoredCampaigns = Array.from(uniqueStoredCampaigns.values());

      // 정적 데이터와 합치기 (중복 제거: 같은 ID가 있으면 localStorage 데이터 우선)
      const staticIds = new Set(reporterCampaigns.map((c) => c.id));
      const newCampaigns = deduplicatedStoredCampaigns.filter((c) => !staticIds.has(c.id));
      // localStorage에 있는 캠페인 중 정적 데이터에도 있는 것은 localStorage 버전으로 교체 (최신 데이터 우선)
      const updatedStaticCampaigns = reporterCampaigns.map((staticCampaign) => {
        const localStorageCampaign = deduplicatedStoredCampaigns.find(
          (c) => c.id === staticCampaign.id
        );
        return localStorageCampaign || staticCampaign;
      });
      const mergedCampaigns = [...updatedStaticCampaigns, ...newCampaigns];

      setAllCampaigns(mergedCampaigns);
    } catch (_error) {
      setAllCampaigns(reporterCampaigns);
    }
  }, []);

  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: allCampaigns,
  });

  // schedule 필드 생성 함수
  const generateSchedule = (applicationStart: string): string => {
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
        const formattedDate = format(startDateTime, "M/d (E)", {
          locale: ko,
        });

        // "모집 오픈" 텍스트와 함께 반환
        return `${formattedDate}\n모집 오픈`;
      }
    } catch (_error) {}

    return "";
  };

  // 오픈예정 캠페인에 schedule 필드 추가
  const campaignsWithSchedule = filteredAndSortedCampaigns.map((campaign) => ({
    ...campaign,
    schedule: generateSchedule(campaign.detailedSchedule?.applicationStart || ""),
  }));

  return (
    <CampaignListPage
      title="기자단"
      campaigns={campaignsWithSchedule}
      basePath="/campaign/reporter"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: reporterCategoryOptions,
        channelOptions: reporterChannelOptions,
        sortOptions: reporterSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
        defaultSort: "최신순",
      }}
    />
  );
}
