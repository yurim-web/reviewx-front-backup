/* ========================================
   🧰 캠페인 필터 계산 헬퍼 함수
   ======================================== */

import { FilterableCampaign } from "../types";

/**
 * 채널 이름을 비교를 위해 정규화 (공백 제거)
 */
export const normalizeChannelName = (channel: string): string =>
  channel.replace(/\s+/g, "");

/**
 * "2025-11-01 ~ 2025-11-15" 형태에서 시작일을 Date로 파싱
 */
export const parseDate = (dateRange: string | undefined): Date => {
  if (!dateRange || dateRange.trim() === "") {
    return new Date(0);
  }

  const startDate = dateRange.split("~")[0]?.trim() || "";

  if (!startDate) {
    return new Date(0);
  }

  const parsedDate = new Date(startDate);
  return isNaN(parsedDate.getTime()) ? new Date(0) : parsedDate;
};

/**
 * 필터 상태 객체
 */
export interface CurrentFilters {
  types?: string[];
  channels?: string[];
  searchQuery?: string;
  sortBy?: string;
}

/**
 * 캠페인 식별 키 추출 (id > title)
 */
export const getItemKey = (item: FilterableCampaign): string => {
  if (typeof (item as any).id === "string") {
    return (item as any).id;
  }
  return item.title;
};

/**
 * 필터/정렬 로직을 적용하여 캠페인 목록 반환
 */
export const filterCampaigns = <T extends FilterableCampaign>(
  campaigns: T[],
  filters: CurrentFilters,
  selectedSort: string,
  defaultSort: string
): T[] => {
  const { types, channels, searchQuery } = filters;
  let filtered = [...campaigns];

  if (types && types.length > 0) {
    filtered = filtered.filter((campaign) => {
      const campaignType = (campaign as any).type || (campaign as any).campaignType;
      return campaignType && types.includes(campaignType);
    });
  }

  if (channels && channels.length > 0) {
    filtered = filtered.filter((campaign) => {
      const brandName =
        (campaign as any).brand ||
        (campaign as any).brandName ||
        (campaign as any).category;

      if (!brandName) return false;

      const normalizedBrandName = normalizeChannelName(brandName);
      return channels.some(
        (channel) => normalizeChannelName(channel) === normalizedBrandName
      );
    });
  }

  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((campaign) =>
      campaign.title.toLowerCase().includes(query)
    );
  }

  const sortBy = filters.sortBy || selectedSort || defaultSort;

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "최신순": {
        const periodA = (a as any).recruitmentPeriod;
        const periodB = (b as any).recruitmentPeriod;
        if (!periodA && !periodB) return 0;
        if (!periodA) return 1;
        if (!periodB) return -1;
        const dateA = parseDate(periodA);
        const dateB = parseDate(periodB);
        return dateB.getTime() - dateA.getTime();
      }
      case "인기순": {
        const countA = (a as any).recruitedCount ?? 0;
        const countB = (b as any).recruitedCount ?? 0;
        return countB - countA;
      }
      case "마감임박순": {
        const leftA = (a as any).daysLeft ?? (a as any).remainingDays ?? Infinity;
        const leftB = (b as any).daysLeft ?? (b as any).remainingDays ?? Infinity;
        if (leftA < 0 && leftB >= 0) return 1;
        if (leftA >= 0 && leftB < 0) return -1;
        return leftA - leftB;
      }
      default:
        return 0;
    }
  });
};


