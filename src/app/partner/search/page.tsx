/* ========================================
   파트너 캠페인 검색 결과 페이지
   ======================================== */

/**
 * PartnerSearchPage
 *
 * 목적: 파트너 헤더 검색에서 이동하는 캠페인 검색 결과 페이지
 *       json-server API(/partner/search) 호출, 실패 시 정적 데이터 fallback
 *
 * 사용 페이지:
 * - /partner/search (파트너 캠페인 검색 결과)
 */

import MainMenu from "@/components/main/MainMenu";
import SearchResultsSection from "@/components/search/SearchResultsSection";
import styles from "@/styles/home/home.module.css";

import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

import type { PartnerCampaignCard, PartnerSearchResponse } from "@/types/api/dashboard";

const TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

function adaptApiItem(item: PartnerCampaignCard) {
  return {
    id: String(item.campaignId),
    title: item.title,
    category: TYPE_LABEL[item.type] ?? item.type,
    channel: item.requiredPlatform?.channelName ?? "",
    image: item.thumbnail?.url ?? "",
    recruitment: {
      current: item.metrics?.appliedCount ?? 0,
      total: item.recruit?.recruitLimit ?? 0,
    },
    dayCount: "",
    isUrgent: item.status === "EMERGENCY",
  };
}

async function fetchSearchResults(keyword: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const url = `${apiUrl}/partner/search?keyword=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: PartnerSearchResponse = await res.json();
    return data.campaigns.map(adaptApiItem);
  } catch {
    return null;
  }
}

type PartnerSearchPageProps = {
  searchParams?: Promise<{
    keyword?: string | string[];
  }>;
};

export default async function PartnerSearchPage({ searchParams }: PartnerSearchPageProps) {
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
        <SearchResultsSection campaigns={filtered_campaigns} />
      </article>
    </>
  );
}
