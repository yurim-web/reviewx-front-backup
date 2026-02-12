/**
 * 캠페인 필터 관련 타입 정의
 *
 * user와 partner 캠페인 관리 페이지에서 공통으로 사용하는 타입
 *
 * 사용처:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 * - src/components/common/campaign_management/utils/campaign_filter_helpers.ts
 */

import type { PartnerCampaign } from "@/types/domain/partner";
import type { CampaignApplication } from "@/types/domain/user";

/**
 * 필터 변경 시 전달되는 파라미터
 *
 * 사용처:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 */
export interface FilterChangeParams {
  types?: string[];
  channels?: string[];
  searchQuery?: string;
  sortBy?: string;
}

/**
 * 활성화된 필터 상태
 *
 * 사용처:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 */
export interface ActiveFilters {
  types?: string[];
  channels?: string[];
  searchQuery?: string;
  sortBy?: string;
}

/**
 * 정렬 옵션 타입
 *
 * 사용처:
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 */
export type SortOption = string | { value: string; label: string };

/**
 * 필터링 가능한 캠페인 타입
 * PartnerCampaign, CampaignApplication 또는 최소 필수 필드를 가진 객체
 *
 * 사용처:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 * - src/components/common/campaign_management/utils/campaign_filter_helpers.ts
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
 * CampaignFilterBar 컴포넌트 Props
 *
 * 사용처:
 * - src/hooks/common/campaign_management/useCampaignFilterBar.ts
 * - src/components/common/campaign_management/CampaignFilterBar.tsx
 */
export interface CampaignFilterBarProps<
  T extends FilterableCampaign = FilterableCampaign
> {
  campaigns: T[];
  onFilterChange?: (filters: FilterChangeParams) => void;
  onFilteredCampaignsChange: (filteredCampaigns: T[]) => void;
  activeFilters?: ActiveFilters;
  typeOptions?: string[];
  channelOptions?: string[];
  sortOptions?: SortOption[];
  defaultSort?: string;
  showSearch?: boolean;
  isPartner?: boolean;
}
