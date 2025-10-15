"use client";

import { useState, useMemo } from "react";
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
  const reporter_campaigns = reporterCampaigns;

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState<{
    channels: string[];
    categories: string[];
    sort: string;
  }>({
    channels: [],
    categories: [],
    sort: "latest",
  });

  const [closingSoon, setClosingSoon] = useState<boolean>(false);

  const handleFilterChange = (filters: any) => {
    console.log("Reporter filters:", filters);

    if (filters.closingSoon !== undefined) {
      setClosingSoon(filters.closingSoon);
    }

    if (filters.sort !== undefined) {
      setActiveFilters((prev) => ({ ...prev, sort: filters.sort || "latest" }));
    }

    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (filters.category !== undefined) {
        newFilters.categories = filters.category
          ? filters.category.split(",").filter((c: string) => c.trim())
          : [];
      }

      if (filters.channel !== undefined) {
        newFilters.channels = filters.channel
          ? filters.channel.split(",").filter((c: string) => c.trim())
          : [];
      }

      return newFilters;
    });
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    console.log("🔄 기자단 캠페인 필터링 및 정렬 시작");

    let filtered = [...reporter_campaigns];

    if (closingSoon) {
      console.log("⏰ 마감임박 필터 적용 중...");
      filtered = filtered.filter(
        (campaign) => campaign.dayCount === "마감임박"
      );
      console.log(`✅ 마감임박 캠페인 ${filtered.length}개 찾음`);
    }

    if (activeFilters.categories.length > 0) {
      console.log("📂 카테고리 필터 적용:", activeFilters.categories);
      filtered = filtered.filter((campaign) =>
        activeFilters.categories.includes(campaign.subcategory)
      );
    }

    if (activeFilters.channels.length > 0) {
      console.log("📺 채널 필터 적용:", activeFilters.channels);
      filtered = filtered.filter((campaign) =>
        activeFilters.channels.includes(campaign.channel)
      );
    }

    console.log("🔄 정렬 적용:", activeFilters.sort);

    switch (activeFilters.sort) {
      case "points_high":
        filtered.sort((a, b) => b.points - a.points);
        break;
      case "points_low":
        filtered.sort((a, b) => a.points - b.points);
        break;
      case "recruitment_high":
        filtered.sort((a, b) => b.recruitment.current - a.recruitment.current);
        break;
      case "recruitment_low":
        filtered.sort((a, b) => a.recruitment.current - b.recruitment.current);
        break;
      case "latest":
      default:
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    console.log(`✅ 최종 결과: ${filtered.length}개 캠페인`);
    return filtered;
  }, [reporter_campaigns, activeFilters, closingSoon]);

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
          categoryOptions={reporterCategoryOptions}
          channelOptions={reporterChannelOptions}
          sortOptions={reporterSortOptions}
          closingSoon={closingSoon}
          onClosingSoonChange={setClosingSoon}
        />

        <section className={styles.campaign_container}>
          <Titletext main_title="기자단" />
          <div className={styles.campaign_grid}>
            {filteredAndSortedCampaigns.length > 0 ? (
              filteredAndSortedCampaigns.map((campaign) => (
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
