/* ========================================
   캠페인 등록페이지 데이터 훅
   ======================================== */

/**
 * useCampaignCreatePage
 *
 * 목적: GET /partner/campaign/create 호출 → 카테고리/채널/지역/파트너 정보 로드
 *       컴포넌트에서 기존 상수 대신 API 데이터를 사용하도록 어댑터 역할
 *
 * 사용 위치:
 * - CampaignFormBase.tsx (카테고리/채널/지역 드롭다운 옵션)
 * - useCampaignFormStorage.ts (보유 포인트)
 */

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCampaignCreatePage } from "@/lib/api/partnerCampaign";
import type { CampaignCreatePageResponse } from "@/types/api/partnerCampaign";

// ── 채널 한글 라벨 매핑 ──
const CHANNEL_LABELS: Record<string, string> = {
  NAVER_BLOG: "네이버 블로그",
  NAVER_CLIP: "네이버 클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "쇼츠",
};

export interface CampaignCreatePageData {
  /** 파트너 정보 */
  partner: CampaignCreatePageResponse["partner"];
  /** 카테고리 드롭다운 옵션 (한글 이름 배열) */
  categoryOptions: string[];
  /** 채널(플랫폼) 드롭다운 옵션 (한글 이름 배열) */
  channelOptions: string[];
  /** 지역 드롭다운 옵션 (레벨 1 이름 배열) */
  regionOptions: string[];
  /** 하위 지역 매핑 (상위 regionId → 하위 지역 이름 배열) */
  subRegionMap: Record<string, string[]>;
  /** 카테고리명 → ID 변환 */
  categoryNameToId: Record<string, number>;
  /** 채널 한글명 → ID 변환 */
  channelNameToId: Record<string, number>;
  /** 지역명 → ID 변환 */
  regionNameToId: Record<string, number>;
  /** 원본 데이터 */
  raw: CampaignCreatePageResponse;
}

export function useCampaignCreatePage() {
  const query = useQuery({
    queryKey: ["partner", "campaign", "createPage"],
    queryFn: getCampaignCreatePage,
    staleTime: 1000 * 60 * 10,
  });

  const data = query.data;

  const pageData: CampaignCreatePageData | null = useMemo(() => {
    if (!data) return null;

    // 카테고리
    const categoryOptions = data.categories.map((c) => c.categoryName);
    const categoryNameToId: Record<string, number> = {};
    data.categories.forEach((c) => {
      categoryNameToId[c.categoryName] = c.categoryId;
    });

    // 채널
    const channelOptions = data.channels.map((c) => CHANNEL_LABELS[c.channelName] || c.channelName);
    const channelNameToId: Record<string, number> = {};
    data.channels.forEach((c) => {
      const label = CHANNEL_LABELS[c.channelName] || c.channelName;
      channelNameToId[label] = c.channelId;
    });

    // 지역 (레벨 1: 광역시도, 레벨 2: 시군구)
    const level1 = data.regions.filter((r) => r.level === 1);
    const level2 = data.regions.filter((r) => r.level === 2);

    const regionOptions = level1.map((r) => r.name);
    const regionNameToId: Record<string, number> = {};
    data.regions.forEach((r) => {
      regionNameToId[r.name] = r.regionId;
    });

    // 상위 지역 → 하위 지역 매핑
    const subRegionMap: Record<string, string[]> = {};
    level1.forEach((parent) => {
      const children = level2.filter((r) => r.parentId === parent.regionId);
      subRegionMap[parent.name] = children.map((c) => c.name);
    });

    return {
      partner: data.partner,
      categoryOptions,
      channelOptions,
      regionOptions,
      subRegionMap,
      categoryNameToId,
      channelNameToId,
      regionNameToId,
      raw: data,
    };
  }, [data]);

  return {
    ...query,
    pageData,
  };
}
