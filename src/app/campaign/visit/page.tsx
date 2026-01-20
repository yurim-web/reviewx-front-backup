/* ========================================
   🚶 방문형 캠페인 목록 페이지
   ======================================== */

/**
 * 방문형 캠페인 목록 페이지
 *
 * 페이지 경로:
 * - /visit (기존 /user/visit에서 변경)
 *
 * 필터 종류:
 * - 카테고리(옵션O): 카테고리 필터 옵션 선택 가능
 * - 채널(옵션O): 채널 필터 옵션 선택 가능
 * - 지역(옵션O): 지역 필터 옵션 선택 가능
 * - 긴급(옵션X): 긴급 필터 옵션 선택 불가능
 *
 * 사용 파일:
 * - 컴포넌트: CampaignListPage
 * - 훅: useCampaignFilters
 * - 데이터: visitCampaigns, visitCategoryOptions, visitChannelOptions, useVisitRegionFilter, visitSortOptions
 * - CSS: delivery.module.css
 */

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CampaignListPage from "@/components/campaign/CampaignListPage";
import { useCampaignFilters } from "@/hooks/common/campaign/useCampaignFilters";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import {
  visitCategoryOptions,
  visitChannelOptions,
  useVisitRegionFilter,
  visitSortOptions,
} from "@/data/campaign/campaignFilterOptions";
import type { CampaignWithApplicants } from "@/types/domain/partner";
import type { VisitCampaignData } from "@/data/campaign/visit/visitCampaigns";

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
 * CampaignWithApplicants를 VisitCampaignData 형식으로 변환하는 함수
 */
function convertStoredToVisitCampaignData(
  campaign: CampaignWithApplicants & {
    description?: string;
    visitAddress?: string;
    addressGuide?: string;
    visitLink?: string;
    keywords?: string;
    guidelines?: string;
    region?: string; // 시/도 정보
    subRegion?: string; // 시/구/군 정보
    minTextLength?: string | number;
    minImageCount?: string | number;
    videoCount?: string | number;
    videoDuration?: string | number;
    requireLinkAttachment?: boolean;
    requireKeywordAttachment?: boolean;
    additionalPoints?: string | number;
    isUrgent?: boolean; // 긴급 캠페인 여부
  }
): VisitCampaignData {
  const info = campaign.campaignInfo;

  // 모집기간에서 시작일과 종료일 추출
  const recruitmentPeriod = info.recruitmentPeriod || "";
  const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
  const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
    .split(separator)
    .map((s) => s.trim());

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

  // 지역 정보 조합 (예: "강원 > 양양시")
  // region과 subRegion이 모두 있으면 " > "로 연결, 하나만 있으면 그대로 사용
  let regionDisplay = "";
  if (campaign.region && campaign.subRegion) {
    regionDisplay = `${campaign.region} > ${campaign.subRegion}`;
  } else if (campaign.region) {
    regionDisplay = campaign.region;
  } else if (campaign.subRegion) {
    regionDisplay = campaign.subRegion;
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
    } catch (error) {
      console.error("[generateSchedule] 날짜 포맷팅 실패:", error);
    }

    return "";
  };

  return {
    id: info.id,
    title: info.title,
    category: "방문형",
    image: info.image,
    subcategory: info.category || "기타",
    region: regionDisplay, // 지역 정보 조합 (예: "강원 > 양양시")
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
      purchasePeriod: info.registrationPeriod || "",
    },
    campaign_detail_image: info.image,
    channel: info.brandName || "",
    keyword: campaign.keywords || "",
    guidelineTexts,
    requirements: requirements.length > 0 ? requirements : [],
    visitAddress: campaign.visitAddress || "",
    addressGuide: campaign.addressGuide || "",
    visitLink: campaign.visitLink || "",
    isUrgent: (campaign as any).isUrgent === true, // 긴급 캠페인 여부
    registeredAt: (campaign as any).registeredAt || undefined, // 등록 시간
  };
}

/**
 * 정적 캠페인 데이터의 schedule과 dayCount를 자동으로 계산하는 함수
 *
 * 설명:
 * - 정적 데이터의 schedule과 dayCount를 detailedSchedule을 기반으로 자동 계산합니다.
 * - 오픈 예정일 때는 schedule을 생성하고, dayCount는 빈 문자열로 설정합니다.
 * - 진행 중일 때는 dayCount를 계산하고, schedule은 빈 문자열로 설정합니다.
 */
function enrichStaticVisitCampaigns(
  campaigns: VisitCampaignData[]
): VisitCampaignData[] {
  return campaigns.map((campaign) => {
    if (!campaign.detailedSchedule) {
      return campaign;
    }

    const { applicationStart, applicationEnd } = campaign.detailedSchedule;
    if (!applicationStart || !applicationEnd) {
      return campaign;
    }

    // schedule 자동 계산 함수
    const generateScheduleForStatic = (): string => {
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
      } catch (error) {
        console.error("[generateScheduleForStatic] 날짜 포맷팅 실패:", error);
      }

      return "";
    };

    const schedule = generateScheduleForStatic();

    // dayCount 자동 계산
    const calculateDayCount = (): string => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(applicationStart);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(applicationEnd);
      endDate.setHours(0, 0, 0, 0);

      // 오픈 예정: dayCount는 빈 문자열
      if (today < startDate) {
        return "";
      }

      // 마감 이후: "마감"
      if (today > endDate) {
        return "마감";
      }

      // 진행 중: 남은 일수 계산
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 남은 일수가 1일 이하 → "마감임박"
      if (diffDays <= 1) {
        return "마감임박";
      }

      // 남은 일수가 2일 이상 → "D-n" 형태
      return `D-${diffDays}`;
    };

    const dayCount = calculateDayCount();

    return {
      ...campaign,
      schedule,
      dayCount,
    };
  });
}

export default function VisitPage() {
  // localStorage에서 가져온 캠페인과 정적 데이터를 합친 배열
  // 정적 데이터의 schedule과 dayCount를 자동으로 계산
  const [allCampaigns, setAllCampaigns] = useState<VisitCampaignData[]>(
    enrichStaticVisitCampaigns(visitCampaigns)
  );

  // localStorage에서 데이터를 가져와서 정적 데이터와 합치기
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("visitCampaigns");
      if (!stored) {
        // 정적 데이터의 schedule과 dayCount를 자동으로 계산
        setAllCampaigns(enrichStaticVisitCampaigns(visitCampaigns));
        return;
      }

      const storedCampaigns: CampaignWithApplicants[] = JSON.parse(stored);
      if (!Array.isArray(storedCampaigns)) {
        // 정적 데이터의 schedule과 dayCount를 자동으로 계산
        setAllCampaigns(enrichStaticVisitCampaigns(visitCampaigns));
        return;
      }

      // localStorage의 캠페인을 VisitCampaignData 형식으로 변환
      const convertedCampaigns = storedCampaigns.map((campaign) =>
        convertStoredToVisitCampaignData(campaign)
      );

      // localStorage 내에서도 중복 ID 제거 (같은 ID가 있으면 마지막 것만 유지)
      const uniqueStoredCampaigns = new Map<string, VisitCampaignData>();
      convertedCampaigns.forEach((campaign) => {
        uniqueStoredCampaigns.set(campaign.id, campaign);
      });
      const deduplicatedStoredCampaigns = Array.from(
        uniqueStoredCampaigns.values()
      );

      // 정적 데이터와 합치기 (중복 제거: 같은 ID가 있으면 localStorage 데이터 우선)
      // 정적 데이터의 schedule과 dayCount를 자동으로 계산
      const enrichedStaticCampaigns =
        enrichStaticVisitCampaigns(visitCampaigns);
      const staticIds = new Set(enrichedStaticCampaigns.map((c) => c.id));
      const newCampaigns = deduplicatedStoredCampaigns.filter(
        (c) => !staticIds.has(c.id)
      );
      // localStorage에 있는 캠페인 중 정적 데이터에도 있는 것은 localStorage 버전으로 교체 (최신 데이터 우선)
      const updatedStaticCampaigns = enrichedStaticCampaigns.map(
        (staticCampaign) => {
          const localStorageCampaign = deduplicatedStoredCampaigns.find(
            (c) => c.id === staticCampaign.id
          );
          return localStorageCampaign || staticCampaign;
        }
      );
      const mergedCampaigns = [...updatedStaticCampaigns, ...newCampaigns];

      setAllCampaigns(mergedCampaigns);
    } catch (error) {
      console.error("localStorage에서 방문형 캠페인 불러오기 실패:", error);
      // 정적 데이터의 schedule과 dayCount를 자동으로 계산
      setAllCampaigns(enrichStaticVisitCampaigns(visitCampaigns));
    }
  }, []);

  // 공용 훅을 사용하여 필터 상태 관리 및 필터링/정렬 (지역 필터 활성화)
  const {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns,
  } = useCampaignFilters({
    campaigns: allCampaigns,
    enableRegionFilter: true, // 방문형은 지역 필터 사용
  });

  return (
    <CampaignListPage
      title="방문형"
      campaigns={filteredAndSortedCampaigns}
      basePath="/campaign/visit"
      filterBarProps={{
        onFilterChange: handleFilterChange,
        activeFilters,
        categoryOptions: visitCategoryOptions,
        channelOptions: visitChannelOptions,
        useRegionFilter: useVisitRegionFilter,
        sortOptions: visitSortOptions,
        closingSoon,
        onClosingSoonChange: setClosingSoon,
      }}
    />
  );
}
