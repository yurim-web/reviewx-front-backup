"use client";

import { useState } from "react";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import MainMenu from "@/components/main/MainMenu";
import FilterBar from "@/components/filter/FilterBar";
import { reporterCampaigns } from "@/data/reporter/reporterCampaigns";
import {
  reporterCategoryOptions,
  reporterChannelOptions,
  reporterSortOptions,
} from "@/data/reporter/reporterFilterOptions";
import styles from "../../styles/delivery/delivery.module.css";

export default function ReporterPage() {
  const campaigns = reporterCampaigns;

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[];
    categories: string[];
  }>({
    channels: [],
    categories: [],
  });

  const handleFilterChange = (filters: any) => {
    console.log("Reporter filters:", filters);

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
  };

  return (
    <>
      <MainMenu />
      <main className={styles.delivery_page}>
        {/* 필터/정렬 바 */}
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          categoryOptions={reporterCategoryOptions}
          channelOptions={reporterChannelOptions}
          sortOptions={reporterSortOptions}
        />

        <section className={styles.campaign_container}>
          <Titletext main_title="기자단 캠페인" />
          <div className={styles.campaign_grid}>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id}
                  campaign={campaign}
                  basePath="/reporter"
                />
              ))
            ) : (
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>📰</div>
                <h3>현재 진행중인 기자단 캠페인이 없습니다</h3>
                <p>새로운 캠페인을 기다려주세요!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
