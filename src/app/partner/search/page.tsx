/* ========================================

   🔎 파트너 캠페인 검색 결과 페이지

   - 파트너 헤더에서 검색 시 이동

   - 메인(홈) 캠페인 카드 레이아웃과 동일

   ======================================== */

import MainMenu from "@/components/main/MainMenu";

import SearchResultsSection from "@/components/search/SearchResultsSection";

import styles from "@/styles/home/home.module.css";

import { deliveryCampaigns } from "@/data/user/delivery/deliveryCampaigns";

import { visitCampaigns } from "@/data/user/visit/visitCampaigns";

import { reviewCampaigns } from "@/data/user/review/reviewCampaigns";

import { missionCampaigns } from "@/data/user/mission/missionCampaigns";

import { reporterCampaigns } from "@/data/user/reporter/reporterCampaigns";

type PartnerSearchPageProps = {
  searchParams?: {
    keyword?: string | string[];
  };
};

export default function PartnerSearchPage({
  searchParams,
}: PartnerSearchPageProps) {
  const raw_keyword = searchParams?.keyword ?? "";

  const keyword =
    typeof raw_keyword === "string"
      ? raw_keyword.trim()
      : raw_keyword[0]?.trim() ?? "";

  const normalized_keyword = keyword.toLowerCase();

  // 메인 홈에서 사용하는 모든 캠페인 데이터를 하나로 합친 뒤 검색

  const all_campaigns = [
    ...deliveryCampaigns,

    ...reviewCampaigns,

    ...visitCampaigns,

    ...missionCampaigns,

    ...reporterCampaigns,
  ];

  const filtered_campaigns = keyword
    ? all_campaigns.filter((campaign) => {
        const title = campaign.title?.toLowerCase() ?? "";

        const description = campaign.description?.toLowerCase() ?? "";

        return (
          title.includes(normalized_keyword) ||
          description.includes(normalized_keyword)
        );
      })
    : all_campaigns;

  return (
    <>
      {/* 메인 메뉴 (헤더 아래 고정) */}

      <MainMenu />

      {/* 헤더(80px) + MainMenu(약 69px) 공간 확보 */}

      <div style={{ height: "149px" }}></div>

      <article className={styles.container}>
        {/* 상단 배너는 생략하고, 바로 검색 결과 리스트 + 정렬 필터만 노출 */}

        <SearchResultsSection campaigns={filtered_campaigns} />
      </article>
    </>
  );
}

