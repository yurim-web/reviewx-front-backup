/**
 * 캠페인 필터링 및 정렬 공용 훅
 *
 * 사용 파일:
 * - src/app/campaign/delivery/page.tsx
 * - src/app/campaign/mission/page.tsx
 * - src/app/campaign/reporter/page.tsx
 * - src/app/campaign/review/page.tsx
 * - src/app/campaign/visit/page.tsx
 *
 * 주요 기능:
 * - 필터 상태 관리 (카테고리, 채널, 지역, 정렬, 마감임박)
 * - 필터 변경 핸들러
 * - 필터링 및 정렬된 캠페인 목록 반환
 */

import { useState, useMemo } from "react";

/* ========================================
   타입 정의
   ======================================== */

/**
 * 캠페인 기본 타입 (모든 캠페인 타입이 공통으로 가지는 필드)
 */
interface BaseCampaign {
  id: string;
  title: string;
  category: string;
  categoryIcon?: string;
  image: string;
  subcategory: string;
  channel: string;
  dayCount: string;
  recruitment: {
    current: number;
    total: number;
  };
  points: number;
  schedule?: string;
  region?: string; // 방문형 캠페인에만 있음
  [key: string]: any; // 추가 필드 허용
}

/**
 * 필터 상태 타입
 * - channels: 선택된 채널 목록
 * - categories: 선택된 카테고리 목록
 * - regions: 선택된 지역 목록 (방문형만 사용)
 * - sort: 정렬 기준
 */
interface FilterState {
  channels: string[];
  categories: string[];
  regions?: string[]; // 방문형 캠페인에만 사용
  sort: string;
}

/**
 * 훅 파라미터 타입
 * - campaigns: 필터링할 캠페인 데이터 배열
 * - enableRegionFilter: 지역 필터 사용 여부 (방문형만 true)
 */
interface UseCampaignFiltersParams<T extends BaseCampaign> {
  campaigns: T[]; // 캠페인 데이터 배열
  enableRegionFilter?: boolean; // 지역 필터 사용 여부 (방문형만 true)
}

/**
 * 훅 반환 타입
 * - activeFilters: 현재 활성화된 필터 상태
 * - closingSoon: 마감임박 필터 활성화 여부
 * - handleFilterChange: 필터 변경 핸들러 함수
 * - setClosingSoon: 마감임박 필터 변경 함수
 * - filteredAndSortedCampaigns: 필터링 및 정렬된 캠페인 목록
 */
interface UseCampaignFiltersReturn {
  // 필터 상태
  activeFilters: FilterState;
  closingSoon: boolean;
  // 필터 변경 핸들러
  handleFilterChange: (filters: {
    category?: string;
    channel?: string;
    region?: string;
    closingSoon?: boolean;
    sortBy?: string;
  }) => void;
  // 마감임박 필터 변경 핸들러
  setClosingSoon: (closingSoon: boolean) => void;
  // 필터링 및 정렬된 캠페인 목록
  filteredAndSortedCampaigns: BaseCampaign[];
}

/* ========================================
   메인 훅 함수
   ======================================== */

/**
 * 캠페인 필터링 및 정렬 공용 훅
 *
 * @param campaigns - 필터링할 캠페인 데이터 배열
 * @param enableRegionFilter - 지역 필터 사용 여부 (기본값: false)
 * @returns 필터 상태, 핸들러, 필터링된 캠페인 목록
 */
export function useCampaignFilters<T extends BaseCampaign>({
  campaigns,
  enableRegionFilter = false,
}: UseCampaignFiltersParams<T>): UseCampaignFiltersReturn {
  /* ========================================
     상태 관리
     ======================================== */

  /**
   * 필터 상태 관리
   * - channels: 선택된 채널 목록
   * - categories: 선택된 카테고리 목록
   * - regions: 선택된 지역 목록 (방문형만)
   * - sort: 정렬 기준 (기본값: "최신순")
   */
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    channels: [],
    categories: [],
    ...(enableRegionFilter && { regions: [] }),
    sort: "최신순",
  });

  /**
   * 마감임박 필터 상태
   * - true: 마감임박인 캠페인만 표시
   * - false: 모든 캠페인 표시
   */
  const [closingSoon, setClosingSoon] = useState<boolean>(false);

  /* ========================================
     필터 변경 핸들러
     ======================================== */

  /**
   * 필터 변경 핸들러
   * FilterBar 컴포넌트에서 전달받은 필터 변경사항을 처리합니다.
   *
   * @param filters - 변경된 필터 정보
   *   - category: 카테고리 필터 (쉼표로 구분된 문자열)
   *   - channel: 채널 필터 (쉼표로 구분된 문자열)
   *   - region: 지역 필터 (쉼표로 구분된 문자열, 방문형만)
   *   - closingSoon: 마감임박 필터 활성화 여부
   *   - sortBy: 정렬 기준
   */
  const handleFilterChange = (filters: {
    category?: string;
    channel?: string;
    region?: string;
    closingSoon?: boolean;
    sortBy?: string;
  }) => {
    // 마감임박 필터 처리
    if (filters.closingSoon !== undefined) {
      setClosingSoon(filters.closingSoon);
    }

    // 필터 상태 업데이트
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      // 카테고리 필터 업데이트
      // 쉼표로 구분된 문자열을 배열로 변환하고 빈 문자열 제거
      if (filters.category !== undefined) {
        newFilters.categories = filters.category
          ? filters.category.split(",").filter((c: string) => c.trim())
          : [];
      }

      // 채널 필터 업데이트
      // 쉼표로 구분된 문자열을 배열로 변환하고 빈 문자열 제거
      if (filters.channel !== undefined) {
        newFilters.channels = filters.channel
          ? filters.channel.split(",").filter((c: string) => c.trim())
          : [];
      }

      // 지역 필터 업데이트 (방문형만)
      // 쉼표로 구분된 문자열을 배열로 변환하고 빈 문자열 제거
      if (enableRegionFilter && filters.region !== undefined) {
        newFilters.regions = filters.region
          ? filters.region.split(",").filter((r: string) => r.trim())
          : [];
      }

      // 정렬 옵션 업데이트
      if (filters.sortBy !== undefined) {
        newFilters.sort = filters.sortBy || "최신순";
      }

      return newFilters;
    });
  };

  /* ========================================
     필터링 및 정렬 로직
     ======================================== */

  /**
   * 필터링 및 정렬된 캠페인 목록
   * useMemo를 사용하여 성능 최적화
   * - campaigns, activeFilters, closingSoon, enableRegionFilter가 변경될 때만 재계산
   *
   * 필터링 순서:
   * 1. 마감임박 필터 적용
   * 2. 카테고리 필터 적용
   * 3. 채널 필터 적용
   * 4. 지역 필터 적용 (방문형만)
   * 5. 정렬 적용
   */
  const filteredAndSortedCampaigns = useMemo(() => {
    // 1단계: 캠페인 데이터 복사
    let filtered = [...campaigns];

    // 2단계: 마감임박 필터 적용
    // dayCount가 "마감임박"인 캠페인만 필터링
    if (closingSoon) {
      filtered = filtered.filter(
        (campaign) => campaign.dayCount === "마감임박"
      );
    }

    // 3단계: 카테고리 필터 적용
    // 선택된 카테고리에 해당하는 캠페인만 필터링
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((campaign) =>
        activeFilters.categories.includes(campaign.subcategory)
      );
    }

    // 4단계: 채널 필터 적용
    // 선택된 채널에 해당하는 캠페인만 필터링
    if (activeFilters.channels.length > 0) {
      filtered = filtered.filter((campaign) =>
        activeFilters.channels.includes(campaign.channel)
      );
    }

    // 5단계: 지역 필터 적용 (방문형만)
    // 선택된 지역에 해당하는 캠페인만 필터링
    // - 정확한 매칭: "서울 > 강남구" === "서울 > 강남구"
    // - 전체 지역 매칭: "서울 > 서울 전체"와 "서울 > 강남구" 매칭
    if (
      enableRegionFilter &&
      activeFilters.regions &&
      activeFilters.regions.length > 0
    ) {
      filtered = filtered.filter((campaign) => {
        if (!campaign.region) return false;

        // 지역 필터와 캠페인 지역 매칭 로직
        return activeFilters.regions!.some((filterRegion) => {
          // 1. 정확한 매칭
          if (filterRegion === campaign.region) {
            return true;
          }
          // 2. 전체 지역 매칭 (예: "서울 > 서울 전체"와 "서울 > 강남구" 매칭)
          if (filterRegion.endsWith(" 전체")) {
            const mainRegion = filterRegion.split(" > ")[0];
            return campaign.region!.startsWith(`${mainRegion} >`);
          }
          return false;
        });
      });
    }

    // 6단계: 정렬 적용
    // 정렬 기준에 따라 캠페인 목록 정렬
    switch (activeFilters.sort) {
      case "인기순":
        // 현재 지원자 수 기준으로 내림차순 정렬
        filtered.sort((a, b) => b.recruitment.current - a.recruitment.current);
        break;
      case "마감임박순":
        // 마감임박인 캠페인을 먼저 보여주고, 나머지는 최신순으로 정렬
        filtered.sort((a, b) => {
          if (a.dayCount === "마감임박" && b.dayCount !== "마감임박") return -1;
          if (b.dayCount === "마감임박" && a.dayCount !== "마감임박") return 1;
          return b.id.localeCompare(a.id);
        });
        break;
      case "포인트순":
      case "포인트높은순":
        // 포인트 기준으로 내림차순 정렬
        filtered.sort((a, b) => b.points - a.points);
        break;
      case "최신순":
      default:
        // ID 기준으로 내림차순 정렬 (최신이 먼저)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return filtered;
  }, [campaigns, activeFilters, closingSoon, enableRegionFilter]);

  /* ========================================
     반환값
     ======================================== */

  /**
   * 훅 반환값
   * - activeFilters: 현재 활성화된 필터 상태
   * - closingSoon: 마감임박 필터 활성화 여부
   * - handleFilterChange: 필터 변경 핸들러 함수
   * - setClosingSoon: 마감임박 필터 변경 함수
   * - filteredAndSortedCampaigns: 필터링 및 정렬된 캠페인 목록
   */
  return {
    activeFilters,
    closingSoon,
    handleFilterChange,
    setClosingSoon,
    filteredAndSortedCampaigns: filteredAndSortedCampaigns as BaseCampaign[],
  };
}

