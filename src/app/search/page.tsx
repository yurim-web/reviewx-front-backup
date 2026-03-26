/* ========================================
   캠페인 검색 결과 페이지
   ======================================== */

/**
 * SearchPage
 *
 * 목적: 헤더 검색에서 이동하는 캠페인 검색 결과 페이지
 *       json-server API(/reviewer/search) 호출, 실패 시 정적 데이터 fallback
 *
 * 사용 페이지:
 * - /search (캠페인 검색 결과)
 */

import type { Metadata } from "next";

import MainMenu from "@/components/main/MainMenu";
import Footer from "@/components/main/Footer";
import styles from "@/styles/home/home.module.css";
import SearchResultsSection from "@/components/search/SearchResultsSection";

import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 검색 결과",
  description: "리뷰 캠페인 검색 결과 페이지입니다",
};

interface SearchApiItem {
  campaignId: number;
  title: string;
  recruitLimit: number;
  campaignApplicationCount: number;
  imageUrl: string;
  categoryId: number;
  channelId: number;
}

function adaptApiItem(item: SearchApiItem) {
  return {
    id: String(item.campaignId),
    title: item.title,
    category: "캠페인",
    image: item.imageUrl,
    recruitment: {
      current: item.campaignApplicationCount,
      total: item.recruitLimit,
    },
    dayCount: "",
    isUrgent: false,
  };
}

async function fetchSearchResults(keyword: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const url = keyword
      ? `${apiUrl}/reviewer/search?keyword=${encodeURIComponent(keyword)}`
      : `${apiUrl}/reviewer/search`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: SearchApiItem[] | { items?: SearchApiItem[] } = await res.json();
    const items = Array.isArray(data) ? data : (data.items ?? []);
    return items.map(adaptApiItem);
  } catch {
    return null;
  }
}

type SearchPageProps = {
  searchParams?: Promise<{
    keyword?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const raw_keyword = resolved?.keyword ?? "";
  const keyword =
    typeof raw_keyword === "string" ? raw_keyword.trim() : (raw_keyword[0]?.trim() ?? "");

  // API 호출 시도
  const apiResults = await fetchSearchResults(keyword);

  // API 성공 시 API 결과 사용, 실패 시 정적 데이터 fallback
  let filtered_campaigns;
  if (apiResults !== null) {
    filtered_campaigns = apiResults;
  } else {
    const normalized_keyword = keyword.toLowerCase();
    const all_campaigns = [
      ...deliveryCampaigns,
      ...reviewCampaigns,
      ...visitCampaigns,
      ...missionCampaigns,
      ...reporterCampaigns,
    ];
    filtered_campaigns = keyword
      ? all_campaigns.filter((campaign) => {
          const title = campaign.title?.toLowerCase() ?? "";
          const description =
            (campaign as { description?: string }).description?.toLowerCase() ?? "";
          return title.includes(normalized_keyword) || description.includes(normalized_keyword);
        })
      : all_campaigns;
  }

  return (
    <>
      {/* 메인 메뉴 (헤더 아래 고정) */}
      <MainMenu />

      {/* 헤더(80px) + MainMenu(약 69px) 공간 확보 */}
      <div className={styles.header_spacer}></div>

      <article className={styles.container}>
        {/* 상단 배너는 생략하고, 바로 검색 결과 리스트 + 정렬 필터만 노출 */}
        <SearchResultsSection campaigns={filtered_campaigns} keyword={keyword} />
      </article>

      {/* 푸터 */}
      <Footer />
    </>
  );
}
