/* ========================================
   🧾 캠페인 필터 관련 타입 모음 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 캠페인 필터 바에서 사용하는 타입 정의
 * - user와 partner 캠페인 타입을 모두 지원
 *
 * 📌 공통 타입 위치:
 * - src/components/common/campaign_management/types.ts
 *   (user와 partner 캠페인 관리 페이지에서 공통으로 사용하는 타입)
 */

import type { PartnerCampaign } from '@/types/partner/partner';
import type { CampaignApplication } from '@/types/user/user';

/**
 * 필터 변경 시 부모에 전달되는 파라미터 타입
 */
export interface FilterChangeParams {
  types?: string[];
  channels?: string[];
  searchQuery?: string;
  sortBy?: string;
}

/**
 * 필터링 대상이 되는 캠페인 공통 타입
 */
export type FilterableCampaign =
  | PartnerCampaign
  | CampaignApplication
  | {
      title: string;
      type?: string;
      campaignType?: string;
      brandName?: string;
      brand?: string;
      category?: string;
      recruitmentPeriod?: string;
      recruitedCount?: number;
      daysLeft?: number;
      remainingDays?: number;
      id?: string;
    };

/**
 * CampaignFilterBar 컴포넌트 Props 타입
 */
export interface CampaignFilterBarProps<
  T extends FilterableCampaign = FilterableCampaign,
> {
  campaigns: T[];
  onFilterChange?: (filters: FilterChangeParams) => void;
  onFilteredCampaignsChange: (filteredCampaigns: T[]) => void;
  activeFilters?: {
    types?: string[];
    channels?: string[];
    searchQuery?: string;
  };
  typeOptions?: string[];
  channelOptions?: string[];
  sortOptions?: string[] | { value: string; label: string }[];
  defaultSort?: string;
}
