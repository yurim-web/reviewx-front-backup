// 배송형 페이지

"use client";

import { useState } from "react";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import FilterBar from "@/components/filter/FilterBar";
import { deliveryCampaigns } from "@/data/delivery/deliveryCampaigns";
import {
  deliveryCategoryOptions,
  deliveryChannelOptions,
  deliverySortOptions,
} from "@/data/delivery/deliveryFilterOptions";
import styles from "../../styles/delivery/delivery.module.css";
import MainMenu from "@/components/main/MainMenu";

export default function DeliveryPage() {
  // 배송형 캠페인 데이터 사용 (이미 배송형만 포함됨)
  const delivery_campaigns = deliveryCampaigns;

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[];
    categories: string[];
  }>({
    channels: [],
    categories: [],
  });

  // 필터 변경 핸들러
  const handleFilterChange = (filters: any) => {
    console.log("필터 변경:", filters);

    // 새로운 필터 상태 업데이트
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      // 카테고리 필터 업데이트
      if (filters.category !== undefined) {
        newFilters.categories = filters.category
          ? filters.category.split(",").filter((c: string) => c.trim())
          : [];
      }

      // 채널 필터 업데이트
      if (filters.channel !== undefined) {
        newFilters.channels = filters.channel
          ? filters.channel.split(",").filter((c: string) => c.trim())
          : [];
      }

      return newFilters;
    });

    // 여기서 실제 캠페인 필터링 로직을 추가할 수 있습니다
  };

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
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          categoryOptions={deliveryCategoryOptions}
          channelOptions={deliveryChannelOptions}
          sortOptions={deliverySortOptions}
        />

        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="배송형" />

          {/* 배송형 캠페인 그리드 */}
          <div className={styles.campaign_grid}>
            {delivery_campaigns.length > 0 ? (
              delivery_campaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id}
                  campaign={campaign}
                  basePath="/delivery"
                />
              ))
            ) : (
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>📦</div>
                <h3>현재 진행중인 배송형 캠페인이 없습니다</h3>
                <p>새로운 캠페인을 기다려주세요!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
