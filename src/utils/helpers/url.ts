/* ========================================
   🔗 URL 관련 헬퍼 함수
   ======================================== */

/**
 * 기존 파일에서 이동:
 * - src/utils/channelUrlHelper.ts
 * - src/utils/getCampaignDetailPath.ts
 */

import type { CampaignType } from "../constants/channels";
export type { CampaignType };

/* ========================================
   📺 채널 URL 생성
   ======================================== */

/**
 * 채널 타입과 채널 ID로부터 해당 채널의 URL을 생성
 *
 * @param channel - 채널 타입 (예: "네이버블로그", "인스타그램", "유튜브", "네이버클립")
 * @param channelId - 채널 ID 또는 사용자명
 * @returns 해당 채널의 전체 URL
 *
 * 예시:
 * ```ts
 * getChannelUrl("네이버블로그", "test123")
 * // => "https://blog.naver.com/test123"
 *
 * getChannelUrl("인스타그램", "test_user")
 * // => "https://www.instagram.com/test_user/"
 * ```
 */
export function getChannelUrl(channel: string, channelId: string): string {
  if (!channelId || !channelId.trim()) {
    return "#";
  }

  // channelId에서 @ 기호 제거 (인스타그램, 유튜브)
  const cleanId = channelId.replace(/^@+/, "").trim();

  // 이미 URL 형식인 경우 그대로 반환 (네이버클립 등)
  if (cleanId.startsWith("http://") || cleanId.startsWith("https://")) {
    return cleanId;
  }

  // 채널별 URL 생성
  switch (channel) {
    case "네이버블로그":
    case "NAVER_BLOG":
      return `https://blog.naver.com/${cleanId}`;

    case "네이버클립":
    case "NAVER_CLIP":
      return `https://clipcreators.naver.com/${cleanId}`;

    case "인스타그램":
    case "INSTAGRAM":
      return `https://www.instagram.com/${cleanId}/`;

    case "유튜브":
    case "YOUTUBE":
      if (cleanId.startsWith("@")) {
        return `https://www.youtube.com/${cleanId}`;
      }
      if (cleanId.startsWith("UC") && cleanId.length > 20) {
        return `https://www.youtube.com/channel/${cleanId}`;
      }
      return `https://www.youtube.com/@${cleanId}`;

    case "릴스":
    case "Reels":
    case "REELS":
    case "INSTAGRAM_REELS":
      return `https://www.instagram.com/${cleanId}/`;

    case "쇼츠":
    case "숏츠":
    case "Shorts":
    case "YOUTUBE_SHORTS":
      if (cleanId.startsWith("@")) {
        return `https://www.youtube.com/${cleanId}`;
      }
      if (cleanId.startsWith("UC") && cleanId.length > 20) {
        return `https://www.youtube.com/channel/${cleanId}`;
      }
      return `https://www.youtube.com/@${cleanId}`;

    default:
      return "#";
  }
}

/* ========================================
   🎯 캠페인 URL 생성
   ======================================== */

/**
 * 캠페인 타입을 URL 경로 형식으로 변환
 *
 * @param type - 캠페인 타입
 * @returns URL 경로 형식 (예: "delivery", "visit")
 */
export function getCampaignTypePath(type: CampaignType): string {
  const typeMap: Record<CampaignType, string> = {
    배송형: "delivery",
    방문형: "visit",
    구매평: "review",
    기자단: "reporter",
    미션형: "mission",
  };

  return typeMap[type] || "delivery";
}

/**
 * 캠페인 ID를 실제 캠페인 데이터의 ID 형식으로 변환
 *
 * @param type - 캠페인 타입
 * @param id - 캠페인 ID
 * @returns 변환된 캠페인 ID (예: "delivery_1")
 */
export function convertToCampaignDataId(type: CampaignType, id: string | number): string {
  const typePath = getCampaignTypePath(type);
  const strId = String(id);

  // ID가 이미 "delivery_1" 형식인지 확인
  if (strId.startsWith(`${typePath}_`)) {
    return strId;
  }

  // ID를 실제 캠페인 데이터 형식으로 변환
  return `${typePath}_${strId}`;
}

/**
 * 캠페인 상세 페이지 경로 생성
 *
 * @param type - 캠페인 타입
 * @param id - 캠페인 ID
 * @returns 상세 페이지 경로 (예: "/campaign/delivery/delivery_1")
 */
export function getCampaignDetailPath(type: CampaignType, id: string | number): string {
  const campaignTypePath = getCampaignTypePath(type);
  const campaignDataId = convertToCampaignDataId(type, id);
  return `/campaign/${campaignTypePath}/${campaignDataId}`;
}

/**
 * 채널 URL을 새 창에서 열기
 *
 * @param channel - 채널 타입 (예: "네이버블로그", "인스타그램", "유튜브")
 * @param channelId - 채널 ID 또는 사용자명
 *
 * 예시:
 * ```ts
 * openChannelUrl("인스타그램", "test_user")
 * // => 새 창에서 https://www.instagram.com/test_user/ 열기
 * ```
 */
export function openChannelUrl(channel: string, channelId: string): void {
  const linkUrl = getChannelUrl(channel, channelId);
  if (linkUrl && linkUrl !== "#") {
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  }
}
