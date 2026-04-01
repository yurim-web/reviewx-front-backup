/* ========================================
   🧰 캠페인 필터 계산 헬퍼 함수 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 캠페인 필터링 및 정렬 로직
 * - user와 partner 캠페인 모두 지원
 *
 * 📌 공통 유틸리티 위치:
 * - src/components/common/campaign_management/utils/campaign_filter_helpers.ts
 *   (user와 partner 캠페인 관리 페이지에서 공통으로 사용하는 유틸리티)
 */

import { FilterableCampaign } from "../types";

/** 필터링 헬퍼에서 사용하는 선택적 확장 필드 */
interface FilterableExtra {
  id?: string;
  type?: string;
  campaignType?: string;
  brand?: string;
  brandName?: string;
  category?: string;
  recruitmentPeriod?: string;
  daysLeft?: number;
  remainingDays?: number;
}

/**
 * 채널 이름을 비교를 위해 정규화 (공백 제거)
 */
export const normalizeChannelName = (channel: string): string => channel.replace(/\s+/g, "");

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
  const ext = item as FilterableExtra;
  if (typeof ext.id === "string") {
    return ext.id;
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
      const ext = campaign as FilterableExtra;
      const campaignType = ext.type || ext.campaignType;
      return campaignType && types.includes(campaignType);
    });
  }

  if (channels && channels.length > 0) {
    filtered = filtered.filter((campaign) => {
      const ext = campaign as FilterableExtra;
      const campaignType = ext.type || ext.campaignType;

      // 미션형/구매평은 채널 개념이 없으므로 채널 필터 시 제외
      if (campaignType === "미션형" || campaignType === "구매평") return false;

      const brandName = ext.brand || ext.brandName || ext.category;

      if (!brandName) return false;

      const normalizedBrandName = normalizeChannelName(brandName);
      return channels.some((channel) => normalizeChannelName(channel) === normalizedBrandName);
    });
  }

  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((campaign) => campaign.title.toLowerCase().includes(query));
  }

  const sortBy = filters.sortBy || selectedSort || defaultSort;

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "최신순": {
        const periodA = (a as FilterableExtra).recruitmentPeriod;
        const periodB = (b as FilterableExtra).recruitmentPeriod;
        if (!periodA && !periodB) return 0;
        if (!periodA) return 1;
        if (!periodB) return -1;
        const dateA = parseDate(periodA);
        const dateB = parseDate(periodB);
        const dateDiff = dateB.getTime() - dateA.getTime();
        if (dateDiff !== 0) return dateDiff;
        // 날짜가 같으면 id 내림차순 (최근 등록순)
        const idA = Number((a as FilterableExtra).id) || 0;
        const idB = Number((b as FilterableExtra).id) || 0;
        return idB - idA;
      }
      case "오래된순": {
        const periodA = (a as FilterableExtra).recruitmentPeriod;
        const periodB = (b as FilterableExtra).recruitmentPeriod;
        if (!periodA && !periodB) return 0;
        if (!periodA) return 1;
        if (!periodB) return -1;
        const dateA = parseDate(periodA);
        const dateB = parseDate(periodB);
        const dateDiff = dateA.getTime() - dateB.getTime();
        if (dateDiff !== 0) return dateDiff;
        // 날짜가 같으면 id 오름차순 (오래된 등록순)
        const idA = Number((a as FilterableExtra).id) || 0;
        const idB = Number((b as FilterableExtra).id) || 0;
        return idA - idB;
      }
      case "마감임박순": {
        const extA = a as FilterableExtra;
        const extB = b as FilterableExtra;
        const leftA = extA.daysLeft ?? extA.remainingDays ?? Infinity;
        const leftB = extB.daysLeft ?? extB.remainingDays ?? Infinity;
        if (leftA < 0 && leftB >= 0) return 1;
        if (leftA >= 0 && leftB < 0) return -1;
        return leftA - leftB;
      }
      default:
        return 0;
    }
  });
};
