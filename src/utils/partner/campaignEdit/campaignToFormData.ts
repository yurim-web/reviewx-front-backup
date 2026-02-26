/* ========================================
   🔄 캠페인 데이터 → 폼 데이터 변환 유틸리티
   ======================================== */

/**
 * 목적: 5개 캠페인 편집 페이지의 중복 변환 함수를 1개로 통합
 *
 * 사용 위치:
 * - src/app/partner/campaign/edit/delivery/[id]/page.tsx
 * - src/app/partner/campaign/edit/mission/[id]/page.tsx
 * - src/app/partner/campaign/edit/reporter/[id]/page.tsx
 * - src/app/partner/campaign/edit/review/[id]/page.tsx
 * - src/app/partner/campaign/edit/visit/[id]/page.tsx
 */

import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { CampaignFormData, CampaignType, PlatformType } from "@/types/domain/user";
import { parseRequirements } from "./parseRequirements";
import {
  CampaignConversionOptions,
  DEFAULT_PLATFORMS,
  BRAND_NAME_TO_PLATFORM,
  REGION_FULL_NAMES,
} from "./types";

/**
 * 플랫폼 이름 정규화
 *
 * 저장된 브랜드명을 표준 플랫폼 이름으로 변환합니다.
 */
function normalizePlatform(
  channelOrBrandName: string | undefined,
  campaignType: CampaignType
): string {
  if (!channelOrBrandName) {
    return DEFAULT_PLATFORMS[campaignType];
  }

  // 공백 제거 후 매핑 시도
  const normalized = channelOrBrandName.replace(/\s/g, "");
  const mapped = BRAND_NAME_TO_PLATFORM[normalized];

  return mapped || channelOrBrandName || DEFAULT_PLATFORMS[campaignType];
}

/**
 * 지역 정보 파싱 (방문형 전용)
 *
 * "서울 > 강남/서초" 형식을 파싱하여 region과 subRegion으로 분리합니다.
 */
function parseRegionData(regionString: string | undefined): {
  region: string;
  subRegion: string;
} {
  if (!regionString) {
    return { region: "", subRegion: "" };
  }

  // "서울 > 강남/서초" 형식 파싱
  const parts = regionString.split(">").map((s) => s.trim());
  if (parts.length < 2) {
    return { region: "", subRegion: "" };
  }

  const regionShort = parts[0]; // "서울"
  const subRegionRaw = parts[1].split("/")[0].trim(); // "강남"

  // 전체 지역명으로 변환
  const regionFull = REGION_FULL_NAMES[regionShort] || regionShort;

  // 시/구/군 접미사 추가
  let subRegion = subRegionRaw;
  if (
    subRegionRaw &&
    !subRegionRaw.includes("시") &&
    !subRegionRaw.includes("구") &&
    !subRegionRaw.includes("군")
  ) {
    // 기본적으로 "구" 추가 (강남 → 강남구)
    subRegion = subRegionRaw + "구";
  }

  return { region: regionFull, subRegion };
}

/**
 * 콘텐츠 타입 처리 (미션형, 구매평 전용)
 *
 * contentType에 따라 requireContentLink와 requireContentImage를 설정합니다.
 */
function parseContentType(contentType: string | undefined): {
  requireContentLink: boolean;
  requireContentImage: boolean;
} {
  if (!contentType) {
    return { requireContentLink: false, requireContentImage: false };
  }

  if (contentType === "link") {
    return { requireContentLink: true, requireContentImage: false };
  } else if (contentType === "image") {
    return { requireContentLink: false, requireContentImage: true };
  } else if (contentType === "both") {
    return { requireContentLink: true, requireContentImage: true };
  }

  return { requireContentLink: false, requireContentImage: false };
}

/**
 * 포인트 포맷 변환
 *
 * 숫자를 한국 로케일 문자열로 변환합니다.
 */
function formatPoints(points: number | undefined): string {
  if (!points) return "";
  return points.toLocaleString("ko-KR");
}

/**
 * 상세 이미지 URL 배열 추출
 *
 * 3가지 소스를 체크하여 상세 이미지 URL 배열을 추출합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDetailImageUrls(extended: Record<string, any> | undefined): string[] {
  if (!extended) return [];

  // 1순위: detailImagePreviews
  if (extended.detailImagePreviews && extended.detailImagePreviews.length > 0) {
    return extended.detailImagePreviews;
  }

  // 2순위: campaign_detail_images
  if (extended.campaign_detail_images && extended.campaign_detail_images.length > 0) {
    return extended.campaign_detail_images;
  }

  // 3순위: campaign_detail_image (단일 이미지를 배열로)
  if (extended.campaign_detail_image) {
    return [extended.campaign_detail_image];
  }

  return [];
}

/**
 * 모집기간 문자열 생성
 *
 * detailedSchedule에서 모집 기간을 "시작일 ~ 종료일" 형식으로 생성합니다.
 */
function formatRecruitmentPeriod(
  detailedSchedule: { applicationStart?: string; applicationEnd?: string } | undefined,
  fallback: string
): string {
  if (!detailedSchedule) return fallback;

  const { applicationStart, applicationEnd } = detailedSchedule;
  if (applicationStart && applicationEnd) {
    return `${applicationStart} ~ ${applicationEnd}`;
  }

  return fallback;
}

/**
 * 캠페인 데이터를 폼 데이터로 변환하는 통합 함수
 *
 * @param campaign - 캠페인 기본 정보
 * @param originalData - 타입별 확장 데이터
 * @param options - 변환 옵션 (타입별 특화 데이터)
 * @returns CampaignFormData
 */
export function campaignToFormData(
  campaign: CampaignWithApplicants,
  originalData?: object,
  options?: CampaignConversionOptions
): CampaignFormData {
  const info = campaign.campaignInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extended = originalData as Record<string, any> | undefined;
  const campaignType = info.campaignType as CampaignType;

  // Requirements 파싱 (공통)
  const requirements = extended?.requirements || [];
  const parsedRequirements = parseRequirements(requirements);

  // Guidelines 병합 (공통)
  const guidelines = extended?.guidelines || extended?.guidelineTexts?.join("\n\n") || "";

  // 모집기간 형식 변환 (공통)
  const recruitmentPeriod = formatRecruitmentPeriod(
    extended?.detailedSchedule,
    info.recruitmentPeriod || ""
  );

  // 추가 포인트 포맷 (공통)
  const additionalPoints = formatPoints(extended?.additionalPoints || extended?.points);

  // 상세 이미지 URL 배열 (공통)
  const detailImageUrls = extractDetailImageUrls(extended);

  // 타입별 특화 처리
  let platform = "";
  let brandName = "";
  let currentPoints = "";
  let promotionLink = "";
  let region = "";
  let subRegion = "";
  let visitLink = "";
  let visitAddress = "";
  let addressDetail = "";
  let purchasePoints = "";
  let purchasePeriod = "";
  let requireContentLink = false;
  let requireContentImage = false;

  switch (campaignType) {
    case "배송형":
      platform = normalizePlatform(extended?.channel || info.brandName, "배송형");
      brandName =
        options?.userBusinessName ||
        extended?.brandName ||
        extended?.channel ||
        info.brandName ||
        "";
      currentPoints = options?.currentPoints ? options.currentPoints.toLocaleString("ko-KR") : "0";
      promotionLink = extended?.promotionLink || "";
      break;

    case "미션형":
      platform = ""; // 미션형은 플랫폼 없음
      brandName = extended?.brandName || info.brandName || "";
      currentPoints = "58,000"; // 하드코딩
      promotionLink = extended?.productLink || "";
      const contentTypeResult = parseContentType(extended?.contentType);
      requireContentLink = contentTypeResult.requireContentLink;
      requireContentImage = contentTypeResult.requireContentImage;
      break;

    case "구매평":
      platform = normalizePlatform(extended?.channel || info.brandName, "구매평");
      brandName = extended?.brandName || info.brandName || "";
      currentPoints = "58,000";
      promotionLink = extended?.purchaseLink || "";
      purchasePoints = additionalPoints; // 동일 값
      purchasePeriod = extended?.detailedSchedule?.purchasePeriod || info.purchasePeriod || "";
      const reviewContentType = parseContentType(extended?.contentType);
      requireContentLink = reviewContentType.requireContentLink;
      requireContentImage = reviewContentType.requireContentImage;
      break;

    case "방문형":
      platform = normalizePlatform(extended?.channel || info.brandName, "방문형");
      brandName = extended?.brandName || info.brandName || "";
      currentPoints = "58,000";
      promotionLink = ""; // 방문형은 promotionLink 없음
      const regionData = parseRegionData(extended?.region);
      region = regionData.region;
      subRegion = regionData.subRegion;
      visitLink = extended?.visitLink || "";
      visitAddress = extended?.visitAddress || "";
      addressDetail = extended?.addressGuide || extended?.addressDetail || "";
      break;

    case "기자단":
      platform = normalizePlatform(extended?.channel || info.brandName, "기자단");
      brandName = extended?.brandName || extended?.channel || info.brandName || "";
      currentPoints = "58,000";
      promotionLink = extended?.productLink || "";
      break;
  }

  // 공통 필드 반환
  return {
    campaignType,
    platform: platform as PlatformType | "",
    title: info.title || "",
    category: extended?.subcategory || info.category || "기타",
    region,
    subRegion,
    brandName,
    providedItems: extended?.description || "",
    promotionLink,
    visitLink,
    visitAddress,
    addressDetail,
    currentPoints,
    purchasePoints,
    additionalPoints,
    recruitmentCount: String(info.totalCount || ""),
    recruitmentPeriod,
    purchasePeriod,
    announcementDate: extended?.detailedSchedule?.announcement || info.announcementDate || "",
    registrationPeriod:
      extended?.detailedSchedule?.registrationPeriod || info.registrationPeriod || "",
    keywords: extended?.keywords || extended?.keyword || "",
    adultOnly: extended?.adultOnly || false,
    allowReParticipation: extended?.allowReParticipation || false,
    allowLateSubmission: extended?.allowLateSubmission || false,
    minTextLength: extended?.minTextLength || parsedRequirements.minTextLength,
    minImageCount: extended?.minImageCount || parsedRequirements.minImageCount,
    videoCount: extended?.videoCount || parsedRequirements.videoCount,
    videoDuration: extended?.videoDuration || parsedRequirements.videoDuration,
    requireLinkAttachment:
      extended?.requireLinkAttachment !== undefined
        ? extended.requireLinkAttachment
        : parsedRequirements.requireLinkAttachment,
    requireKeywordAttachment:
      extended?.requireKeywordAttachment !== undefined
        ? extended.requireKeywordAttachment
        : parsedRequirements.requireKeywordAttachment,
    requireContentLink,
    requireContentImage,
    guidelines,
    contactPhone:
      (extended?.contactPhone as string | undefined) ||
      (campaign as { contactPhone?: string })?.contactPhone ||
      "010-0000-0000",
    fairTradeAgreement: true,
    isUrgent: extended?.isUrgent || false,
    thumbnailImageUrl: extended?.image || info.image || "",
    detailImagePreviews: detailImageUrls,
  };
}
