"use client";

import { useState } from "react";
import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import MainMenu from "@/components/main/MainMenu";
import FilterBar from "@/components/filter/FilterBar";
import { experienceCampaigns } from "@/data/experience/experienceCampaigns";
import {
  experienceCategoryOptions,
  experienceChannelOptions,
  experienceSortOptions,
} from "@/data/experience/experienceFilterOptions";
import styles from "../../styles/delivery/delivery.module.css";

export default function ExperiencePage() {
  const campaigns = experienceCampaigns;

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[];
    categories: string[];
  }>({
    channels: [],
    categories: [],
  });

  const handleFilterChange = (filters: any) => {
    console.log("Experience filters:", filters);

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
          categoryOptions={experienceCategoryOptions}
          channelOptions={experienceChannelOptions}
          sortOptions={experienceSortOptions}
        />

        <section className={styles.campaign_container}>
          <Titletext main_title="체험단 캠페인" />
          <div className={styles.campaign_grid}>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignBox
                  key={campaign.id}
                  campaign={campaign}
                  basePath="/experience"
                />
              ))
            ) : (
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>🎯</div>
                <h3>현재 진행중인 체험단 캠페인이 없습니다</h3>
                <p>새로운 캠페인을 기다려주세요!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
