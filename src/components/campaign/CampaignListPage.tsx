/**
 * 캠페인 목록 페이지 공용 컴포넌트
 *
 * 사용 파일:
 * - src/app/campaign/delivery/page.tsx
 * - src/app/campaign/mission/page.tsx
 * - src/app/campaign/reporter/page.tsx
 * - src/app/campaign/review/page.tsx
 * - src/app/campaign/visit/page.tsx
 *
 * 주요 기능:
 * - 공통 레이아웃 구조 제공 (MainMenu, FilterBar, CampaignBox)
 * - 빈 상태 처리
 */

"use client";

import MainMenu from "@/components/main/MainMenu";
import FilterBar from "@/components/user/filter/FilterBar";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import styles from "@/styles/user/delivery/delivery.module.css";

// FilterBar props 타입 (FilterBar 컴포넌트에서 가져온 타입과 동일)
interface FilterBarProps {
  onFilterChange?: (filters: {
    category?: string;
    channel?: string;
    region?: string;
    closingSoon?: boolean;
    sortBy?: string;
  }) => void;
  activeFilters?: {
    channels?: string[];
    categories?: string[];
    regions?: string[];
  };
  categoryOptions: string[];
  channelOptions: string[];
  useRegionFilter?: boolean;
  sortOptions?: string[] | { value: string; label: string }[];
  closingSoon?: boolean;
  onClosingSoonChange?: (closingSoon: boolean) => void;
  defaultSort?: string;
}

// 캠페인 기본 타입 (CampaignBox가 요구하는 모든 필드를 포함)
type BaseCampaign = {
  id: string;
  title: string;
  category: string;
  categoryIcon?: string;
  image: string;
  dayCount?: string;
  recruitment: {
    current: number;
    total: number;
  };
  schedule?: string;
  [key: string]: any; // 추가 필드 허용
};

// 컴포넌트 props 타입
interface CampaignListPageProps {
  // 페이지 제목
  title: string;
  // 캠페인 데이터 (any로 타입 단언하여 다양한 캠페인 타입 허용)
  campaigns: any[];
  // basePath (상세 페이지 경로)
  basePath: string;
  // FilterBar props
  filterBarProps: FilterBarProps;
}

/**
 * 캠페인 목록 페이지 공용 컴포넌트
 *
 * @param title - 페이지 제목 (예: "배송형", "미션형")
 * @param campaigns - 필터링된 캠페인 목록
 * @param basePath - 상세 페이지 경로 (예: "/campaign/delivery")
 * @param filterBarProps - FilterBar 컴포넌트에 전달할 props
 */
export default function CampaignListPage({
  title,
  campaigns,
  basePath,
  filterBarProps,
}: CampaignListPageProps) {
  return (
    <>
      {/* 메인 메뉴 컴포넌트 - 헤더(80px) 밑에 고정 */}
      <MainMenu />

      {/* 
        레이아웃 시프트 방지를 위한 placeholder 
        - 헤더(80px) + MainMenu(약 69px) = 149px
        - fixed된 헤더와 메뉴가 콘텐츠를 가리지 않도록 공간 확보
      */}
      <div style={{ height: "149px" }}></div>

      <main className={styles.delivery_page}>
        {/* 필터/정렬 바 */}
        <FilterBar {...filterBarProps} />

        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title={title} />

          {/* 캠페인 그리드 */}
          <div className={styles.campaign_grid}>
            {campaigns.length > 0 &&
              campaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id}
                  campaign={campaign}
                  basePath={basePath}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}

