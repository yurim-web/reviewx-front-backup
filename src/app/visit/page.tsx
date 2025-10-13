"use client";

import { useState } from "react";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import MainMenu from "@/components/main/MainMenu";
import FilterBar from "@/components/filter/FilterBar";
import { visitCampaigns } from "@/data/visit/visitCampaigns";
import {
  visitCategoryOptions,
  visitChannelOptions,
  useVisitRegionFilter,
  visitSortOptions,
} from "@/data/visit/visitFilterOptions";
import styles from "../../styles/delivery/delivery.module.css";

export default function VisitPage() {
  const campaigns = visitCampaigns;

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[];
    categories: string[];
    regions: string[];
  }>({
    channels: [],
    categories: [],
    regions: [],
  });

  const handleFilterChange = (filters: any) => {
    console.log("Visit filters:", filters);

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

      // 지역 필터 업데이트
      if (filters.region !== undefined) {
        newFilters.regions = filters.region
          ? filters.region.split(",").filter((r: string) => r.trim())
          : [];
      }

      return newFilters;
    });
  };

  return (
    <>
      <MainMenu />
      <main className={styles.delivery_page}>
        {/* 필터/정렬 바 */}
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          categoryOptions={visitCategoryOptions}
          channelOptions={visitChannelOptions}
          useRegionFilter={useVisitRegionFilter}
          sortOptions={visitSortOptions}
        />

        <section className={styles.campaign_container}>
          <Titletext main_title="방문형" />
          <div className={styles.campaign_grid}>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id}
                  campaign={campaign}
                  basePath="/visit"
                />
              ))
            ) : (
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>📍</div>
                <h3>현재 진행중인 방문형 캠페인이 없습니다</h3>
                <p>새로운 캠페인을 기다려주세요!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
