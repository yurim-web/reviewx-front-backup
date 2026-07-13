/* ========================================
   캠페인 상세 React Query 훅
   ======================================== */

/**
 * useCampaignDetail
 *
 * 목적: 캠페인 상세 API(23번) 호출 + 각 상세 페이지 호환 타입으로 변환
 *
 * 사용 페이지:
 * - /campaign/delivery/[id]
 * - /campaign/visit/[id]
 * - /campaign/review/[id]
 * - /campaign/reporter/[id]
 * - /campaign/mission/[id]
 *
 * API: 23번 GET /campaign/{type}/{campaignId}
 */

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { fetchCampaignDetail } from "@/lib/api/campaign";
import type { CampaignDetailApiItem } from "@/types/api/campaign";

// 정적 fallback 데이터
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

/* ========================================
   채널 / 유형 라벨 변환
   ======================================== */

const CHANNEL_LABEL: Record<string, string> = {
  NAVER_BLOG: "네이버 블로그",
  NAVER_CLIP: "클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "유튜브 쇼츠",
};

const TYPE_LABEL: Record<string, string> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

/* ========================================
   공통 어댑터 출력 타입
   ======================================== */

export interface CampaignDetailAdapted {
  id: string;
  type: string; // "DELIVERY" | "VISIT" etc.
  title: string;
  category: string; // "배송형" etc.
  subcategory: string;
  channel: string;
  image: string; // 썸네일 이미지
  detailImages: string[]; // 상세 이미지 배열
  points: number;
  description: string;
  recruitment: { current: number; total: number };
  dayCount: string;
  schedule: string;
  isUrgent: boolean;
  keyword: string;
  requirements: string[];
  guidelineTexts: string[];
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
    announcement: string;
    purchasePeriod: string;
    registrationPeriod: string;
  };
  // 방문형 전용
  visitAddress?: string;
  visitLink?: string;
  visitReservationRequired?: boolean;
  addressGuide?: string;
  region?: string;
  // 구매평 전용
  purchaseLink?: string;
  purchasePoint?: number;
  // 미션형 전용
  requireContentLink?: boolean;
  requireContentImage?: boolean;
  // 공통 링크
  promotionLink?: string;
}

/* ========================================
   유틸 함수
   ======================================== */

function calcDayCount(recruitEndAt: string): string {
  if (!recruitEndAt) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(recruitEndAt);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff <= 1) return "마감임박";
  return `D-${diff}`;
}

function calcSchedule(recruitStartAt: string): string {
  if (!recruitStartAt) return "";
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(recruitStartAt);
    start.setHours(0, 0, 0, 0);
    if (today < start) {
      return `${format(new Date(recruitStartAt), "M/d (E)", { locale: ko })}\n모집 오픈`;
    }
  } catch (_e) {}
  return "";
}

function buildRequirements(keywordPolicy?: CampaignDetailApiItem["keywordPolicy"]): string[] {
  if (!keywordPolicy) return [];
  const reqs: string[] = [];
  if (keywordPolicy.minTextLength) reqs.push(`text_${keywordPolicy.minTextLength}`);
  if (keywordPolicy.minPhotoCount) reqs.push(`photo_${keywordPolicy.minPhotoCount}`);
  if (keywordPolicy.minVideoCount || keywordPolicy.minVideoDuration) {
    const count = keywordPolicy.minVideoCount ?? 1;
    const duration = keywordPolicy.minVideoDuration ?? 0;
    reqs.push(duration ? `video_${count}_${duration}` : `video_${count}`);
  }
  if (keywordPolicy.requireBodyLink) reqs.push("product_link");
  if (keywordPolicy.requireKeywordAttachment) reqs.push("keyword");
  return reqs;
}

const REGION_SHORT_MAP: Record<string, string> = {
  서울특별시: "서울",
  인천광역시: "인천",
  경기도: "경기",
  강원특별자치도: "강원",
  대전광역시: "대전",
  세종특별자치시: "세종",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전라남도: "전남",
  광주광역시: "광주",
  대구광역시: "대구",
  경상북도: "경북",
  경상남도: "경남",
  부산광역시: "부산",
  울산광역시: "울산",
  제주특별자치도: "제주",
};

function getRegionString(region: CampaignDetailApiItem["region"]): string {
  if (!region) return "";
  if (typeof region === "string") return region;
  // level 2 지역: "인천 > 남구" 형식으로 표시
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentName = (region as any).parentName;
  if (parentName && region.name) {
    const short = REGION_SHORT_MAP[parentName] || parentName;
    return `${short} > ${region.name}`;
  }
  return region.name ?? "";
}

/* ========================================
   어댑터
   ======================================== */

export function adaptCampaignDetail(item: CampaignDetailApiItem): CampaignDetailAdapted {
  const recruitStartAt = item.recruit?.recruitStartAt ?? "";
  const recruitEndAt = item.recruit?.recruitEndAt ?? "";
  const contentStartAt = item.content?.contentStartAt ?? "";
  const contentEndAt = item.content?.contentEndAt ?? "";

  const fmtRecruitStart = recruitStartAt.substring(0, 10);
  const fmtRecruitEnd = recruitEndAt.substring(0, 10);
  const fmtContentStart = contentStartAt.substring(0, 10);
  const fmtContentEnd = contentEndAt.substring(0, 10);

  const registrationPeriod =
    contentStartAt && contentEndAt ? `${fmtContentStart} ~ ${fmtContentEnd}` : "";

  // 선정 발표일: 모집 종료 다음 날 ~ 등록 시작 전날 사이 (모집 종료 + 1일)
  const announcement = recruitEndAt
    ? (() => {
        const d = new Date(recruitEndAt);
        d.setDate(d.getDate() + 1);
        return d.toISOString().substring(0, 10);
      })()
    : "";

  const thumbnailUrl = item.thumbnailUrl ?? item.thumbnail?.url ?? "";
  const detailImages =
    item.detailImages && item.detailImages.length > 0 ? item.detailImages : [thumbnailUrl]; // fallback: 상세이미지 없으면 썸네일 사용

  const appliedCount = Number(item.metrics?.appliedCount ?? item.appliedCount ?? 0);
  const recruitLimit = Number(item.recruit?.recruitLimit ?? item.recruitLimit ?? 0);

  return {
    id: String(item.campaignId ?? item.id),
    type: item.type,
    title: item.title,
    category: TYPE_LABEL[item.type] ?? item.type,
    subcategory: item.category?.categoryName ?? "기타",
    channel: item.requiredPlatform?.channelName
      ? (CHANNEL_LABEL[item.requiredPlatform.channelName] ?? item.requiredPlatform.channelName)
      : "",
    image: thumbnailUrl,
    detailImages,
    points: item.reward?.extraRewardPoint ?? 0,
    description: item.description ?? "",
    recruitment: { current: appliedCount, total: recruitLimit },
    dayCount: calcDayCount(recruitEndAt),
    schedule: calcSchedule(recruitStartAt),
    isUrgent: item.status === "EMERGENCY" || item.isEmergency === true,
    keyword: item.keywordPolicy?.keyword ?? "",
    requirements: buildRequirements(item.keywordPolicy),
    guidelineTexts: item.notification ? [item.notification.replace(/\n/g, "<br>")] : [],
    detailedSchedule: {
      applicationStart: fmtRecruitStart,
      applicationEnd: fmtRecruitEnd,
      announcement,
      purchasePeriod: item.purchasePeriod ?? (item.purchaseInfo ? registrationPeriod : ""),
      registrationPeriod,
    },
    // 방문형 (우편번호 + 기본주소 + 상세주소 합침)
    visitAddress: (() => {
      const base = item.visitInfo?.address ?? item.visitBaseAddress ?? item.visitAddress ?? "";
      if (!base) return undefined;
      const zip = item.visitZipCode ? `(${item.visitZipCode}) ` : "";
      const detail = item.visitDetailAddress ? ` ${item.visitDetailAddress}` : "";
      return `${zip}${base}${detail}`.trim();
    })(),
    visitLink: item.visitLink ?? undefined,
    visitReservationRequired: item.visitInfo?.reservationRequired,
    addressGuide: item.addressGuide ?? undefined,
    // 구매평 (nested purchaseInfo 우선, flat 필드 fallback)
    purchaseLink: item.purchaseInfo?.purchaseLink ?? item.purchaseLink ?? undefined,
    purchasePoint: item.purchaseInfo?.purchasePoint,
    // 미션형 (nested missionInfo 우선, flat 필드 fallback)
    requireContentLink:
      item.missionInfo?.requireContentLink ?? item.requireContentLink ?? undefined,
    requireContentImage:
      item.missionInfo?.requireContentImage ?? item.requireContentImage ?? undefined,
    // 공통 링크
    promotionLink: item.promotionLink,
    // 지역
    region: getRegionString(item.region) || undefined,
  };
}

/* ========================================
   유틸: slug ID → 숫자 ID 변환 (mock 전용)
   "delivery_1" → "1", "visit_5" → "5", 숫자는 그대로
   ======================================== */

function normalizeId(id: string | number): string | number {
  if (typeof id === "string") {
    const match = id.match(/_(\d+)$/);
    if (match) return match[1];
  }
  return id;
}

/* ========================================
   정적 데이터 fallback
   ======================================== */

const TYPE_TO_STATIC: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    image: string;
    subcategory?: string;
    channel?: string;
    points: number;
    description: string;
    recruitment: { current: number; total: number };
    dayCount?: string;
    schedule?: string;
    isUrgent?: boolean;
    keyword: string;
    requirements: string[];
    guidelineTexts: string[];
    detailedSchedule: {
      applicationStart: string;
      applicationEnd: string;
      announcement: string;
      purchasePeriod: string;
      registrationPeriod: string;
    };
    campaign_detail_image: string;
    campaign_detail_images?: string[];
    promotionLink?: string;
    visitAddress?: string;
    visitLink?: string;
    region?: string;
    purchaseLink?: string;
    requireContentLink?: boolean;
    requireContentImage?: boolean;
  }[]
> = {
  delivery: deliveryCampaigns as never[],
  visit: visitCampaigns as never[],
  purchase: reviewCampaigns as never[],
  reporter: reporterCampaigns as never[],
  mission: missionCampaigns as never[],
};

function isRealCampaign(item: { title?: string }): boolean {
  const t = item.title ?? "";
  return (
    !t.includes("테스트") &&
    !t.startsWith("[취소]") &&
    !t.includes("이미지 전용") &&
    !t.includes("링크 전용") &&
    !t.includes("수정 가능하게") &&
    t.length <= 60
  );
}

function findStaticCampaign(type: string, id: string): CampaignDetailAdapted | null {
  const list = (TYPE_TO_STATIC[type] ?? (deliveryCampaigns as never[])).filter(isRealCampaign);
  const item = list.find((c) => String(c.id) === String(id)) ?? list[0];
  if (!item) return null;
  const appEnd = item.detailedSchedule?.applicationEnd ?? "";
  const appStart = item.detailedSchedule?.applicationStart ?? "";
  return {
    id: String(item.id),
    type: type.toUpperCase(),
    title: item.title,
    category: item.category,
    subcategory: item.subcategory ?? "기타",
    channel: item.channel ?? "",
    image: item.image,
    detailImages: item.campaign_detail_images?.length
      ? item.campaign_detail_images
      : [item.campaign_detail_image ?? item.image],
    points: item.points,
    description: item.description,
    recruitment: item.recruitment,
    dayCount: appEnd ? calcDayCount(appEnd) : (item.dayCount ?? ""),
    schedule: appStart ? calcSchedule(appStart) : (item.schedule ?? ""),
    isUrgent: item.isUrgent ?? false,
    keyword: item.keyword,
    requirements: item.requirements,
    guidelineTexts: item.guidelineTexts,
    detailedSchedule: {
      applicationStart: appStart,
      applicationEnd: appEnd,
      announcement: item.detailedSchedule?.announcement ?? "",
      purchasePeriod: item.detailedSchedule?.purchasePeriod ?? "",
      registrationPeriod: item.detailedSchedule?.registrationPeriod ?? "",
    },
    promotionLink: item.promotionLink,
    visitAddress: item.visitAddress,
    visitLink: item.visitLink,
    region: item.region,
    purchaseLink: item.purchaseLink,
    requireContentLink: item.requireContentLink,
    requireContentImage: item.requireContentImage,
  };
}

/* ========================================
   훅
   ======================================== */

/** 캠페인 유형 path variable (백엔드 기준) */
type CampaignDetailType = "delivery" | "visit" | "purchase" | "reporter" | "mission";

export function useCampaignDetail(type: CampaignDetailType, campaignId: string | number) {
  const resolvedId = normalizeId(campaignId);
  return useQuery({
    queryKey: ["campaign", "detail", type, String(campaignId)],
    queryFn: async () => {
      try {
        const result = await fetchCampaignDetail(type, resolvedId);
        return adaptCampaignDetail(result);
      } catch (_e) {
        return findStaticCampaign(type, String(campaignId));
      }
    },
    placeholderData: () => findStaticCampaign(type, String(campaignId)),
    enabled: !!campaignId,
    retry: false,
  });
}
