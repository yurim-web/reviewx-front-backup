/* ========================================
   파트너 캠페인 검색 결과 페이지
   ======================================== */

/**
 * PartnerSearchPage
 *
 * 목적: 파트너 헤더 검색에서 이동하는 캠페인 검색 결과 페이지
 *       실제 백엔드 API(/partner/search) 호출 (React Query)
 *
 * 사용 페이지:
 * - /partner/search (파트너 캠페인 검색 결과)
 */

"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import MainMenu from "@/components/main/MainMenu";
import SearchResultsSection from "@/components/search/SearchResultsSection";
import Loading from "@/app/loading";
import styles from "@/styles/home/home.module.css";
import { usePartnerCampaignSearch } from "@/hooks/partner/usePartnerSearch";
import type { PartnerCampaignCard } from "@/types/api/dashboard";

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
    isUrgent: item.status === "EMERGENCY",
    points: (item.reward?.extraRewardPoint ?? 0) + (item.reward?.paymentRewardPoint ?? 0),
    detailedSchedule: item.recruit?.recruitStartAt
      ? {
          applicationStart: item.recruit.recruitStartAt,
          applicationEnd: item.recruit.recruitEndAt,
        }
      : undefined,
  };
}

export default function PartnerSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  const { data, isLoading } = usePartnerCampaignSearch(keyword);

  const campaigns = useMemo(() => {
    if (!data?.campaigns) return [];
    return data.campaigns.map(adaptApiItem);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* 메인 메뉴 (헤더 아래 고정) */}
      <MainMenu />

      {/* 헤더(80px) + MainMenu(약 69px) 공간 확보 */}
      <div className={styles.header_spacer}></div>

      <article className={styles.container}>
        <SearchResultsSection
          campaigns={campaigns}
          keyword={data?.keyword ?? keyword}
          totalCount={data?.totalCount}
        />
      </article>
    </>
  );
}
