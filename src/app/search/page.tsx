/* ========================================
   캠페인 검색 결과 페이지
   ======================================== */

/**
 * SearchPage
 *
 * 목적: 헤더 검색에서 이동하는 캠페인 검색 결과 페이지
 *       파트너 검색 페이지와 동일한 구조로 API 호출 (React Query)
 *
 * 사용 페이지:
 * - /search (리뷰어 캠페인 검색 결과)
 */

"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import MainMenu from "@/components/main/MainMenu";
import Footer from "@/components/main/Footer";
import SearchResultsSection from "@/components/search/SearchResultsSection";
import Loading from "@/app/loading";
import styles from "@/styles/home/home.module.css";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

const TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

/** 마감일까지 남은 D-day 계산 */
function calcDayCount(recruitEndAt?: string): string {
  if (!recruitEndAt) return "";
  const end = new Date(recruitEndAt);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

/** R-21 백엔드 실제 응답 필드 (flat) + mock 추가 필드 */
interface SearchCampaignItem {
  campaignId: number;
  title: string;
  // R-21 flat 필드 (실제 백엔드)
  recruitLimit: number;
  campaignApplicationCount: number;
  imageUrl: string;
  categoryId: number;
  channelId: number;
  // mock 추가 필드 (mock 서버 호환)
  type?: string;
  status?: string;
  thumbnail?: { url: string };
  requiredPlatform?: { channelId: number; channelName: string };
  recruit?: { recruitLimit: number; recruitStartAt: string; recruitEndAt: string };
  metrics?: { appliedCount: number };
  reward?: { extraRewardPoint: number; paymentRewardPoint: number };
}

interface SearchApiResponse {
  result: string;
  keyword?: string;
  totalCount?: number;
  items: SearchCampaignItem[];
}

function adaptApiItem(item: SearchCampaignItem) {
  const recruitEndAt = item.recruit?.recruitEndAt ?? "";
  const dayCount = calcDayCount(recruitEndAt);
  return {
    id: String(item.campaignId),
    title: item.title,
    category: TYPE_LABEL[item.type ?? ""] ?? "캠페인",
    channel: item.requiredPlatform?.channelName ?? "",
    image: item.imageUrl ?? item.thumbnail?.url ?? "",
    recruitment: {
      current: item.campaignApplicationCount ?? item.metrics?.appliedCount ?? 0,
      total: item.recruitLimit ?? item.recruit?.recruitLimit ?? 0,
    },
    dayCount,
    isUrgent: item.status === "EMERGENCY" || dayCount === "D-Day",
    points: (item.reward?.extraRewardPoint ?? 0) + (item.reward?.paymentRewardPoint ?? 0),
    detailedSchedule: {
      applicationStart: item.recruit?.recruitStartAt ?? "",
      applicationEnd: recruitEndAt,
    },
  };
}

function useReviewerCampaignSearch(keyword: string) {
  return useQuery({
    queryKey: ["reviewer", "search", keyword],
    queryFn: async () => {
      const { data } = await apiClient.get<SearchApiResponse>("/search", {
        params: keyword ? { keyword } : {},
      });
      return data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  const { data, isLoading } = useReviewerCampaignSearch(keyword);

  const campaigns = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(adaptApiItem);
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

      {/* 푸터 */}
      <Footer />
    </>
  );
}
