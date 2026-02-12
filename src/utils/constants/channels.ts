/* ========================================
   📺 채널 관련 상수
   ======================================== */

/**
 * 지원되는 채널 이름 목록
 *
 * 용도:
 * - 채널 선택 드롭다운
 * - 채널 유효성 검증
 * - 채널별 분기 처리
 */
export const CHANNEL_NAMES = {
  NAVER_BLOG: '네이버블로그',
  NAVER_CLIP: '네이버클립',
  INSTAGRAM: '인스타그램',
  YOUTUBE: '유튜브',
  REELS: '릴스',
  SHORTS: '쇼츠',
} as const;

/**
 * 지원되는 채널 목록 (배열 형태)
 */
export const CHANNEL_LIST = Object.values(CHANNEL_NAMES);

/**
 * 캠페인 타입 상수
 *
 * 용도:
 * - 캠페인 타입별 분기 처리
 * - 타입 안전성 보장
 */
export const CAMPAIGN_TYPES = {
  DELIVERY: '배송형',
  VISIT: '방문형',
  REVIEW: '구매평',
  PRESS: '기자단',
  MISSION: '미션형',
} as const;

/**
 * 캠페인 타입 목록 (배열 형태)
 */
export const CAMPAIGN_TYPE_LIST = Object.values(CAMPAIGN_TYPES);

/**
 * 채널별 로고 이미지 경로
 *
 * 사용처:
 * - src/utils/channelLogoMap.ts 에서 사용
 * - 캠페인 카드 컴포넌트들
 */
export const CHANNEL_LOGO_PATHS = {
  NAVER_BLOG: '/images/brand_logo/naverblog.svg',
  NAVER_CLIP: '/images/brand_logo/naverclip.svg',
  INSTAGRAM: '/images/brand_logo/insta.svg',
  YOUTUBE: '/images/brand_logo/youtube.svg',
  REELS: '/images/brand_logo/reels.svg',
  SHORTS: '/images/brand_logo/shots.svg',
  REVIEW: '/images/brand_logo/review.svg',
  MISSION: '/images/brand_logo/misssion.svg',
  DEFAULT: '/images/icons/phone_verified.svg',
} as const;

/**
 * 채널 타입 (TypeScript 타입으로 사용)
 */
export type ChannelName = typeof CHANNEL_NAMES[keyof typeof CHANNEL_NAMES];

/**
 * 캠페인 타입 (TypeScript 타입으로 사용)
 */
export type CampaignType = typeof CAMPAIGN_TYPES[keyof typeof CAMPAIGN_TYPES];
